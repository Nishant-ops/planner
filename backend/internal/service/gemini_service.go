package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type GeminiService struct {
	apiKey string
	apiURL string
	client *http.Client
}

func NewGeminiService(apiKey, apiURL string) *GeminiService {
	return &GeminiService{
		apiKey: apiKey,
		apiURL: apiURL,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

type geminiRequest struct {
	Contents []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"contents"`
	SystemInstruction *struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"systemInstruction,omitempty"`
	GenerationConfig *struct {
		ResponseMimeType string `json:"responseMimeType,omitempty"`
	} `json:"generationConfig,omitempty"`
}

type geminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

// ChatCompletion sends a chat message to Gemini and returns the response
func (g *GeminiService) ChatCompletion(prompt, systemPrompt string) (string, error) {
	return g.callGeminiWithRetry(prompt, systemPrompt, false)
}

// ComplexityAnalysis analyzes code complexity
func (g *GeminiService) ComplexityAnalysis(code string) (string, error) {
	systemPrompt := `You are a Performance Engineer. Analyze the user's code for:
1. Time Complexity (Big O)
2. Space Complexity (Big O)
3. Identify the bottleneck line of code.
Be extremely concise. Use markdown.`

	return g.callGeminiWithRetry(code, systemPrompt, false)
}

// JudgeAudit validates code against a pattern and returns verdict
func (g *GeminiService) JudgeAudit(code, topic, problem, invariant string) (map[string]interface{}, error) {
	prompt := fmt.Sprintf(`
Pattern: %s
Problem: %s
Invariant Strategy: %s
User Code:
%s
`, topic, problem, invariant, code)

	systemPrompt := `
You are a ruthless Senior Engineer Auditor.
Your Goal: Verify the user used the specific O-notation strategy and Invariant for the given pattern.
1. If they used Brute Force instead of the Pattern, REJECT.
2. If they ignored the Invariant, REJECT.
3. If code is optimal, ADVANCE.
Output JSON: { "verdict": "ADVANCE" or "REPEAT", "feedback": "Short, sharp technical critique." }`

	resultStr, err := g.callGeminiWithRetry(prompt, systemPrompt, true)
	if err != nil {
		return nil, err
	}

	// Parse JSON response
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(resultStr), &result); err != nil {
		// If parsing fails, return error verdict
		return map[string]interface{}{
			"verdict":  "ERROR",
			"feedback": "Failed to parse AI response",
		}, nil
	}

	return result, nil
}

// JudgeCheckpoint validates checkpoint code against multiple required patterns
func (g *GeminiService) JudgeCheckpoint(code string, tier int, requiredPatterns []string, problemDescription string) (map[string]interface{}, error) {
	prompt := fmt.Sprintf(`
Tier %d Checkpoint Problem:
%s

Required Patterns (ALL must be present):
%v

User Code:
%s
`, tier, problemDescription, requiredPatterns, code)

	systemPrompt := `
You are an EXTREMELY STRICT checkpoint auditor.
This is a TIER CHECKPOINT - user must demonstrate mastery of ALL required patterns.

Critical Rules:
1. ALL patterns listed must be EXPLICITLY present in the code
2. If even ONE pattern is missing or implemented via brute force, REJECT immediately
3. Code must be optimal for ALL patterns (no O(N^2) when O(N) is possible with the pattern)
4. Verify pattern correctness (e.g., real binary search with log(N), not linear scan)
5. No shortcuts - each pattern must be properly implemented

Output JSON format:
{
  "verdict": "ADVANCE" or "REPEAT",
  "feedback": "Detailed critique of each pattern implementation (which worked, which didn't, and why)",
  "patterns_found": ["PATTERN1", "PATTERN2"],
  "missing_patterns": ["PATTERN3"]
}

If even ONE pattern is missing or incorrectly implemented, verdict MUST be "REPEAT".`

	resultStr, err := g.callGeminiWithRetry(prompt, systemPrompt, true)
	if err != nil {
		return nil, err
	}

	// Parse JSON response
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(resultStr), &result); err != nil {
		// If parsing fails, return error verdict
		return map[string]interface{}{
			"verdict":          "ERROR",
			"feedback":         "Failed to parse AI response",
			"patterns_found":   []string{},
			"missing_patterns": requiredPatterns,
		}, nil
	}

	// Ensure required fields exist
	if result["verdict"] == nil {
		result["verdict"] = "ERROR"
	}
	if result["feedback"] == nil {
		result["feedback"] = "No feedback provided"
	}
	if result["patterns_found"] == nil {
		result["patterns_found"] = []string{}
	}
	if result["missing_patterns"] == nil {
		result["missing_patterns"] = []string{}
	}

	return result, nil
}

// callGeminiWithRetry calls Gemini API with exponential backoff retry logic
func (g *GeminiService) callGeminiWithRetry(prompt, systemPrompt string, jsonMode bool) (string, error) {
	maxRetries := 3
	delay := time.Second

	var lastErr error
	for attempt := 0; attempt < maxRetries; attempt++ {
		result, err := g.callGemini(prompt, systemPrompt, jsonMode)
		if err == nil {
			return result, nil
		}

		lastErr = err
		if attempt < maxRetries-1 {
			time.Sleep(delay)
			delay *= 2 // Exponential backoff
		}
	}

	return "", fmt.Errorf("gemini API failed after %d attempts: %w", maxRetries, lastErr)
}

// callGemini makes a single API call to Gemini
func (g *GeminiService) callGemini(prompt, systemPrompt string, jsonMode bool) (string, error) {
	req := geminiRequest{
		Contents: []struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		}{
			{
				Parts: []struct {
					Text string `json:"text"`
				}{
					{Text: prompt},
				},
			},
		},
	}

	// Add system instruction if provided
	if systemPrompt != "" {
		req.SystemInstruction = &struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		}{
			Parts: []struct {
				Text string `json:"text"`
			}{
				{Text: systemPrompt},
			},
		}
	}

	// Set JSON mode if requested
	if jsonMode {
		req.GenerationConfig = &struct {
			ResponseMimeType string `json:"responseMimeType,omitempty"`
		}{
			ResponseMimeType: "application/json",
		}
	}

	// Encode request
	body, err := json.Marshal(req)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	url := fmt.Sprintf("%s?key=%s", g.apiURL, g.apiKey)
	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")

	// Send request
	resp, err := g.client.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Read response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	// Parse response
	var geminiResp geminiResponse
	if err := json.Unmarshal(respBody, &geminiResp); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty response from Gemini")
	}

	text := geminiResp.Candidates[0].Content.Parts[0].Text

	// If JSON mode, extract JSON from response (may have markdown code blocks)
	if jsonMode {
		// Find first { and last }
		start := bytes.IndexByte([]byte(text), '{')
		end := bytes.LastIndexByte([]byte(text), '}')
		if start >= 0 && end >= 0 && end > start {
			text = text[start : end+1]
		}
	}

	return text, nil
}
