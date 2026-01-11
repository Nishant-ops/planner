// Problems Database - 3 problems per topic (66 total)
export const PROBLEMS_DB = {
  ARRAY_SCAN: [
    {
      id: "run_sum",
      title: "Running Sum of 1d Array",
      diff: "Easy",
      invariant: "State: prev_sum + curr.",
      description: "Given an array `nums`. We define a running sum of an array as `runningSum[i] = sum(nums[0]...nums[i])`. Return the running sum of `nums`.",
      examples: [
        { input: "nums = [1,2,3,4]", output: "[1,3,6,10]", explain: "Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4]." },
        { input: "nums = [1,1,1,1,1]", output: "[1,2,3,4,5]" },
      ],
      constraints: ["1 <= nums.length <= 1000", "-10^6 <= nums[i] <= 10^6"],
    },
    {
      id: "prod_except",
      title: "Product of Array Except Self",
      diff: "Medium",
      invariant: "Two pass: Prefix * Suffix.",
      description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.",
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
      description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
      examples: [
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explain: "The subarray [4,-1,2,1] has the largest sum 6." },
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
      description: "The Fibonacci numbers, commonly denoted F(n), form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. Given `n`, calculate `F(n)`.",
      examples: [
        { input: "n = 2", output: "1", explain: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
        { input: "n = 3", output: "2", explain: "F(3) = F(2) + F(1) = 1 + 1 = 2." },
      ],
      constraints: ["0 <= n <= 30"],
    },
    {
      id: "pow_x_n",
      title: "Pow(x, n)",
      diff: "Medium",
      invariant: "Divide & Conquer: x^n = x^(n/2) * x^(n/2).",
      description: "Implement `myPow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).",
      examples: [
        { input: "x = 2.00000, n = 10", output: "1024.00000" },
        { input: "x = 2.00000, n = -2", output: "0.25000", explain: "2^-2 = 1/2^2 = 1/4 = 0.25" },
      ],
      constraints: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31-1"],
    },
    {
      id: "gen_parens",
      title: "Generate Parentheses",
      diff: "Medium",
      invariant: "Balance state: open < n, close < open.",
      description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      examples: [
        { input: "n = 3", output: "['((()))','(()())','(())()','()(())','()()()']" },
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
      description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
      examples: [
        { input: "nums = [3,0,1]", output: "2", explain: "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number." },
      ],
      constraints: ["n == nums.length", "1 <= n <= 10^4"],
    },
    {
      id: "sort_colors",
      title: "Sort Colors",
      diff: "Medium",
      invariant: "Dutch National Flag: 3-way partition.",
      description: "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.",
      examples: [{ input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }],
      constraints: ["1 <= n <= 300"],
    },
    {
      id: "kth_largest",
      title: "Kth Largest Element in an Array",
      diff: "Medium",
      invariant: "QuickSelect or Heap pivot logic.",
      description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in the sorted order, not the `k`th distinct element.",
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
      description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
      examples: [{ input: "nums = [1,2,3,1]", output: "true" }],
      constraints: ["1 <= nums.length <= 10^5"],
    },
    {
      id: "group_anagrams",
      title: "Group Anagrams",
      diff: "Medium",
      invariant: "Key generation: sorted string or char count.",
      description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.",
      examples: [
        { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]" },
      ],
      constraints: ["1 <= strs.length <= 10^4"],
    },
    {
      id: "longest_consec",
      title: "Longest Consecutive Sequence",
      diff: "Medium",
      invariant: "Set check neighbors (n-1, n+1).",
      description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
      examples: [
        { input: "nums = [100,4,200,1,3,2]", output: "4", explain: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4." },
      ],
      constraints: ["0 <= nums.length <= 10^5"],
    },
  ],

  // Continue with remaining 18 topics...
  STACKS: [
    { id: "valid_paren", title: "Valid Parentheses", diff: "Easy", invariant: "LIFO matching.", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", examples: [{ input: "s = '()[]{}'", output: "true" }], constraints: ["1 <= s.length <= 10^4"] },
    { id: "min_stack", title: "Min Stack", diff: "Medium", invariant: "Auxiliary stack for min state.", description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", examples: [], constraints: [] },
    { id: "eval_rpn", title: "Evaluate Reverse Polish Notation", diff: "Medium", invariant: "Postfix evaluation using stack.", description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation.", examples: [{ input: "tokens = ['2','1','+','3','*']", output: "9", explain: "((2 + 1) * 3) = 9" }], constraints: [] },
  ],

  PREFIX_SUM: [
    { id: "range_sum", title: "Range Sum Query - Immutable", diff: "Easy", invariant: "Immutable P[i] array.", description: "Given an integer array nums, handle multiple queries of the following type: Calculate the sum of the elements of nums between indices left and right inclusive where left <= right.", examples: [], constraints: [] },
    { id: "sub_sum_k", title: "Subarray Sum Equals K", diff: "Medium", invariant: "Hash Map {sum: count} + Prefix.", description: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.", examples: [{ input: "nums = [1,1,1], k = 2", output: "2" }], constraints: [] },
    { id: "prod_less_k", title: "Subarray Product Less Than K", diff: "Medium", invariant: "Sliding window over product.", description: "Given an array of integers nums and an integer k, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than k.", examples: [], constraints: [] },
  ],

  TWO_POINTERS: [
    { id: "valid_palin", title: "Valid Palindrome", diff: "Easy", invariant: "Converge from ends.", description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", examples: [{ input: "s = 'A man, a plan, a canal: Panama'", output: "true" }], constraints: [] },
    { id: "two_sum_ii", title: "Two Sum II - Input Array Sorted", diff: "Medium", invariant: "Sorted input exploitation.", description: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.", examples: [{ input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" }], constraints: [] },
    { id: "3sum", title: "3Sum", diff: "Medium", invariant: "Fix one, 2-sum the rest. Skip duplicates.", description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.", examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }], constraints: [] },
  ],

  QUEUES: [
    { id: "recent_calls", title: "Number of Recent Calls", diff: "Easy", invariant: "Slide window of time t-3000.", description: "You have a RecentCounter class which counts the number of recent requests within a certain time frame.", examples: [], constraints: [] },
    { id: "stack_queues", title: "Implement Stack using Queues", diff: "Medium", invariant: "Double queue push/pop logic.", description: "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).", examples: [], constraints: [] },
    { id: "dota2", title: "Dota2 Senate", diff: "Medium", invariant: "Round robin cyclic simulation.", description: "In the world of Dota2, there are two parties: the Radiant and the Dire. The Senate consists of senators coming from two parties. Now the Senate wants to decide on a change in the Dota2 game.", examples: [], constraints: [] },
  ],

  LINKED_LISTS: [
    { id: "merge_sorted", title: "Merge Two Sorted Lists", diff: "Easy", invariant: "Dummy head + scanner.", description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.", examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }], constraints: [] },
    { id: "remove_nth", title: "Remove Nth Node From End of List", diff: "Medium", invariant: "Fast/Slow pointer gap.", description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.", examples: [{ input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" }], constraints: [] },
    { id: "reorder_list", title: "Reorder List", diff: "Medium", invariant: "Find mid -> Reverse second half -> Merge.", description: "You are given the head of a singly linked-list. The list can be represented as: L0 -> L1 -> ... -> Ln - 1 -> Ln. Reorder the list to be on the following form: L0 -> Ln -> L1 -> Ln - 1 -> L2 -> Ln - 2 -> ...", examples: [], constraints: [] },
  ],

  SLIDING_WINDOW: [
    { id: "buy_sell_stock", title: "Best Time to Buy and Sell Stock", diff: "Easy", invariant: "Min_price tracking.", description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.", examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explain: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." }], constraints: [] },
    { id: "longest_sub_no_rep", title: "Longest Substring Without Repeating Characters", diff: "Medium", invariant: "Map/Set for char index.", description: "Given a string s, find the length of the longest substring without repeating characters.", examples: [{ input: "s = 'abcabcbb'", output: "3", explain: "The answer is 'abc', with the length of 3." }], constraints: [] },
    { id: "min_window", title: "Minimum Window Substring", diff: "Medium", invariant: "Frequency map requirement match.", description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.", examples: [{ input: "s = 'ADOBECODEBANC', t = 'ABC'", output: "'BANC'" }], constraints: [] },
  ],

  BINARY_SEARCH: [
    { id: "bin_search", title: "Binary Search", diff: "Easy", invariant: "Standard template.", description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.", examples: [], constraints: [] },
    { id: "search_2d", title: "Search 2D Matrix", diff: "Medium", invariant: "Treat 2D as 1D array logic.", description: "Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix.", examples: [], constraints: [] },
    { id: "rotated_min", title: "Find Minimum in Rotated Sorted Array", diff: "Medium", invariant: "Compare mid with right.", description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element.", examples: [], constraints: [] },
  ],

  MONOTONIC_STACK: [
    { id: "next_greater_i", title: "Next Greater Element I", diff: "Easy", invariant: "Hash map + Mono Stack.", description: "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.", examples: [], constraints: [] },
    { id: "daily_temps", title: "Daily Temperatures", diff: "Medium", invariant: "Store indices, compare values.", description: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.", examples: [], constraints: [] },
    { id: "asteroid_coll", title: "Asteroid Collision", diff: "Medium", invariant: "Collision rules on stack top.", description: "We are given an array asteroids of integers representing asteroids in a row.", examples: [], constraints: [] },
  ],

  BINARY_TREES: [
    { id: "max_depth", title: "Maximum Depth of Binary Tree", diff: "Easy", invariant: "DFS height calculation.", description: "Given the root of a binary tree, return its maximum depth.", examples: [], constraints: [] },
    { id: "level_order", title: "Binary Tree Level Order Traversal", diff: "Medium", invariant: "BFS Queue size tracking.", description: "Given the root of a binary tree, return the level order traversal of its nodes' values.", examples: [], constraints: [] },
    { id: "validate_bst", title: "Validate Binary Search Tree", diff: "Medium", invariant: "Range (min, max) propagation.", description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).", examples: [], constraints: [] },
  ],

  INTERVALS: [
    { id: "attend_meetings", title: "Meeting Rooms", diff: "Easy", invariant: "Sort by start time.", description: "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings.", examples: [], constraints: [] },
    { id: "insert_interval", title: "Insert Interval", diff: "Medium", invariant: "Skip, Merge, Append.", description: "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.", examples: [], constraints: [] },
    { id: "merge_intervals", title: "Merge Intervals", diff: "Medium", invariant: "Sort start, track end.", description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.", examples: [], constraints: [] },
  ],

  GREEDY: [
    { id: "assign_cookies", title: "Assign Cookies", diff: "Easy", invariant: "Sort greed + Sort size.", description: "Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.", examples: [], constraints: [] },
    { id: "jump_game", title: "Jump Game", diff: "Medium", invariant: "Max reachable index extension.", description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.", examples: [], constraints: [] },
    { id: "gas_station", title: "Gas Station", diff: "Medium", invariant: "Total sum >= 0 check.", description: "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].", examples: [], constraints: [] },
  ],

  DFS_BFS: [
    { id: "flood_fill", title: "Flood Fill", diff: "Easy", invariant: "4-directional recursion.", description: "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.", examples: [], constraints: [] },
    { id: "num_islands", title: "Number of Islands", diff: "Medium", invariant: "Sink visited land.", description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.", examples: [], constraints: [] },
    { id: "rotting_oranges", title: "Rotting Oranges", diff: "Medium", invariant: "Multi-source BFS.", description: "You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange.", examples: [], constraints: [] },
  ],

  BACKTRACKING: [
    { id: "binary_watch", title: "Binary Watch", diff: "Easy", invariant: "Bit count or recursion.", description: "A binary watch has 4 LEDs on the top to represent the hours (0-11), and 6 LEDs on the bottom to represent the minutes (0-59).", examples: [], constraints: [] },
    { id: "permutations", title: "Permutations", diff: "Medium", invariant: "Used array/set state.", description: "Given an array nums of distinct integers, return all the possible permutations.", examples: [], constraints: [] },
    { id: "comb_sum", title: "Combination Sum", diff: "Medium", invariant: "Target reduction, index passing.", description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.", examples: [], constraints: [] },
  ],

  TRIES: [
    { id: "longest_common_prefix", title: "Longest Common Prefix", diff: "Easy", invariant: "Horizontal scan or Trie.", description: "Write a function to find the longest common prefix string amongst an array of strings.", examples: [], constraints: [] },
    { id: "implement_trie", title: "Implement Trie (Prefix Tree)", diff: "Medium", invariant: "Node {children[26], isEnd}.", description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.", examples: [], constraints: [] },
    { id: "word_search_ii", title: "Word Search II", diff: "Medium", invariant: "Backtracking on Trie.", description: "Given an m x n board of characters and a list of strings words, return all words on the board.", examples: [], constraints: [] },
  ],

  TOPOLOGICAL_SORT: [
    { id: "find_judge", title: "Find the Town Judge", diff: "Easy", invariant: "In-degree vs Out-degree.", description: "In a town, there are n people labeled from 1 to n. There is a rumor that one of these people is secretly the town judge.", examples: [], constraints: [] },
    { id: "course_sched", title: "Course Schedule", diff: "Medium", invariant: "Cycle detection (DFS/Kahn).", description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.", examples: [], constraints: [] },
    { id: "course_sched_ii", title: "Course Schedule II", diff: "Medium", invariant: "Order generation.", description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.", examples: [], constraints: [] },
  ],

  UNION_FIND: [
    { id: "valid_path", title: "Find if Path Exists in Graph", diff: "Easy", invariant: "Find(u) == Find(v).", description: "There is a bi-directional graph with n vertices, where each vertex is labeled from 0 to n - 1 (inclusive).", examples: [], constraints: [] },
    { id: "num_provinces", title: "Number of Provinces", diff: "Medium", invariant: "Count distinct roots.", description: "There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.", examples: [], constraints: [] },
    { id: "redundant_conn", title: "Redundant Connection", diff: "Medium", invariant: "Cycle detection via Union.", description: "In this problem, a tree is an undirected graph that is connected and has no cycles.", examples: [], constraints: [] },
  ],

  BIT_MANIPULATION: [
    { id: "num_1_bits", title: "Number of 1 Bits", diff: "Easy", invariant: "n & (n-1) drops lowest set bit.", description: "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).", examples: [], constraints: [] },
    { id: "single_num", title: "Single Number", diff: "Medium", invariant: "XOR self-inverse property.", description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.", examples: [], constraints: [] },
    { id: "sum_two_int", title: "Sum of Two Integers", diff: "Medium", invariant: "XOR for sum, AND<<1 for carry.", description: "Given two integers a and b, return the sum of the two integers without using the operators + and -.", examples: [], constraints: [] },
  ],

  DYNAMIC_PROGRAMMING: [
    { id: "climb_stairs", title: "Climbing Stairs", diff: "Easy", invariant: "dp[i] = dp[i-1] + dp[i-2].", description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", examples: [], constraints: [] },
    { id: "house_robber", title: "House Robber", diff: "Medium", invariant: "Max(rob current, skip current).", description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.", examples: [], constraints: [] },
    { id: "coin_change", title: "Coin Change", diff: "Medium", invariant: "Min coins for amount - coin.", description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.", examples: [], constraints: [] },
  ],
};
