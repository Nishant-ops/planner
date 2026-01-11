package data

// Problem represents a coding problem
type Problem struct {
	ID          string            `json:"id"`
	Title       string            `json:"title"`
	Diff        string            `json:"diff"`
	Invariant   string            `json:"invariant"`
	Description string            `json:"description"`
	Examples    []ProblemExample  `json:"examples"`
	Constraints []string          `json:"constraints"`
}

type ProblemExample struct {
	Input   string `json:"input"`
	Output  string `json:"output"`
	Explain string `json:"explain,omitempty"`
}

// ProblemsDB maps topic keys to their problems
var ProblemsDB = map[string][]Problem{
	"ARRAY_SCAN": {
		{
			ID:        "run_sum",
			Title:     "Running Sum of 1d Array",
			Diff:      "Easy",
			Invariant: "State: prev_sum + curr.",
			Description: "Given an array nums. We define a running sum of an array as runningSum[i] = sum(nums[0]...nums[i]). Return the running sum of nums.",
		},
		{
			ID:        "prod_except",
			Title:     "Product of Array Except Self",
			Diff:      "Medium",
			Invariant: "Two pass: Prefix * Suffix.",
		},
		{
			ID:        "max_subarray",
			Title:     "Maximum Subarray (Kadane)",
			Diff:      "Medium",
			Invariant: "Local max vs Global max.",
		},
	},
	"SORTING": {
		{
			ID:        "missing_num",
			Title:     "Missing Number",
			Diff:      "Easy",
			Invariant: "Sum formula or cyclic sort logic.",
		},
		{
			ID:        "sort_colors",
			Title:     "Sort Colors",
			Diff:      "Medium",
			Invariant: "Dutch National Flag: 3-way partition.",
		},
		{
			ID:        "kth_largest",
			Title:     "Kth Largest Element in an Array",
			Diff:      "Medium",
			Invariant: "QuickSelect or Heap pivot logic.",
		},
	},
	// Add remaining topics...
	// (truncated for brevity)
}
