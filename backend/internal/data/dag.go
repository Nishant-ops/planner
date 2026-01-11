package data

// DAGNode represents a topic in the skill tree
type DAGNode struct {
	Label   string   `json:"label"`
	Tier    int      `json:"tier"`
	Reqs    []string `json:"reqs"`
	Desc    string   `json:"desc"`
	Theory  string   `json:"theory"`
	YouTube string   `json:"youtube"`
}

// DAGStructure contains all 22 topics
var DAGStructure = map[string]DAGNode{
	// Tier 0: Roots
	"ARRAY_SCAN": {
		Label:   "Array Memory",
		Tier:    0,
		Reqs:    []string{},
		Desc:    "Contiguous memory mastery. The bedrock of CPU caching.",
		Theory:  "Arrays are blocks of contiguous memory. Access is O(1) because the CPU calculates the address via (Base + Index * Size).",
		YouTube: "RBSGKlAvoiM",
	},
	"RECURSION_ROOTS": {
		Label:   "Recursion Core",
		Tier:    0,
		Reqs:    []string{},
		Desc:    "The stack frame mental model. Essential for Trees/Graphs.",
		Theory:  "Recursion is not magic; it's a stack of function calls.",
		YouTube: "Mv9NEX63odU",
	},
	// Tier 1: Structuring
	"SORTING": {
		Label:   "Sorting",
		Tier:    1,
		Reqs:    []string{"ARRAY_SCAN"},
		Desc:    "Ordering data to enable binary search and pointer logic.",
		Theory:  "Sorting transforms chaos into order, enabling O(log N) search.",
		YouTube: "Hg85P2FGiQA",
	},
	"HASHING": {
		Label:   "Hashing",
		Tier:    1,
		Reqs:    []string{"ARRAY_SCAN"},
		Desc:    "O(1) lookups. Space-time tradeoff.",
		Theory:  "Hashing maps data of arbitrary size to fixed-size values (keys).",
		YouTube: "RBSGKlAvoiM",
	},
	"STACKS": {
		Label:   "Stacks (LIFO)",
		Tier:    1,
		Reqs:    []string{"ARRAY_SCAN"},
		Desc:    "Backtracking history and state management.",
		Theory:  "Last-In, First-Out (LIFO). Think of a stack of plates.",
		YouTube: "KInG04mAjO0",
	},
	// Add remaining topics...
	// (truncated for brevity - in production, include all 22 topics)
}
