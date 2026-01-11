import React, { useState, useEffect, useRef } from "react";
import {
  Network,
  Lock,
  CheckCircle,
  AlertTriangle,
  Zap,
  BookOpen,
  Code,
  ChevronRight,
  Target,
  Flame,
  Shield,
  ArrowRight,
  Loader2,
  Play,
  Layout,
  GitMerge,
  GitCommit,
  GitPullRequest,
  Terminal,
  Cpu,
  Layers,
  Database,
  Globe,
  MessageSquare,
  Brain,
  Sparkles,
  X,
  Activity,
  MonitorPlay,
  GraduationCap,
  FileText,
  List,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// --- CONFIG ---
const apiKey = ""; // Set your API key here or use process.env

// --- THE DAG ARCHITECTURE ---
const DAG_STRUCTURE = {
  // --- TIER 0: ROOTS ---
  ARRAY_SCAN: {
    label: "Array Memory",
    tier: 0,
    reqs: [],
    desc: "Contiguous memory mastery. The bedrock of CPU caching.",
    theory:
      "Arrays are blocks of contiguous memory. Access is O(1) because the CPU calculates the address via (Base + Index * Size). However, insertion/deletion is O(N) because elements must shift. Mastery here means understanding how to iterate efficiently without redundant passes.",
    youtube: "RBSGKlAvoiM", // Computer Science - Array
  },
  RECURSION_ROOTS: {
    label: "Recursion Core",
    tier: 0,
    reqs: [],
    desc: "The stack frame mental model. Essential for Trees/Graphs.",
    theory:
      "Recursion is not magic; it's a stack of function calls. Every recursive step adds a frame to the Call Stack. You must identify the 'Base Case' (when to stop) and the 'Recursive Step' (how to shrink the problem). Without a base case, you get a Stack Overflow.",
    youtube: "Mv9NEX63odU", // Computerphile - Recursion
  },

  // --- TIER 1: STRUCTURING ---
  SORTING: {
    label: "Sorting",
    tier: 1,
    reqs: ["ARRAY_SCAN"],
    desc: "Ordering data to enable binary search and pointer logic.",
    theory:
      "Sorting transforms chaos into order, enabling O(log N) search and O(N) two-pointer techniques. While language libraries use efficient sorts (O(N log N)), knowing *how* QuickSort (partitioning) and MergeSort (divide & conquer) work is crucial for custom sorting logic.",
    youtube: "Hg85P2FGiQA", // Neetcode - Sorting
  },
  HASHING: {
    label: "Hashing",
    tier: 1,
    reqs: ["ARRAY_SCAN"],
    desc: "O(1) lookups. Space-time tradeoff.",
    theory:
      "Hashing maps data of arbitrary size to fixed-size values (keys). It allows O(1) retrieval, trading memory space for speed. The key invariant is handling collisions—when two inputs map to the same key. It is the ultimate tool for frequency counting and lookups.",
    youtube: "RBSGKlAvoiM", // General Hashing concept
  },
  STACKS: {
    label: "Stacks (LIFO)",
    tier: 1,
    reqs: ["ARRAY_SCAN"],
    desc: "Backtracking history and state management.",
    theory:
      "Last-In, First-Out (LIFO). Think of a stack of plates. You can only push to the top and pop from the top. Stacks are used for undo mechanisms, parsing syntax (parentheses), and depth-first search (DFS).",
    youtube: "KInG04mAjO0", // Neetcode - Stack
  },

  // --- TIER 2: PATTERNS ---
  PREFIX_SUM: {
    label: "Prefix Sums",
    tier: 2,
    reqs: ["ARRAY_SCAN"],
    desc: "Pre-computation for O(1) range queries.",
    theory:
      "If you need to calculate the sum of a subarray multiple times, don't iterate. Pre-calculate a 'Prefix Array' where P[i] is the sum of all nums up to i. The sum of range [i, j] then becomes simply P[j] - P[i-1]. It's a classic Space vs. Time tradeoff.",
    youtube: "pVS3yhlzrlQ", // Neetcode - Prefix Sum
  },
  TWO_POINTERS: {
    label: "Two Pointers",
    tier: 2,
    reqs: ["SORTING"],
    desc: "Converging on solutions in linear time.",
    theory:
      "On a sorted array, use two pointers (usually Left and Right) to process the data. By comparing the values at L and R, you can decide which pointer to move, reducing the search space linearly O(N) instead of using nested loops O(N^2).",
    youtube: "-GJ1GV4khSc", // Neetcode - Two Pointers
  },
  QUEUES: {
    label: "Queues (FIFO)",
    tier: 2,
    reqs: ["STACKS"],
    desc: "Processing streams and breadth-first flows.",
    theory:
      "First-In, First-Out (FIFO). Like a line at a coffee shop. Essential for Breadth-First Search (BFS) where you explore neighbors layer by layer. Also critical for sliding window buffers.",
    youtube: "DkK8g6RBJs8", // Queue explanation
  },
  LINKED_LISTS: {
    label: "Linked Lists",
    tier: 2,
    reqs: ["ARRAY_SCAN", "RECURSION_ROOTS"],
    desc: "Dynamic non-contiguous memory.",
    theory:
      "Nodes scattered in memory, connected by pointers. Unlike arrays, you cannot access index i instantly; you must traverse. However, insertion and deletion are O(1) if you have the pointer. The 'Runner Technique' (Fast & Slow pointers) is key here.",
    youtube: "WwfhLC16bis", // Neetcode - Linked List
  },

  // --- TIER 3: ADVANCED LINEAR ---
  SLIDING_WINDOW: {
    label: "Sliding Window",
    tier: 3,
    reqs: ["TWO_POINTERS", "HASHING"],
    desc: "Dynamic range optimization.",
    theory:
      "Convert O(N^2) nested loops into O(N) by maintaining a 'window' of state. Expand the window (Right pointer) to satisfy a condition, then shrink it (Left pointer) to optimize. It's like a caterpillar moving across the array.",
    youtube: "GCm7m5671Ps", // Neetcode - Sliding Window
  },
  BINARY_SEARCH: {
    label: "Binary Search",
    tier: 3,
    reqs: ["SORTING"],
    desc: "Logarithmic space reduction.",
    theory:
      "If the search space is sorted (or monotonic), check the middle. If target < mid, discard the right half. If target > mid, discard the left half. You cut the problem size in half every step. O(log N) is extremely fast.",
    youtube: "s4DPM8ct1pI", // Neetcode - Binary Search
  },
  MONOTONIC_STACK: {
    label: "Monotonic Stack",
    tier: 3,
    reqs: ["STACKS"],
    desc: "Finding next greater/smaller elements in O(N).",
    theory:
      "A stack where elements are always sorted (increasing or decreasing). If a new element breaks the order, pop from the stack until order is restored. The popped elements have found their 'Next Greater/Smaller' element. Essential for histogram and weather problems.",
    youtube: "Dq_ObZwTY_Q", // Neetcode - Monotonic Stack
  },

  // --- TIER 4: HIERARCHICAL ---
  BINARY_TREES: {
    label: "Binary Trees",
    tier: 4,
    reqs: ["RECURSION_ROOTS", "QUEUES"],
    desc: "Hierarchical data storage and traversal.",
    theory:
      "Data organized hierarchically. Each node has at most two children. Mastery involves recursive traversal: Preorder (Self, Left, Right), Inorder (Left, Self, Right), and Postorder (Left, Right, Self). Height is O(log N) if balanced.",
    youtube: "OnSn2XEQ4MY", // Neetcode - Binary Tree
  },
  INTERVALS: {
    label: "Intervals",
    tier: 4,
    reqs: ["SORTING", "GREEDY"],
    desc: "Managing overlapping timelines.",
    theory:
      "Problems involving start and end times. The golden rule: SORT BY START TIME first. Once sorted, you can iterate linearly to merge overlaps or find gaps. It's a specific application of Sorting + Greedy.",
    youtube: "44H3cEC2fFM", // Neetcode - Intervals
  },
  GREEDY: {
    label: "Greedy",
    tier: 4,
    reqs: ["SORTING"],
    desc: "Local optimization for global solutions.",
    theory:
      "Making the locally optimal choice at each step with the hope of finding a global optimum. It works only if the problem has 'Optimal Substructure'. If making a greedy choice now prevents a better choice later, Greedy fails (and you need DP).",
    youtube: "bC7o8P_Ste4", // Neetcode - Greedy
  },

  // --- TIER 5: GRAPH & SEARCH ---
  DFS_BFS: {
    label: "Graph Search",
    tier: 5,
    reqs: ["BINARY_TREES", "HASHING", "STACKS", "QUEUES"],
    desc: "Navigating arbitrary networks.",
    theory:
      "DFS dives deep (using a Stack/Recursion), useful for pathfinding and exhausting possibilities. BFS explores layer-by-layer (using a Queue), guaranteeing the shortest path in unweighted graphs. Always track 'visited' nodes to avoid cycles.",
    youtube: "PMMc4VsIacU", // Neetcode - Graph Intro
  },
  BACKTRACKING: {
    label: "Backtracking",
    tier: 5,
    reqs: ["RECURSION_ROOTS", "DFS_BFS"],
    desc: "Brute-force with pruning.",
    theory:
      "A refined brute force. Build a candidate solution step-by-step. If a candidate violates the rules (e.g., Queens attacking each other), abandon it ('backtrack') and try the next option. It explores the 'Decision Tree' of the problem.",
    youtube: "pfiQ_PS1g8E", // Neetcode - Backtracking
  },
  TRIES: {
    label: "Tries",
    tier: 5,
    reqs: ["BINARY_TREES", "HASHING"],
    desc: "Prefix trees for string retrieval.",
    theory:
      "A tree optimized for strings. Each node represents a character. Paths from the root form words. Extremely efficient for prefix lookups and autocomplete, where checking a prefix is O(Length of Word) independent of the dictionary size.",
    youtube: "oObPgJJdixI", // Neetcode - Tries
  },

  // --- TIER 6: COMPLEX GRAPH & SPECIALIST ---
  TOPOLOGICAL_SORT: {
    label: "Topo Sort",
    tier: 6,
    reqs: ["DFS_BFS"],
    desc: "Dependency resolution in DAGs.",
    theory:
      "Linear ordering of vertices where for every edge U->V, U comes before V. Used for scheduling tasks with dependencies. Implementation uses DFS (Post-order reversal) or Kahn's Algorithm (In-degree counting). Only works on Directed Acyclic Graphs.",
    youtube: "eL-KzMXSXXI", // Neetcode - Topo Sort
  },
  UNION_FIND: {
    label: "Union Find",
    tier: 6,
    reqs: ["DFS_BFS", "ARRAY_SCAN"],
    desc: "Disjoint set management and cycle detection.",
    theory:
      "A data structure to track elements partitioned into disjoint sets. Supports two near-O(1) operations: Union (merge two sets) and Find (determine which set an element belongs to). Essential for Kruskal's algorithm and connecting network components.",
    youtube: "ayW5B2WdBhE", // Neetcode - Union Find
  },
  BIT_MANIPULATION: {
    label: "Bitwise Logic",
    tier: 6,
    reqs: ["ARRAY_SCAN"],
    desc: "Hardware-level boolean algebra. XOR, AND, shifting.",
    theory:
      "Manipulating raw bits. XOR is crucial: X^X=0 and X^0=X. Shifting left (<<) multiplies by 2, right (>>) divides by 2. It allows for extremely compact state representation (bitmasks) and O(1) mathematical tricks.",
    youtube: "NLKQEOgBzpA", // Neetcode - Bit Manipulation
  },

  // --- TIER 7: THE ENDGAME ---
  DYNAMIC_PROGRAMMING: {
    label: "Dynamic Prog",
    tier: 7,
    reqs: ["BACKTRACKING"],
    desc: "Memoization and Tabulation. The final boss.",
    theory:
      "Optimization of plain recursion. If a problem has overlapping subproblems (you solve the same state multiple times), cache the result. Top-Down = Recursion + Memoization. Bottom-Up = Iteration + Tabulation. It turns exponential time O(2^N) into polynomial time O(N^2).",
    youtube: "Hdr64lNM3Vk", // Neetcode - DP
  },
};

// --- DATA INJECTION: FULL LEETCODE STYLE PROBLEMS ---
const PROBLEMS_DB = {
  ARRAY_SCAN: [
    {
      id: "run_sum",
      title: "Running Sum of 1d Array",
      diff: "Easy",
      invariant: "State: prev_sum + curr.",
      description:
        "Given an array `nums`. We define a running sum of an array as `runningSum[i] = sum(nums[0]...nums[i])`. Return the running sum of `nums`.",
      examples: [
        {
          input: "nums = [1,2,3,4]",
          output: "[1,3,6,10]",
          explain:
            "Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4].",
        },
        { input: "nums = [1,1,1,1,1]", output: "[1,2,3,4,5]" },
      ],
      constraints: ["1 <= nums.length <= 1000", "-10^6 <= nums[i] <= 10^6"],
    },
    {
      id: "prod_except",
      title: "Product of Array Except Self",
      diff: "Medium",
      invariant: "Two pass: Prefix * Suffix.",
      description:
        "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.",
      examples: [
        { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
        { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
      ],
      constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
    },
    {
      id: "max_subarray",
      title: "Maximum Subarray (Kadane)",
      diff: "Medium",
      invariant: "Local max vs Global max.",
      description:
        "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
          explain: "The subarray [4,-1,2,1] has the largest sum 6.",
        },
        { input: "nums = [5,4,-1,7,8]", output: "23" },
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    },
  ],
  RECURSION_ROOTS: [
    {
      id: "fib_num",
      title: "Fibonacci Number",
      diff: "Easy",
      invariant: "Base cases: 0 and 1.",
      description:
        "The Fibonacci numbers, commonly denoted F(n), form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. Given `n`, calculate `F(n)`.",
      examples: [
        {
          input: "n = 2",
          output: "1",
          explain: "F(2) = F(1) + F(0) = 1 + 0 = 1.",
        },
        {
          input: "n = 3",
          output: "2",
          explain: "F(3) = F(2) + F(1) = 1 + 1 = 2.",
        },
      ],
      constraints: ["0 <= n <= 30"],
    },
    {
      id: "pow_x_n",
      title: "Pow(x, n)",
      diff: "Medium",
      invariant: "Divide & Conquer: x^n = x^(n/2) * x^(n/2).",
      description:
        "Implement `myPow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).",
      examples: [
        { input: "x = 2.00000, n = 10", output: "1024.00000" },
        {
          input: "x = 2.00000, n = -2",
          output: "0.25000",
          explain: "2^-2 = 1/2^2 = 1/4 = 0.25",
        },
      ],
      constraints: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31-1"],
    },
    {
      id: "gen_parens",
      title: "Generate Parentheses",
      diff: "Medium",
      invariant: "Balance state: open < n, close < open.",
      description:
        "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      examples: [
        {
          input: "n = 3",
          output: "['((()))','(()())','(())()','()(())','()()()']",
        },
        { input: "n = 1", output: "['()']" },
      ],
      constraints: ["1 <= n <= 8"],
    },
  ],
  SORTING: [
    {
      id: "missing_num",
      title: "Missing Number",
      diff: "Easy",
      invariant: "Sum formula or cyclic sort logic.",
      description:
        "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
      examples: [
        {
          input: "nums = [3,0,1]",
          output: "2",
          explain:
            "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number.",
        },
      ],
      constraints: ["n == nums.length", "1 <= n <= 10^4"],
    },
    {
      id: "sort_colors",
      title: "Sort Colors",
      diff: "Medium",
      invariant: "Dutch National Flag: 3-way partition.",
      description:
        "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.",
      examples: [{ input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }],
      constraints: ["1 <= n <= 300"],
    },
    {
      id: "kth_largest",
      title: "Kth Largest Element in an Array",
      diff: "Medium",
      invariant: "QuickSelect or Heap pivot logic.",
      description:
        "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in the sorted order, not the `k`th distinct element.",
      examples: [{ input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }],
      constraints: ["1 <= k <= nums.length <= 10^5"],
    },
  ],
  HASHING: [
    {
      id: "contains_dup",
      title: "Contains Duplicate",
      diff: "Easy",
      invariant: "Set existence check.",
      description:
        "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
      examples: [{ input: "nums = [1,2,3,1]", output: "true" }],
      constraints: ["1 <= nums.length <= 10^5"],
    },
    {
      id: "group_anagrams",
      title: "Group Anagrams",
      diff: "Medium",
      invariant: "Key generation: sorted string or char count.",
      description:
        "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.",
      examples: [
        {
          input: "strs = ['eat','tea','tan','ate','nat','bat']",
          output: "[['bat'],['nat','tan'],['ate','eat','tea']]",
        },
      ],
      constraints: ["1 <= strs.length <= 10^4"],
    },
    {
      id: "longest_consec",
      title: "Longest Consecutive Sequence",
      diff: "Medium",
      invariant: "Set check neighbors (n-1, n+1).",
      description:
        "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
      examples: [
        {
          input: "nums = [100,4,200,1,3,2]",
          output: "4",
          explain:
            "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.",
        },
      ],
      constraints: ["0 <= nums.length <= 10^5"],
    },
  ],
  STACKS: [
    {
      id: "valid_paren",
      title: "Valid Parentheses",
      diff: "Easy",
      invariant: "LIFO matching.",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: [{ input: "s = '()[]{}'", output: "true" }],
      constraints: ["1 <= s.length <= 10^4"],
    },
    {
      id: "min_stack",
      title: "Min Stack",
      diff: "Medium",
      invariant: "Auxiliary stack for min state.",
      description:
        "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      examples: [],
      constraints: [],
    },
    {
      id: "eval_rpn",
      title: "Evaluate Reverse Polish Notation",
      diff: "Medium",
      invariant: "Postfix evaluation using stack.",
      description:
        "Evaluate the value of an arithmetic expression in Reverse Polish Notation.",
      examples: [
        {
          input: "tokens = ['2','1','+','3','*']",
          output: "9",
          explain: "((2 + 1) * 3) = 9",
        },
      ],
      constraints: [],
    },
  ],
  PREFIX_SUM: [
    {
      id: "range_sum",
      title: "Range Sum Query - Immutable",
      diff: "Easy",
      invariant: "Immutable P[i] array.",
      description:
        "Given an integer array nums, handle multiple queries of the following type: Calculate the sum of the elements of nums between indices left and right inclusive where left <= right.",
      examples: [],
      constraints: [],
    },
    {
      id: "sub_sum_k",
      title: "Subarray Sum Equals K",
      diff: "Medium",
      invariant: "Hash Map {sum: count} + Prefix.",
      description:
        "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
      examples: [{ input: "nums = [1,1,1], k = 2", output: "2" }],
      constraints: [],
    },
    {
      id: "prod_less_k",
      title: "Subarray Product Less Than K",
      diff: "Medium",
      invariant: "Sliding window over product.",
      description:
        "Given an array of integers nums and an integer k, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than k.",
      examples: [],
      constraints: [],
    },
  ],
  TWO_POINTERS: [
    {
      id: "valid_palin",
      title: "Valid Palindrome",
      diff: "Easy",
      invariant: "Converge from ends.",
      description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      examples: [
        { input: "s = 'A man, a plan, a canal: Panama'", output: "true" },
      ],
      constraints: [],
    },
    {
      id: "two_sum_ii",
      title: "Two Sum II - Input Array Sorted",
      diff: "Medium",
      invariant: "Sorted input exploitation.",
      description:
        "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.",
      examples: [
        { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" },
      ],
      constraints: [],
    },
    {
      id: "3sum",
      title: "3Sum",
      diff: "Medium",
      invariant: "Fix one, 2-sum the rest. Skip duplicates.",
      description:
        "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      examples: [
        { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      ],
      constraints: [],
    },
  ],
  QUEUES: [
    {
      id: "recent_calls",
      title: "Number of Recent Calls",
      diff: "Easy",
      invariant: "Slide window of time t-3000.",
      description:
        "You have a RecentCounter class which counts the number of recent requests within a certain time frame.",
      examples: [],
      constraints: [],
    },
    {
      id: "stack_queues",
      title: "Implement Stack using Queues",
      diff: "Medium",
      invariant: "Double queue push/pop logic.",
      description:
        "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).",
      examples: [],
      constraints: [],
    },
    {
      id: "dota2",
      title: "Dota2 Senate",
      diff: "Medium",
      invariant: "Round robin cyclic simulation.",
      description:
        "In the world of Dota2, there are two parties: the Radiant and the Dire. The Senate consists of senators coming from two parties. Now the Senate wants to decide on a change in the Dota2 game.",
      examples: [],
      constraints: [],
    },
  ],
  LINKED_LISTS: [
    {
      id: "merge_sorted",
      title: "Merge Two Sorted Lists",
      diff: "Easy",
      invariant: "Dummy head + scanner.",
      description:
        "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
      examples: [
        { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      ],
      constraints: [],
    },
    {
      id: "remove_nth",
      title: "Remove Nth Node From End of List",
      diff: "Medium",
      invariant: "Fast/Slow pointer gap.",
      description:
        "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
      examples: [{ input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" }],
      constraints: [],
    },
    {
      id: "reorder_list",
      title: "Reorder List",
      diff: "Medium",
      invariant: "Find mid -> Reverse second half -> Merge.",
      description:
        "You are given the head of a singly linked-list. The list can be represented as: L0 -> L1 -> ... -> Ln - 1 -> Ln. Reorder the list to be on the following form: L0 -> Ln -> L1 -> Ln - 1 -> L2 -> Ln - 2 -> ...",
      examples: [],
      constraints: [],
    },
  ],
  SLIDING_WINDOW: [
    {
      id: "buy_sell_stock",
      title: "Best Time to Buy and Sell Stock",
      diff: "Easy",
      invariant: "Min_price tracking.",
      description:
        "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
      examples: [
        {
          input: "prices = [7,1,5,3,6,4]",
          output: "5",
          explain:
            "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
        },
      ],
      constraints: [],
    },
    {
      id: "longest_sub_no_rep",
      title: "Longest Substring Without Repeating Characters",
      diff: "Medium",
      invariant: "Map/Set for char index.",
      description:
        "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        {
          input: "s = 'abcabcbb'",
          output: "3",
          explain: "The answer is 'abc', with the length of 3.",
        },
      ],
      constraints: [],
    },
    {
      id: "min_window",
      title: "Minimum Window Substring",
      diff: "Medium",
      invariant: "Frequency map requirement match.",
      description:
        "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.",
      examples: [{ input: "s = 'ADOBECODEBANC', t = 'ABC'", output: "'BANC'" }],
      constraints: [],
    },
  ],
  BINARY_SEARCH: [
    {
      id: "bin_search",
      title: "Binary Search",
      diff: "Easy",
      invariant: "Standard template.",
      description:
        "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
      examples: [],
      constraints: [],
    },
    {
      id: "search_2d",
      title: "Search 2D Matrix",
      diff: "Medium",
      invariant: "Treat 2D as 1D array logic.",
      description:
        "Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix.",
      examples: [],
      constraints: [],
    },
    {
      id: "rotated_min",
      title: "Find Minimum in Rotated Sorted Array",
      diff: "Medium",
      invariant: "Compare mid with right.",
      description:
        "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element.",
      examples: [],
      constraints: [],
    },
  ],
  MONOTONIC_STACK: [
    {
      id: "next_greater_i",
      title: "Next Greater Element I",
      diff: "Easy",
      invariant: "Hash map + Mono Stack.",
      description:
        "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.",
      examples: [],
      constraints: [],
    },
    {
      id: "daily_temps",
      title: "Daily Temperatures",
      diff: "Medium",
      invariant: "Store indices, compare values.",
      description:
        "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
      examples: [],
      constraints: [],
    },
    {
      id: "asteroid_coll",
      title: "Asteroid Collision",
      diff: "Medium",
      invariant: "Collision rules on stack top.",
      description:
        "We are given an array asteroids of integers representing asteroids in a row.",
      examples: [],
      constraints: [],
    },
  ],
  BINARY_TREES: [
    {
      id: "max_depth",
      title: "Maximum Depth of Binary Tree",
      diff: "Easy",
      invariant: "DFS height calculation.",
      description: "Given the root of a binary tree, return its maximum depth.",
      examples: [],
      constraints: [],
    },
    {
      id: "level_order",
      title: "Binary Tree Level Order Traversal",
      diff: "Medium",
      invariant: "BFS Queue size tracking.",
      description:
        "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      examples: [],
      constraints: [],
    },
    {
      id: "validate_bst",
      title: "Validate Binary Search Tree",
      diff: "Medium",
      invariant: "Range (min, max) propagation.",
      description:
        "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
      examples: [],
      constraints: [],
    },
  ],
  INTERVALS: [
    {
      id: "attend_meetings",
      title: "Meeting Rooms",
      diff: "Easy",
      invariant: "Sort by start time.",
      description:
        "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings.",
      examples: [],
      constraints: [],
    },
    {
      id: "insert_interval",
      title: "Insert Interval",
      diff: "Medium",
      invariant: "Skip, Merge, Append.",
      description:
        "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.",
      examples: [],
      constraints: [],
    },
    {
      id: "merge_intervals",
      title: "Merge Intervals",
      diff: "Medium",
      invariant: "Sort start, track end.",
      description:
        "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
      examples: [],
      constraints: [],
    },
  ],
  GREEDY: [
    {
      id: "assign_cookies",
      title: "Assign Cookies",
      diff: "Easy",
      invariant: "Sort greed + Sort size.",
      description:
        "Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.",
      examples: [],
      constraints: [],
    },
    {
      id: "jump_game",
      title: "Jump Game",
      diff: "Medium",
      invariant: "Max reachable index extension.",
      description:
        "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.",
      examples: [],
      constraints: [],
    },
    {
      id: "gas_station",
      title: "Gas Station",
      diff: "Medium",
      invariant: "Total sum >= 0 check.",
      description:
        "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].",
      examples: [],
      constraints: [],
    },
  ],
  DFS_BFS: [
    {
      id: "flood_fill",
      title: "Flood Fill",
      diff: "Easy",
      invariant: "4-directional recursion.",
      description:
        "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.",
      examples: [],
      constraints: [],
    },
    {
      id: "num_islands",
      title: "Number of Islands",
      diff: "Medium",
      invariant: "Sink visited land.",
      description:
        "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
      examples: [],
      constraints: [],
    },
    {
      id: "rotting_oranges",
      title: "Rotting Oranges",
      diff: "Medium",
      invariant: "Multi-source BFS.",
      description:
        "You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange.",
      examples: [],
      constraints: [],
    },
  ],
  BACKTRACKING: [
    {
      id: "binary_watch",
      title: "Binary Watch",
      diff: "Easy",
      invariant: "Bit count or recursion.",
      description:
        "A binary watch has 4 LEDs on the top to represent the hours (0-11), and 6 LEDs on the bottom to represent the minutes (0-59).",
      examples: [],
      constraints: [],
    },
    {
      id: "permutations",
      title: "Permutations",
      diff: "Medium",
      invariant: "Used array/set state.",
      description:
        "Given an array nums of distinct integers, return all the possible permutations.",
      examples: [],
      constraints: [],
    },
    {
      id: "comb_sum",
      title: "Combination Sum",
      diff: "Medium",
      invariant: "Target reduction, index passing.",
      description:
        "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.",
      examples: [],
      constraints: [],
    },
  ],
  TRIES: [
    {
      id: "longest_common_prefix",
      title: "Longest Common Prefix",
      diff: "Easy",
      invariant: "Horizontal scan or Trie.",
      description:
        "Write a function to find the longest common prefix string amongst an array of strings.",
      examples: [],
      constraints: [],
    },
    {
      id: "implement_trie",
      title: "Implement Trie (Prefix Tree)",
      diff: "Medium",
      invariant: "Node {children[26], isEnd}.",
      description:
        "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.",
      examples: [],
      constraints: [],
    },
    {
      id: "word_search_ii",
      title: "Word Search II",
      diff: "Medium",
      invariant: "Backtracking on Trie.",
      description:
        "Given an m x n board of characters and a list of strings words, return all words on the board.",
      examples: [],
      constraints: [],
    },
  ],
  TOPOLOGICAL_SORT: [
    {
      id: "find_judge",
      title: "Find the Town Judge",
      diff: "Easy",
      invariant: "In-degree vs Out-degree.",
      description:
        "In a town, there are n people labeled from 1 to n. There is a rumor that one of these people is secretly the town judge.",
      examples: [],
      constraints: [],
    },
    {
      id: "course_sched",
      title: "Course Schedule",
      diff: "Medium",
      invariant: "Cycle detection (DFS/Kahn).",
      description:
        "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
      examples: [],
      constraints: [],
    },
    {
      id: "course_sched_ii",
      title: "Course Schedule II",
      diff: "Medium",
      invariant: "Order generation.",
      description:
        "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.",
      examples: [],
      constraints: [],
    },
  ],
  UNION_FIND: [
    {
      id: "valid_path",
      title: "Find if Path Exists in Graph",
      diff: "Easy",
      invariant: "Find(u) == Find(v).",
      description:
        "There is a bi-directional graph with n vertices, where each vertex is labeled from 0 to n - 1 (inclusive).",
      examples: [],
      constraints: [],
    },
    {
      id: "num_provinces",
      title: "Number of Provinces",
      diff: "Medium",
      invariant: "Count distinct roots.",
      description:
        "There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.",
      examples: [],
      constraints: [],
    },
    {
      id: "redundant_conn",
      title: "Redundant Connection",
      diff: "Medium",
      invariant: "Cycle detection via Union.",
      description:
        "In this problem, a tree is an undirected graph that is connected and has no cycles.",
      examples: [],
      constraints: [],
    },
  ],
  BIT_MANIPULATION: [
    {
      id: "num_1_bits",
      title: "Number of 1 Bits",
      diff: "Easy",
      invariant: "n & (n-1) drops lowest set bit.",
      description:
        "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
      examples: [],
      constraints: [],
    },
    {
      id: "single_num",
      title: "Single Number",
      diff: "Medium",
      invariant: "XOR self-inverse property.",
      description:
        "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
      examples: [],
      constraints: [],
    },
    {
      id: "sum_two_int",
      title: "Sum of Two Integers",
      diff: "Medium",
      invariant: "XOR for sum, AND<<1 for carry.",
      description:
        "Given two integers a and b, return the sum of the two integers without using the operators + and -.",
      examples: [],
      constraints: [],
    },
  ],
  DYNAMIC_PROGRAMMING: [
    {
      id: "climb_stairs",
      title: "Climbing Stairs",
      diff: "Easy",
      invariant: "dp[i] = dp[i-1] + dp[i-2].",
      description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      examples: [],
      constraints: [],
    },
    {
      id: "house_robber",
      title: "House Robber",
      diff: "Medium",
      invariant: "Max(rob current, skip current).",
      description:
        "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.",
      examples: [],
      constraints: [],
    },
    {
      id: "coin_change",
      title: "Coin Change",
      diff: "Medium",
      invariant: "Min coins for amount - coin.",
      description:
        "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.",
      examples: [],
      constraints: [],
    },
  ],
};

// --- GEMINI INTEGRATION ---
// 1. Audit Judge (JSON Strict)
const runGeminiJSON = async (prompt, systemInstruction = "") => {
  const fetchWithRetry = async (retries = 3, delay = 1000) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
      if (!response.ok) throw new Error("API Failure");
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      return JSON.parse(text.substring(start, end + 1));
    } catch (error) {
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }
      return { verdict: "ERROR", feedback: "Audit failed. Network issue." };
    }
  };
  return fetchWithRetry();
};

