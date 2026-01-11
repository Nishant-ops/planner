// Checkpoint Problems - Multi-pattern integration challenges
export const CHECKPOINTS_DB = {
  TIER_0: {
    id: "checkpoint_tier_0",
    tier: 0,
    title: "Subsets Generator",
    difficulty: "Medium",
    requiredTopics: ["ARRAY_SCAN", "RECURSION_ROOTS"],
    requiredPatterns: ["Array Iteration", "Recursive Backtracking"],
    description: "Given an array of unique integers, return all possible subsets (the power set). The solution set must not contain duplicate subsets. You must use recursive backtracking combined with array manipulation.",
    invariant: "Recursive exploration + Array state management",
    examples: [
      {
        input: "[1,2,3]",
        output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        explain: "All 8 (2^3) possible subsets including the empty set"
      },
      {
        input: "[0]",
        output: "[[],[0]]",
        explain: "Only 2 subsets: empty and the single element"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All numbers are unique",
      "Must use recursion (iterative solutions will be rejected)"
    ],
    hint: "Build subsets recursively by deciding to include or exclude each element"
  },

  TIER_1: {
    id: "checkpoint_tier_1",
    tier: 1,
    title: "Interval Merger with Validation",
    difficulty: "Hard",
    requiredTopics: ["ARRAY_SCAN", "RECURSION_ROOTS", "SORTING", "HASHING", "STACKS"],
    requiredPatterns: ["Sorting", "Hashing", "Stack"],
    description: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals. Additionally, validate that no interval appears more than once using a hash set, and use a stack to track the merge process. Return the final merged intervals sorted by start time.",
    invariant: "Sort intervals + Hash deduplication + Stack-based merging",
    examples: [
      {
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explain: "[1,3] and [2,6] overlap, merge to [1,6]"
      },
      {
        input: "[[1,4],[4,5]]",
        output: "[[1,5]]",
        explain: "Adjacent intervals merge when end equals next start"
      }
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
      "Must use sorting, hash set for deduplication, and stack for merging"
    ],
    hint: "Sort first, use hash to track seen intervals, push/pop from stack while merging"
  },

  TIER_2: {
    id: "checkpoint_tier_2",
    tier: 2,
    title: "Maximum Subarray with Constraints",
    difficulty: "Hard",
    requiredTopics: ["PREFIX_SUM", "TWO_POINTERS", "QUEUES", "LINKED_LISTS"],
    requiredPatterns: ["Prefix Sum", "Sliding Window", "Queue"],
    description: "Find the maximum sum of a subarray of size k, but the subarray must contain at least one element from a priority list. Use prefix sums for O(1) range queries, sliding window with two pointers to maintain the window, and a queue to track priority elements within the window.",
    invariant: "Prefix sum optimization + Sliding window + Queue state tracking",
    examples: [
      {
        input: "nums = [2,1,5,1,3,2], k = 3, priority = [1]",
        output: "9",
        explain: "Subarray [5,1,3] has sum 9 and contains priority element 1"
      },
      {
        input: "nums = [1,4,2,7,3], k = 2, priority = [4,7]",
        output: "11",
        explain: "Subarray [4,7] contains both priority elements, sum = 11"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "1 <= k <= nums.length",
      "1 <= priority.length <= 100",
      "Must use prefix sum array, two pointers, and queue"
    ],
    hint: "Build prefix sum array, slide window with left/right pointers, maintain queue of priority indices"
  },

  TIER_3: {
    id: "checkpoint_tier_3",
    tier: 3,
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    requiredTopics: ["SLIDING_WINDOW", "BINARY_SEARCH", "MONOTONIC_STACK"],
    requiredPatterns: ["Binary Search", "Monotonic Stack", "Sliding Window"],
    description: "Given an array of heights representing histogram bars, find the largest rectangular area. Use a monotonic increasing stack to track indices of bars, binary search to find optimal width boundaries, and sliding window logic to explore candidate rectangles.",
    invariant: "Monotonic stack for heights + Binary search on answer space + Window optimization",
    examples: [
      {
        input: "[2,1,5,6,2,3]",
        output: "10",
        explain: "Rectangle with height 5 and width 2 (indices 2-3) = 10"
      },
      {
        input: "[2,4]",
        output: "4",
        explain: "Single bar with height 4"
      }
    ],
    constraints: [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4",
      "Must use monotonic stack, binary search, and sliding window concepts"
    ],
    hint: "Stack stores indices where heights are increasing, binary search for boundaries, window tracks current rectangle"
  },

  TIER_4: {
    id: "checkpoint_tier_4",
    tier: 4,
    title: "Non-overlapping Intervals in Tree",
    difficulty: "Hard",
    requiredTopics: ["BINARY_TREES", "INTERVALS", "GREEDY"],
    requiredPatterns: ["Tree Traversal", "Interval Merging", "Greedy"],
    description: "Given a binary tree where each node contains an interval [start, end], find the maximum number of non-overlapping intervals you can select. Use tree traversal (DFS or BFS) to collect intervals, merge overlapping ones, then apply greedy selection by sorting by end time.",
    invariant: "Tree traversal + Interval sorting + Greedy selection",
    examples: [
      {
        input: "Tree: [1,3] -> [2,4], [5,7] | Intervals collected: [[1,3],[2,4],[5,7]]",
        output: "2",
        explain: "Select [1,3] and [5,7] (non-overlapping). Can't take [2,4] as it overlaps [1,3]"
      }
    ],
    constraints: [
      "1 <= tree.nodes <= 1000",
      "Intervals guaranteed to be valid [start <= end]",
      "Must use DFS/BFS, interval merging, and greedy algorithm"
    ],
    hint: "Traverse tree to collect intervals, sort by end time, greedily select non-overlapping"
  },

  TIER_5: {
    id: "checkpoint_tier_5",
    tier: 5,
    title: "Word Search II",
    difficulty: "Hard",
    requiredTopics: ["DFS_BFS", "BACKTRACKING", "TRIES"],
    requiredPatterns: ["Trie", "DFS", "Backtracking"],
    description: "Given an m x n board of characters and a list of words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically). Use a Trie to store the dictionary, DFS to traverse the board, and backtracking to explore/undo paths.",
    invariant: "Trie construction + DFS grid traversal + Backtracking with path tracking",
    examples: [
      {
        input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
        output: '["eat","oath"]',
        explain: "'eat' and 'oath' can be formed, 'pea' and 'rain' cannot"
      }
    ],
    constraints: [
      "m == board.length",
      "n == board[i].length",
      "1 <= m, n <= 12",
      "1 <= words.length <= 3 * 10^4",
      "Must build Trie, use DFS, implement backtracking"
    ],
    hint: "Insert all words into Trie, DFS from each cell, backtrack by marking/unmarking visited cells"
  },

  TIER_6: {
    id: "checkpoint_tier_6",
    tier: 6,
    title: "Course Schedule with Prerequisites",
    difficulty: "Hard",
    requiredTopics: ["TOPOLOGICAL_SORT", "UNION_FIND", "BIT_MANIPULATION"],
    requiredPatterns: ["Topological Sort", "Union-Find", "Bit Manipulation"],
    description: "Given courses with prerequisites and state requirements (represented as bitmasks), find a valid course ordering. Use topological sort for prerequisite ordering, union-find to detect connected course groups, and bit manipulation to validate state requirements (bitmask operations for course completion states).",
    invariant: "Topological sort for ordering + Union-find for groups + Bitmask state validation",
    examples: [
      {
        input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]], states = [1,2,4,7]",
        output: "[0,1,2,3]",
        explain: "Valid order respecting prerequisites and state requirements (bitmask)"
      }
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "States represented as integers (bitmasks)",
      "Must use topological sort, union-find, and bit manipulation"
    ],
    hint: "Build graph, use Kahn's algorithm (topological), union-find for components, bitmask for state checks"
  }
};

// Helper function to get checkpoint by tier
export const getCheckpointByTier = (tier) => {
  return CHECKPOINTS_DB[`TIER_${tier}`] || null;
};

// Get all checkpoints as array
export const getAllCheckpoints = () => {
  return Object.values(CHECKPOINTS_DB);
};
