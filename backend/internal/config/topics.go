package config

// AllTopics contains the keys for all 22 DSA topics in the skill tree
var AllTopics = []string{
	// Tier 0: Roots
	"ARRAY_SCAN",
	"RECURSION_ROOTS",

	// Tier 1: Structuring
	"SORTING",
	"HASHING",
	"STACKS",

	// Tier 2: Patterns
	"PREFIX_SUM",
	"TWO_POINTERS",
	"QUEUES",
	"LINKED_LISTS",

	// Tier 3: Advanced Linear
	"SLIDING_WINDOW",
	"BINARY_SEARCH",
	"MONOTONIC_STACK",

	// Tier 4: Hierarchical
	"BINARY_TREES",
	"INTERVALS",
	"GREEDY",

	// Tier 5: Graph & Search
	"DFS_BFS",
	"BACKTRACKING",
	"TRIES",

	// Tier 6: Complex Graph & Specialist
	"TOPOLOGICAL_SORT",
	"UNION_FIND",
	"BIT_MANIPULATION",

	// Tier 7: Endgame
	"DYNAMIC_PROGRAMMING",
}
