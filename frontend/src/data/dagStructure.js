// DAG Structure - 22 DSA topics organized in 8 tiers
export const DAG_STRUCTURE = {
  // TIER 0: ROOTS
  ARRAY_SCAN: {
    label: "Array Memory",
    tier: 0,
    reqs: [],
    desc: "Contiguous memory mastery. The bedrock of CPU caching.",
    theory: "Arrays are blocks of contiguous memory. Access is O(1) because the CPU calculates the address via (Base + Index * Size). However, insertion/deletion is O(N) because elements must shift. Mastery here means understanding how to iterate efficiently without redundant passes.",
    youtube: "RBSGKlAvoiM",
  },
  RECURSION_ROOTS: {
    label: "Recursion Core",
    tier: 0,
    reqs: [],
    desc: "The stack frame mental model. Essential for Trees/Graphs.",
    theory: "Recursion is not magic; it's a stack of function calls. Every recursive step adds a frame to the Call Stack. You must identify the 'Base Case' (when to stop) and the 'Recursive Step' (how to shrink the problem). Without a base case, you get a Stack Overflow.",
    youtube: "Mv9NEX63odU",
  },

  // TIER 1: STRUCTURING
  SORTING: {
    label: "Sorting",
    tier: 1,
    reqs: ["ARRAY_SCAN"],
    desc: "Ordering data to enable binary search and pointer logic.",
    theory: "Sorting transforms chaos into order, enabling O(log N) search and O(N) two-pointer techniques. While language libraries use efficient sorts (O(N log N)), knowing *how* QuickSort (partitioning) and MergeSort (divide & conquer) work is crucial for custom sorting logic.",
    youtube: "Hg85P2FGiQA",
  },
  HASHING: {
    label: "Hashing",
    tier: 1,
    reqs: ["ARRAY_SCAN"],
    desc: "O(1) lookups. Space-time tradeoff.",
    theory: "Hashing maps data of arbitrary size to fixed-size values (keys). It allows O(1) retrieval, trading memory space for speed. The key invariant is handling collisions—when two inputs map to the same key. It is the ultimate tool for frequency counting and lookups.",
    youtube: "RBSGKlAvoiM",
  },
  STACKS: {
    label: "Stacks (LIFO)",
    tier: 1,
    reqs: ["ARRAY_SCAN"],
    desc: "Backtracking history and state management.",
    theory: "Last-In, First-Out (LIFO). Think of a stack of plates. You can only push to the top and pop from the top. Stacks are used for undo mechanisms, parsing syntax (parentheses), and depth-first search (DFS).",
    youtube: "KInG04mAjO0",
  },

  // TIER 2: PATTERNS
  PREFIX_SUM: {
    label: "Prefix Sums",
    tier: 2,
    reqs: ["ARRAY_SCAN"],
    desc: "Pre-computation for O(1) range queries.",
    theory: "If you need to calculate the sum of a subarray multiple times, don't iterate. Pre-calculate a 'Prefix Array' where P[i] is the sum of all nums up to i. The sum of range [i, j] then becomes simply P[j] - P[i-1]. It's a classic Space vs. Time tradeoff.",
    youtube: "pVS3yhlzrlQ",
  },
  TWO_POINTERS: {
    label: "Two Pointers",
    tier: 2,
    reqs: ["SORTING"],
    desc: "Converging on solutions in linear time.",
    theory: "On a sorted array, use two pointers (usually Left and Right) to process the data. By comparing the values at L and R, you can decide which pointer to move, reducing the search space linearly O(N) instead of using nested loops O(N^2).",
    youtube: "-GJ1GV4khSc",
  },
  QUEUES: {
    label: "Queues (FIFO)",
    tier: 2,
    reqs: ["STACKS"],
    desc: "Processing streams and breadth-first flows.",
    theory: "First-In, First-Out (FIFO). Like a line at a coffee shop. Essential for Breadth-First Search (BFS) where you explore neighbors layer by layer. Also critical for sliding window buffers.",
    youtube: "DkK8g6RBJs8",
  },
  LINKED_LISTS: {
    label: "Linked Lists",
    tier: 2,
    reqs: ["ARRAY_SCAN", "RECURSION_ROOTS"],
    desc: "Dynamic non-contiguous memory.",
    theory: "Nodes scattered in memory, connected by pointers. Unlike arrays, you cannot access index i instantly; you must traverse. However, insertion and deletion are O(1) if you have the pointer. The 'Runner Technique' (Fast & Slow pointers) is key here.",
    youtube: "WwfhLC16bis",
  },

  // TIER 3: ADVANCED LINEAR
  SLIDING_WINDOW: {
    label: "Sliding Window",
    tier: 3,
    reqs: ["TWO_POINTERS", "HASHING"],
    desc: "Dynamic range optimization.",
    theory: "Convert O(N^2) nested loops into O(N) by maintaining a 'window' of state. Expand the window (Right pointer) to satisfy a condition, then shrink it (Left pointer) to optimize. It's like a caterpillar moving across the array.",
    youtube: "GCm7m5671Ps",
  },
  BINARY_SEARCH: {
    label: "Binary Search",
    tier: 3,
    reqs: ["SORTING"],
    desc: "Logarithmic space reduction.",
    theory: "If the search space is sorted (or monotonic), check the middle. If target < mid, discard the right half. If target > mid, discard the left half. You cut the problem size in half every step. O(log N) is extremely fast.",
    youtube: "s4DPM8ct1pI",
  },
  MONOTONIC_STACK: {
    label: "Monotonic Stack",
    tier: 3,
    reqs: ["STACKS"],
    desc: "Finding next greater/smaller elements in O(N).",
    theory: "A stack where elements are always sorted (increasing or decreasing). If a new element breaks the order, pop from the stack until order is restored. The popped elements have found their 'Next Greater/Smaller' element. Essential for histogram and weather problems.",
    youtube: "Dq_ObZwTY_Q",
  },

  // TIER 4: HIERARCHICAL
  BINARY_TREES: {
    label: "Binary Trees",
    tier: 4,
    reqs: ["RECURSION_ROOTS", "QUEUES"],
    desc: "Hierarchical data storage and traversal.",
    theory: "Data organized hierarchically. Each node has at most two children. Mastery involves recursive traversal: Preorder (Self, Left, Right), Inorder (Left, Self, Right), and Postorder (Left, Right, Self). Height is O(log N) if balanced.",
    youtube: "OnSn2XEQ4MY",
  },
  INTERVALS: {
    label: "Intervals",
    tier: 4,
    reqs: ["SORTING", "GREEDY"],
    desc: "Managing overlapping timelines.",
    theory: "Problems involving start and end times. The golden rule: SORT BY START TIME first. Once sorted, you can iterate linearly to merge overlaps or find gaps. It's a specific application of Sorting + Greedy.",
    youtube: "44H3cEC2fFM",
  },
  GREEDY: {
    label: "Greedy",
    tier: 4,
    reqs: ["SORTING"],
    desc: "Local optimization for global solutions.",
    theory: "Making the locally optimal choice at each step with the hope of finding a global optimum. It works only if the problem has 'Optimal Substructure'. If making a greedy choice now prevents a better choice later, Greedy fails (and you need DP).",
    youtube: "bC7o8P_Ste4",
  },

  // TIER 5: GRAPH & SEARCH
  DFS_BFS: {
    label: "Graph Search",
    tier: 5,
    reqs: ["BINARY_TREES", "HASHING", "STACKS", "QUEUES"],
    desc: "Navigating arbitrary networks.",
    theory: "DFS dives deep (using a Stack/Recursion), useful for pathfinding and exhausting possibilities. BFS explores layer-by-layer (using a Queue), guaranteeing the shortest path in unweighted graphs. Always track 'visited' nodes to avoid cycles.",
    youtube: "PMMc4VsIacU",
  },
  BACKTRACKING: {
    label: "Backtracking",
    tier: 5,
    reqs: ["RECURSION_ROOTS", "DFS_BFS"],
    desc: "Brute-force with pruning.",
    theory: "A refined brute force. Build a candidate solution step-by-step. If a candidate violates the rules (e.g., Queens attacking each other), abandon it ('backtrack') and try the next option. It explores the 'Decision Tree' of the problem.",
    youtube: "pfiQ_PS1g8E",
  },
  TRIES: {
    label: "Tries",
    tier: 5,
    reqs: ["BINARY_TREES", "HASHING"],
    desc: "Prefix trees for string retrieval.",
    theory: "A tree optimized for strings. Each node represents a character. Paths from the root form words. Extremely efficient for prefix lookups and autocomplete, where checking a prefix is O(Length of Word) independent of the dictionary size.",
    youtube: "oObPgJJdixI",
  },

  // TIER 6: COMPLEX GRAPH & SPECIALIST
  TOPOLOGICAL_SORT: {
    label: "Topo Sort",
    tier: 6,
    reqs: ["DFS_BFS"],
    desc: "Dependency resolution in DAGs.",
    theory: "Linear ordering of vertices where for every edge U->V, U comes before V. Used for scheduling tasks with dependencies. Implementation uses DFS (Post-order reversal) or Kahn's Algorithm (In-degree counting). Only works on Directed Acyclic Graphs.",
    youtube: "eL-KzMXSXXI",
  },
  UNION_FIND: {
    label: "Union Find",
    tier: 6,
    reqs: ["DFS_BFS", "ARRAY_SCAN"],
    desc: "Disjoint set management and cycle detection.",
    theory: "A data structure to track elements partitioned into disjoint sets. Supports two near-O(1) operations: Union (merge two sets) and Find (determine which set an element belongs to). Essential for Kruskal's algorithm and connecting network components.",
    youtube: "ayW5B2WdBhE",
  },
  BIT_MANIPULATION: {
    label: "Bitwise Logic",
    tier: 6,
    reqs: ["ARRAY_SCAN"],
    desc: "Hardware-level boolean algebra. XOR, AND, shifting.",
    theory: "Manipulating raw bits. XOR is crucial: X^X=0 and X^0=X. Shifting left (<<) multiplies by 2, right (>>) divides by 2. It allows for extremely compact state representation (bitmasks) and O(1) mathematical tricks.",
    youtube: "NLKQEOgBzpA",
  },

  // TIER 7: THE ENDGAME
  DYNAMIC_PROGRAMMING: {
    label: "Dynamic Prog",
    tier: 7,
    reqs: ["BACKTRACKING"],
    desc: "Memoization and Tabulation. The final boss.",
    theory: "Optimization of plain recursion. If a problem has overlapping subproblems (you solve the same state multiple times), cache the result. Top-Down = Recursion + Memoization. Bottom-Up = Iteration + Tabulation. It turns exponential time O(2^N) into polynomial time O(N^2).",
    youtube: "Hdr64lNM3Vk",
  },
};