// 2. Chat/Text Generation (Free Text)
const runGeminiText = async (prompt, systemInstruction = "") => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      }
    );
    if (!response.ok) throw new Error("API Failure");
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Communication disrupted."
    );
  } catch (error) {
    return "System failure. The Architect is silent.";
  }
};

export default function App() {
  const [view, setView] = useState("start"); // start | tree | ide
  const [mastery, setMastery] = useState({}); // { TOPIC: { confidence: 0-100, solved: [id1, id2] } }
  const [activeNode, setActiveNode] = useState(null); // The topic currently selected
  const [activeProblem, setActiveProblem] = useState(null);
  const [code, setCode] = useState("");
  const [judgeResult, setJudgeResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- GEMINI FEATURE STATES ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showHint, setShowHint] = useState(false); // Hint state
  const chatEndRef = useRef(null);

  const [complexityResult, setComplexityResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Initialize state
  useEffect(() => {
    const initMastery = {};
    Object.keys(DAG_STRUCTURE).forEach((key) => {
      initMastery[key] = { confidence: 0, solved: [] };
    });
    setMastery(initMastery);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatOpen]);

  // --- LOGIC: PREREQUISITE CHECK ---
  const getStatus = (nodeId) => {
    const node = DAG_STRUCTURE[nodeId];
    const state = mastery[nodeId] || { confidence: 0, solved: [] };

    // 1. Check prerequisites
    const parents = node.reqs;
    const parentsMet = parents.every(
      (pid) => (mastery[pid]?.confidence || 0) >= 70
    );

    if (!parentsMet) return "LOCKED";
    if (state.confidence >= 100) return "MASTERED";
    if (state.confidence > 0) return "IN_PROGRESS";
    return "UNLOCKED";
  };

  const handleNodeClick = (nodeId) => {
    const status = getStatus(nodeId);
    if (status === "LOCKED") return;
    setActiveNode(nodeId);
    // Reset chat for new node
    setChatHistory([
      {
        role: "system",
        text: `I am the Architect of ${DAG_STRUCTURE[nodeId].label}. I speak in concepts and analogies. I will not write code for you, but I will help you build the mental model. Ask me anything.`,
      },
    ]);
    setChatOpen(false);
    setView("hub");
  };

  const handleProblemSelect = (prob) => {
    setActiveProblem(prob);
    setCode("");
    setJudgeResult(null);
    setComplexityResult(null);
    setShowHint(false); // Reset hint state
    setView("ide");
  };

  // --- GEMINI HANDLERS ---

  // 1. Chat with Architect
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", text: chatInput };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    const systemPrompt = `You are the ${DAG_STRUCTURE[activeNode].label} Architect. 
        Your goal is to help the user understand the CONCEPT of ${DAG_STRUCTURE[activeNode].label} using analogies and Socratic questioning.
        DO NOT write code. Focus on the intuition, the "why", and the trade-offs.
        Be concise, wise, and slightly cryptic but helpful. Keep responses under 50 words unless asked for detail.`;

    const response = await runGeminiText(chatInput, systemPrompt);

    setChatHistory((prev) => [...prev, { role: "system", text: response }]);
    setChatLoading(false);
  };

  // 2. Complexity Analysis
  const handleComplexityAnalysis = async () => {
    if (!code.trim()) return;
    setAnalyzing(true);

    const systemPrompt = `You are a Performance Engineer. Analyze the user's code for:
        1. Time Complexity (Big O)
        2. Space Complexity (Big O)
        3. Identify the bottleneck line of code.
        Be extremely concise. Use markdown.`;

    const response = await runGeminiText(code, systemPrompt);
    setComplexityResult(response);
    setAnalyzing(false);
  };

  // 3. Judge Audit
  const handleJudge = async () => {
    setLoading(true);
    const prompt = `
            Pattern: ${activeNode}
            Problem: ${activeProblem.title}
            Invariant Strategy: ${activeProblem.invariant}
            User Code:
            ${code}
        `;

    const systemPrompt = `
            You are a ruthless Senior Engineer Auditor. 
            Your Goal: Verify the user used the specific O-notation strategy and Invariant for ${activeNode}.
            1. If they used Brute Force instead of the Pattern, REJECT.
            2. If they ignored the Invariant, REJECT.
            3. If code is optimal, ADVANCE.
            Output JSON: { "verdict": "ADVANCE" | "REPEAT", "feedback": "Short, sharp technical critique." }
        `;

    const result = await runGeminiJSON(prompt, systemPrompt);
    setLoading(false);
    setJudgeResult(result);

    if (result.verdict === "ADVANCE" || result.verdict === "Optimal") {
      const currentSolved = mastery[activeNode].solved.includes(
        activeProblem.id
      )
        ? mastery[activeNode].solved
        : [...mastery[activeNode].solved, activeProblem.id];

      const newConf = Math.min(
        100,
        Math.floor((currentSolved.length / 3) * 100)
      );

      setMastery((prev) => ({
        ...prev,
        [activeNode]: {
          ...prev[activeNode],
          solved: currentSolved,
          confidence: newConf,
        },
      }));
    }
  };

  // --- RENDER HELPERS ---
  const renderTier = (tierNum) => {
    const nodesInTier = Object.entries(DAG_STRUCTURE).filter(
      ([k, v]) => v.tier === tierNum
    );
    if (nodesInTier.length === 0) return null;

    return (
      <div key={tierNum} className="mb-12 relative">
        <div className="absolute -left-12 top-8 text-[10px] font-mono text-slate-600 -rotate-90 origin-center uppercase tracking-widest">
          Tier {tierNum}
        </div>
        <div className="flex flex-wrap gap-6 pl-4 border-l border-slate-800">
          {nodesInTier.map(([key, data]) => {
            const status = getStatus(key);
            const state = mastery[key];
            const isLocked = status === "LOCKED";

            return (
              <button
                key={key}
                onClick={() => handleNodeClick(key)}
                className={`
                                    relative w-64 p-5 text-left rounded-2xl border transition-all duration-300 group
                                    ${
                                      isLocked
                                        ? "bg-slate-900/20 border-slate-800 opacity-50 cursor-not-allowed grayscale"
                                        : status === "MASTERED"
                                        ? "bg-emerald-950/20 border-emerald-900/50 hover:border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                        : "bg-slate-900 border-slate-700 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1"
                                    }
                                `}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isLocked
                        ? "bg-slate-800"
                        : "bg-slate-800 group-hover:bg-blue-900/50 transition"
                    }`}
                  >
                    {status === "MASTERED" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : (
                      <Zap className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {state.solved.length}/3
                  </span>
                </div>
                <h4
                  className={`font-bold text-sm mb-1 ${
                    isLocked ? "text-slate-600" : "text-slate-200"
                  }`}
                >
                  {data.label}
                </h4>
                <div className="text-[10px] text-slate-500 font-mono leading-tight h-8 overflow-hidden">
                  {data.desc}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      status === "MASTERED" ? "bg-emerald-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${state.confidence}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (view === "start")
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center font-sans">
        <Cpu className="w-20 h-20 text-blue-600 mb-8 animate-pulse" />
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">
          Skill<span className="text-blue-600">Tree</span>
        </h1>
        <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-10 font-mono">
          The linear calendar is dead. This is a Dependency Graph. You cannot
          unlock 'Sliding Window' until you master 'Two Pointers'. Prove your
          competence.
        </p>
        <button
          onClick={() => setView("tree")}
          className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-blue-500 transition shadow-xl shadow-blue-900/20 flex items-center gap-3"
        >
          Initialize Graph <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );

  if (view === "tree")
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
        <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-slate-900 pb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              <Network className="w-8 h-8 text-blue-600" />
              Mastery Graph
            </h2>
            <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">
              Architecture: Directed Acyclic Graph (DAG)
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-white">
                {
                  Object.values(mastery).filter((m) => m.confidence >= 100)
                    .length
                }{" "}
                / 22
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">
                Nodes Mastered
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto overflow-x-auto pb-20">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((tier) => renderTier(tier))}
        </main>
      </div>
    );

  // HUB VIEW (Problem List for a Node)
  if (view === "hub") {
    const node = DAG_STRUCTURE[activeNode];
    const problems = PROBLEMS_DB[activeNode] || [];
    const state = mastery[activeNode];

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => setView("tree")}
            className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Return to Graph
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500">
            {/* HEADER & THEORY SECTION */}
            <div className="p-10 border-b border-slate-800 bg-slate-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2">
                    {node.label}
                  </h2>
                  <div className="flex gap-4 mt-2">
                    {node.reqs.length > 0 ? (
                      node.reqs.map((r) => (
                        <span
                          key={r}
                          className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-mono text-slate-500 flex items-center gap-2"
                        >
                          <GitMerge className="w-3 h-3" /> Req:{" "}
                          {DAG_STRUCTURE[r].label}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-blue-950/30 border border-blue-900/50 rounded-full text-[10px] font-mono text-blue-400">
                        ROOT NODE
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    chatOpen
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {chatOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  )}
                  Consult Architect
                </button>
              </div>

              {/* CONCEPT BRIEFING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> Conceptual Briefing
                  </h3>
                  <p className="text-sm text-slate-300 font-mono leading-relaxed">
                    {node.theory}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MonitorPlay className="w-4 h-4" /> Essential Resource
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mb-4">
                      Watch this briefing before attempting problems. Mental
                      model first, syntax second.
                    </p>
                  </div>
                  {node.youtube ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${node.youtube}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-red-950/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 py-3 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest transition"
                    >
                      <Play className="w-4 h-4 fill-current" /> Watch Lecture
                    </a>
                  ) : (
                    <div className="w-full bg-slate-900 border border-slate-800 text-slate-600 py-3 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest">
                      Resource Offline
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* LLM CHAT SECTION */}
            {chatOpen && (
              <div className="border-b border-slate-800 bg-slate-950/50 p-6 animate-in slide-in-from-top-4">
                <div className="h-64 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed font-mono ${
                          msg.role === "user"
                            ? "bg-blue-900/20 border border-blue-500/30 text-blue-100"
                            : "bg-slate-800 border border-slate-700 text-slate-300"
                        }`}
                      >
                        {msg.role === "system" && (
                          <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-amber-500 tracking-widest">
                            <Brain className="w-3 h-3" /> The Architect
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask the ${node.label} Architect a conceptual question...`}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all font-mono placeholder:text-slate-600"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || chatLoading}
                    className="bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-400 px-4 rounded-xl transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* PROBLEM LIST SECTION */}
            <div className="p-8">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2 pl-2">
                <GraduationCap className="w-4 h-4" /> Calibration Protocols
              </h3>
              <div className="grid gap-4">
                {problems.map((p, idx) => {
                  const isSolved = state.solved.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleProblemSelect(p)}
                      className={`w-full p-6 rounded-2xl border flex items-center justify-between group transition-all
                                                ${
                                                  isSolved
                                                    ? "bg-emerald-950/10 border-emerald-900/30"
                                                    : "bg-slate-950 hover:bg-slate-950/80 border-slate-800 hover:border-blue-500/50"
                                                }
                                            `}
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm
                                                    ${
                                                      isSolved
                                                        ? "bg-emerald-500 text-slate-900"
                                                        : "bg-slate-900 text-slate-600 border border-slate-800"
                                                    }
                                                `}
                        >
                          {isSolved ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <h3
                              className={`font-bold text-lg ${
                                isSolved ? "text-emerald-400" : "text-slate-200"
                              }`}
                            >
                              {p.title}
                            </h3>
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                                p.diff === "Easy"
                                  ? "border-emerald-500/30 text-emerald-500"
                                  : p.diff === "Medium"
                                  ? "border-amber-500/30 text-amber-500"
                                  : "border-red-500/30 text-red-500"
                              }`}
                            >
                              {p.diff}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            Invariant: {p.invariant}
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <Play className="w-3 h-3 text-blue-500 fill-current" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IDE VIEW
  if (view === "ide") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
          <button
            onClick={() => setView("hub")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Abort
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-black text-white">
              {activeProblem.title}
            </span>
            <span className="text-xs font-mono text-slate-500 border-l border-slate-700 pl-4">
              {activeNode} Protocol
            </span>
          </div>
          <div className="w-20"></div>
        </header>

        <div className="flex-1 grid grid-cols-2">
          {/* LEFT PANEL: LEETCODE STYLE DESCRIPTION */}
          <div className="border-r border-slate-800 p-8 bg-slate-950/50 overflow-y-auto">
            {/* 1. Header & Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {activeProblem.title}
              </h2>
              <div className="flex gap-2 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    activeProblem.diff === "Easy"
                      ? "bg-emerald-950/30 text-emerald-500"
                      : activeProblem.diff === "Medium"
                      ? "bg-amber-950/30 text-amber-500"
                      : "bg-red-950/30 text-red-500"
                  }`}
                >
                  {activeProblem.diff}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-7">
                {activeProblem.description ||
                  "Implement the optimal solution for this pattern."}
              </p>
            </div>

            {/* 2. Examples */}
            {activeProblem.examples && activeProblem.examples.length > 0 && (
              <div className="mb-8 space-y-6">
                {activeProblem.examples.map((ex, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                      Example {i + 1}:
                    </h4>
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-2">
                      <div className="flex gap-2">
                        <span className="text-slate-500 select-none">
                          Input:
                        </span>
                        <span className="text-slate-200">{ex.input}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 select-none">
                          Output:
                        </span>
                        <span className="text-slate-200">{ex.output}</span>
                      </div>
                      {ex.explain && (
                        <div className="flex gap-2">
                          <span className="text-slate-500 select-none">
                            Explanation:
                          </span>
                          <span className="text-slate-400">{ex.explain}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Constraints */}
            {activeProblem.constraints &&
              activeProblem.constraints.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                    Constraints:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i} className="text-xs font-mono text-slate-400">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* 4. Strategic Invariant (Hint) */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Strategic Invariant
                </h4>
                {!showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-[10px] font-bold text-blue-500 hover:text-white uppercase tracking-widest border border-blue-500/30 hover:bg-blue-600/20 px-3 py-1 rounded-lg transition-all"
                  >
                    Reveal Hint
                  </button>
                )}
              </div>

              {showHint ? (
                <div className="p-5 bg-blue-950/10 rounded-2xl border border-blue-900/30 animate-in fade-in slide-in-from-top-2">
                  <p className="font-mono text-xs text-blue-200/70 leading-relaxed">
                    {activeProblem.invariant}
                  </p>
                </div>
              ) : (
                <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed flex items-center justify-center">
                  <p className="text-xs text-slate-600 font-mono italic">
                    Pattern strategy hidden. Try to identify the invariant
                    yourself first.
                  </p>
                </div>
              )}
            </div>

            {/* Complexity Analysis Output */}
            {complexityResult && (
              <div className="mt-8 p-6 rounded-2xl border bg-indigo-950/20 border-indigo-900/50 animate-in slide-in-from-bottom-4 duration-500">
                <div className="font-black text-xs uppercase mb-3 flex items-center gap-2 text-indigo-400">
                  <Activity className="w-4 h-4" /> Complexity Analysis
                </div>
                <div className="font-mono text-xs text-indigo-200 whitespace-pre-wrap leading-relaxed">
                  {complexityResult}
                </div>
              </div>
            )}

            {judgeResult && (
              <div
                className={`mt-4 p-6 rounded-2xl border animate-in slide-in-from-bottom-4 duration-500 ${
                  judgeResult.verdict === "ADVANCE" ||
                  judgeResult.verdict === "Optimal"
                    ? "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                    : "bg-red-950/20 border-red-900 text-red-400"
                }`}
              >
                <div className="font-black text-xs uppercase mb-2 flex items-center gap-2">
                  {judgeResult.verdict === "ADVANCE" ||
                  judgeResult.verdict === "Optimal" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  Verifier Output
                </div>
                <p className="font-mono text-sm">{judgeResult.feedback}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col bg-slate-950">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-slate-950 text-blue-100 font-mono text-sm p-8 outline-none resize-none leading-relaxed"
              placeholder="// Write your solution here. Focus on the invariant."
              spellCheck="false"
            />
            <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
              <button
                onClick={handleComplexityAnalysis}
                disabled={analyzing || !code.trim()}
                className="bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center gap-2"
              >
                {analyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Analyze Complexity ✨
              </button>
              <button
                onClick={handleJudge}
                disabled={loading || !code.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Terminal className="w-4 h-4" />
                )}
                Run Gatekeeper Audit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
