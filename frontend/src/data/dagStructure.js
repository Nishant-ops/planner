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
    modules: [
      {
        title: "🧱 Memory Fundamentals",
        content: "Arrays store elements in **contiguous memory blocks**. This means elements are placed right next to each other in RAM. When you declare `int arr[5]`, the computer allocates 5 consecutive memory slots.\n\n**Key Insight:** The CPU can calculate any element's address using the formula: `Address = Base + (Index × ElementSize)`. This is why array access is O(1) - it's just one arithmetic operation!\n\n**Cache Locality:** Because elements are contiguous, accessing arr[i] often loads arr[i+1] into CPU cache automatically, making sequential scans extremely fast."
      },
      {
        title: "⚡ Core Operations",
        content: "**Access: O(1)** - Direct indexing via pointer arithmetic\n**Search: O(N)** - Must check each element (unless sorted)\n**Insert: O(N)** - Shifting elements to make space\n**Delete: O(N)** - Shifting elements to fill gaps\n\n**Why O(N) for modifications?** When you insert at index 2 in an array of 10 elements, you must shift elements 2-9 one position right. That's 8 operations. In the worst case (inserting at index 0), you shift N elements."
      },
      {
        title: "🎯 Common Patterns",
        content: "**1. Two Pointers:** Use `left` and `right` indices moving toward each other. Perfect for palindrome checks or pair sums.\n\n**2. Sliding Window:** Maintain a window of elements [i, j] and slide it across the array. Used for subarrays and substrings.\n\n**3. Frequency Counting:** Use a HashMap to count occurrences. Enables O(N) solutions for finding duplicates.\n\n**4. In-place Modification:** Swap elements instead of creating new arrays. Saves O(N) space."
      },
      {
        title: "⚠️ Edge Cases & Gotchas",
        content: "**Empty Array:** Always check `if (arr.length === 0)` before accessing arr[0]\n\n**Index Out of Bounds:** Accessing arr[10] when length is 5 causes crashes or undefined behavior\n\n**Off-by-One Errors:** Array indices are 0-based. The last element is arr[length-1], not arr[length]\n\n**Duplicates:** Does your algorithm work when all elements are the same? [5,5,5,5]\n\n**Negative Numbers:** Many algorithms assume positive integers. Test with [-3, -1, 2]"
      },
      {
        title: "🚀 Optimization Techniques",
        content: "**Avoid Nested Loops When Possible:** Two nested loops = O(N²). Look for O(N) solutions using HashMaps or sorting first.\n\n**Sort for Free Wins:** Sorting is O(N log N) but enables O(log N) binary search and O(N) two-pointer solutions.\n\n**In-place vs Extra Space:** Modifying the input array saves space but may destroy original data. Clone if needed: `arr.slice()`\n\n**Early Exit:** If searching for an element, return immediately when found. Don't scan the entire array."
      },
      {
        title: "💡 When to Use Arrays",
        content: "**Use Arrays When:**\n- You need random access (arr[42])\n- Elements are homogeneous (all same type)\n- Size is known or doesn't change often\n- Memory locality matters (performance-critical loops)\n\n**Avoid Arrays When:**\n- Frequent insertions/deletions in the middle (use LinkedList)\n- Unknown size that grows frequently (use dynamic arrays/vectors)\n- Need fast search by key (use HashMap)\n- Elements vary in type (use objects/structs)"
      }
    ]
  },
  RECURSION_ROOTS: {
    label: "Recursion Core",
    tier: 0,
    reqs: [],
    desc: "The stack frame mental model. Essential for Trees/Graphs.",
    theory: "Recursion is not magic; it's a stack of function calls. Every recursive step adds a frame to the Call Stack. You must identify the 'Base Case' (when to stop) and the 'Recursive Step' (how to shrink the problem). Without a base case, you get a Stack Overflow.",
    youtube: "Mv9NEX63odU",
    modules: [
      {
        title: "📚 What is Recursion?",
        content: "Recursion is when a function calls itself to solve smaller versions of the same problem. Think of Russian nesting dolls - each doll contains a smaller version of itself.\n\n**Key Insight:** Every recursive function needs two parts:\n1. **Base Case:** The stopping condition (smallest doll)\n2. **Recursive Case:** The self-call with a smaller problem\n\n**Example:** `factorial(5) = 5 × factorial(4) = 5 × 4 × factorial(3)...` until we reach `factorial(0) = 1` (base case)"
      },
      {
        title: "🎯 The Call Stack",
        content: "**Call Stack:** A data structure that tracks function calls. Each recursive call adds a new **stack frame** containing:\n- Function parameters\n- Local variables\n- Return address\n\n**Example Flow for factorial(3):**\n```\nfactorial(3) → calls factorial(2)\n  factorial(2) → calls factorial(1)\n    factorial(1) → calls factorial(0)\n      factorial(0) → returns 1 (base case)\n    factorial(1) → returns 1 × 1 = 1\n  factorial(2) → returns 2 × 1 = 2\nfactorial(3) → returns 3 × 2 = 6\n```\n\n**Stack Depth:** Each call uses memory. Too many calls = **Stack Overflow Error**"
      },
      {
        title: "⚡ Base Case vs Recursive Case",
        content: "**Base Case:** The simplest version of the problem that can be solved directly without recursion.\n- factorial(0) = 1\n- fibonacci(0) = 0, fibonacci(1) = 1\n- sum of empty array = 0\n\n**Recursive Case:** How to break the problem into smaller pieces.\n- factorial(n) = n × factorial(n-1)\n- fibonacci(n) = fibonacci(n-1) + fibonacci(n-2)\n- sum(array) = array[0] + sum(array[1:])\n\n**Critical:** Always make progress toward the base case! `factorial(n) = n × factorial(n)` creates infinite recursion."
      },
      {
        title: "🔄 Recursion Tree",
        content: "**Visualization:** Draw a tree where each node is a function call.\n\n**Example: fibonacci(4)**\n```\n         fib(4)\n        /      \\\n    fib(3)     fib(2)\n    /    \\      /    \\\n fib(2) fib(1) fib(1) fib(0)\n /   \\\nfib(1) fib(0)\n```\n\n**Notice:** fib(2) is calculated 2 times! This is why naive fibonacci is O(2^N) - massive duplication.\n\n**Solution:** Memoization (caching results) reduces this to O(N)"
      },
      {
        title: "💡 When to Use Recursion",
        content: "**Use Recursion When:**\n- Problem has a natural recursive structure (trees, graphs)\n- Divide-and-conquer solutions (merge sort, quick sort)\n- Backtracking (generating permutations, N-Queens)\n- Mathematical definitions (factorial, fibonacci)\n\n**Avoid Recursion When:**\n- Simple iteration works (use loops instead)\n- Deep recursion (risk stack overflow)\n- No memoization for overlapping subproblems\n\n**Trade-off:** Recursion is elegant but uses more memory (stack frames) than iteration"
      },
      {
        title: "🚀 Optimization: Tail Recursion",
        content: "**Tail Recursion:** When the recursive call is the last operation in the function.\n\n**Not Tail Recursive:**\n```javascript\nfunction factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n-1); // multiplication AFTER recursive call\n}\n```\n\n**Tail Recursive:**\n```javascript\nfunction factorial(n, acc = 1) {\n  if (n === 0) return acc;\n  return factorial(n-1, n * acc); // recursive call is LAST\n}\n```\n\n**Benefit:** Some compilers optimize tail recursion into a loop (Tail Call Optimization), preventing stack overflow"
      }
    ]
  },

  // TIER 1: STRUCTURING
  SORTING: {
    label: "Sorting",
    tier: 1,
    reqs: ["ARRAY_SCAN"],
    desc: "Ordering data to enable binary search and pointer logic.",
    theory: "Sorting transforms chaos into order, enabling O(log N) search and O(N) two-pointer techniques. While language libraries use efficient sorts (O(N log N)), knowing *how* QuickSort (partitioning) and MergeSort (divide & conquer) work is crucial for custom sorting logic.",
    youtube: "Hg85P2FGiQA",
    modules: [
      {
        title: "📊 Why Sorting Matters",
        content: "Sorting is the gateway to optimization. Many O(N²) brute-force solutions become O(N log N) or even O(N) after sorting.\n\n**Key Benefits:**\n- Enables Binary Search: O(log N) instead of O(N)\n- Two Pointers: Find pairs/triplets in O(N)\n- Grouping: Identical elements become adjacent\n- Range Queries: Find min/max in subarrays efficiently\n\n**Cost:** Sorting itself is O(N log N), but this one-time cost unlocks faster operations"
      },
      {
        title: "⚡ Sorting Algorithms Overview",
        content: "**Comparison-Based (O(N log N)):**\n- **Quick Sort:** Partition around pivot, average O(N log N), worst O(N²)\n- **Merge Sort:** Divide & conquer, stable, always O(N log N)\n- **Heap Sort:** Use heap data structure, O(N log N), in-place\n\n**Linear Time (O(N)) - Special Cases:**\n- **Counting Sort:** When range is small (0-100)\n- **Radix Sort:** Sort by digits/characters\n- **Bucket Sort:** Distribute into buckets\n\n**Simple but Slow (O(N²)):**\n- **Bubble Sort, Selection Sort, Insertion Sort:** Only for tiny arrays or educational purposes"
      },
      {
        title: "🎯 Quick Sort Intuition",
        content: "**Idea:** Pick a pivot element, partition array so all smaller elements go left, all larger go right. Recursively sort both halves.\n\n**Partition Logic:**\n```\n[3, 7, 1, 9, 2] pivot=2\n↓\n[1] 2 [3, 7, 9]\n```\n\n**Time Complexity:**\n- Best/Average: O(N log N)\n- Worst: O(N²) when pivot is always min/max (sorted array)\n\n**Optimization:** Random pivot or \"median-of-three\" reduces worst case likelihood\n\n**Space:** O(log N) for recursion stack"
      },
      {
        title: "🔄 Merge Sort Intuition",
        content: "**Idea:** Divide array in half repeatedly until single elements, then merge sorted halves.\n\n**Example:**\n```\n[38, 27, 43, 3]\n    ↓ split\n[38, 27] [43, 3]\n    ↓ split\n[38] [27] [43] [3]\n    ↓ merge\n[27, 38] [3, 43]\n    ↓ merge\n[3, 27, 38, 43]\n```\n\n**Time:** Always O(N log N) - no worst case!\n**Space:** O(N) for temporary arrays\n**Stable:** Preserves relative order of equal elements"
      },
      {
        title: "💡 Custom Sorting",
        content: "**Built-in Sort with Comparator:**\nMost languages let you define custom sort logic.\n\n**JavaScript:**\n```javascript\n// Sort by absolute value\narr.sort((a, b) => Math.abs(a) - Math.abs(b));\n\n// Sort objects by property\npeople.sort((a, b) => a.age - b.age);\n\n// Descending order\narr.sort((a, b) => b - a);\n```\n\n**Comparator Rules:**\n- Return negative if a < b\n- Return positive if a > b\n- Return 0 if equal"
      },
      {
        title: "🚀 Common Patterns",
        content: "**Pattern 1: Sort + Two Pointers**\nFind two numbers that sum to target in O(N log N)\n\n**Pattern 2: Sort + Binary Search**\nFind if element exists in O(log N) after O(N log N) sort\n\n**Pattern 3: Sort by Frequency**\nSort by how often elements appear (requires counting first)\n\n**Pattern 4: Interval Sorting**\nSort intervals by start time to merge overlapping ranges\n\n**Pattern 5: Custom Criteria**\nSort meetings by end time (greedy algorithms)"
      }
    ]
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
  DYNAMIC_PROGRAMMING: {
    label: "Dynamic Prog",
    tier: 5,
    reqs: ["RECURSION_ROOTS"],
    desc: "Memoization and Tabulation. Essential for interviews.",
    theory: "Optimization of plain recursion. If a problem has overlapping subproblems, cache the result. Top-Down = Recursion + Memoization. Bottom-Up = Iteration + Tabulation. It turns exponential time O(2^N) into polynomial time O(N^2).",
    youtube: "Hdr64lNM3Vk",
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


};
