# CLRS — Complete Interview Question Bank
### Introduction to Algorithms (4th Edition) — Cormen, Leiserson, Rivest, Stein
> 100 questions per major topic | Every question tagged with depth type and real-world application

---

## How to Use This Bank

Each question carries two tags:
- **Type**: `[CONCEPT]` `[DERIVE]` `[CODE]` `[PROVE]` `[TRADEOFF]` `[APPLY]`
- **Where it appears**: `{FAANG}` `{Competitive}` `{Research}` `{SWE Interview}` `{System Design}`

**Depth guide:**
- `[CONCEPT]` — Define it, explain intuitively, give an example
- `[DERIVE]` — Derive the recurrence, prove the bound, work through the math
- `[CODE]` — Write the algorithm in pseudocode or your language of choice
- `[PROVE]` — Prove correctness, prove optimality, prove a lower bound
- `[TRADEOFF]` — Compare two approaches on time, space, cache, constants
- `[APPLY]` — "Given this real problem, which CLRS algorithm/technique applies and why?"

---

## CLRS 4th Edition — Structure Map

| Part | Chapters | Topics |
|---|---|---|
| I — Foundations | 1–5 | Roles of algorithms, insertion/merge sort, running times, divide & conquer, probability |
| II — Sorting & Order Statistics | 6–9 | Heapsort, quicksort, linear-time sorting, medians |
| III — Data Structures | 10–13 | Elementary DS, hash tables, BSTs, red-black trees |
| IV — Advanced Design & Analysis | 14–16 | Dynamic programming, greedy, amortized analysis |
| V — Advanced Data Structures | 17–19 | Augmenting DS, B-trees, disjoint sets |
| VI — Graph Algorithms | 20–25 | BFS/DFS, MST, shortest paths, max flow, bipartite matching |
| VII — Selected Topics | 26–30 | Parallel algorithms, matrix ops, linear programming, polynomials/FFT, number theory |
| VIII — More Selected Topics | 31–35 | String matching, ML algorithms, NP-completeness, approximation |

---

# PART I — Foundations

---

## Chapter 1–3: Algorithm Analysis, Asymptotic Notation, Recurrences

**100 Questions**

### Asymptotic Notation & Running Time (Q1–Q30)

1. `[CONCEPT]` `{SWE Interview}` What does O(n) notation mean precisely? Give the formal definition involving constants c and n₀.
2. `[CONCEPT]` `{SWE Interview}` What is the difference between O, Ω, Θ, o, and ω? When does Θ(n) not exist for an algorithm?
3. `[CONCEPT]` `{FAANG}` Why is O-notation an upper bound but not always tight? Give an example where O(n²) is technically correct but Θ(n log n) is better.
4. `[DERIVE]` `{Competitive}` Prove that n² + 100n + 5 = Θ(n²). Find explicit constants c₁, c₂, and n₀.
5. `[CONCEPT]` `{SWE Interview}` What is the difference between worst-case, average-case, and best-case complexity? Which does O-notation describe?
6. `[DERIVE]` `{Competitive}` Rank the following from slowest to fastest growth: n!, 2ⁿ, nⁿ, n³, n² log n, n log n, n, log n, log log n, 1.
7. `[CONCEPT]` `{SWE Interview}` What is amortized complexity? How is it different from average-case complexity?
8. `[DERIVE]` `{Competitive}` Prove that log(n!) = Θ(n log n) using Stirling's approximation.
9. `[CONCEPT]` `{SWE Interview}` What does "polynomial time" mean? Why is it the boundary between "tractable" and "intractable" in complexity theory?
10. `[DERIVE]` `{Competitive}` Is 2^(2n) = O(2^n)? Prove or disprove.
11. `[CONCEPT]` `{SWE Interview}` What is space complexity? Can an O(n log n) time algorithm use O(1) space?
12. `[CONCEPT]` `{SWE Interview}` What is a loop invariant? How do you use it to prove algorithm correctness?
13. `[PROVE]` `{Competitive}` Prove the loop invariant for insertion sort: at the start of each iteration, the subarray A[1..j-1] contains the original elements in sorted order.
14. `[CONCEPT]` `{SWE Interview}` What is the difference between an algorithm's time complexity and its practical running time?
15. `[DERIVE]` `{Competitive}` Show that if f(n) = O(g(n)) and g(n) = O(h(n)), then f(n) = O(h(n)). (Transitivity of O.)
16. `[CONCEPT]` `{Research}` What is the RAM model of computation? What operations cost O(1) and what are its limitations?
17. `[DERIVE]` `{Competitive}` Prove that max(f(n), g(n)) = Θ(f(n) + g(n)).
18. `[CONCEPT]` `{FAANG}` Why does constant factor matter in practice even if it doesn't affect asymptotic complexity?
19. `[CONCEPT]` `{SWE Interview}` What is the difference between O(n) and O(n) expected? Why does expected complexity need careful framing?
20. `[DERIVE]` `{Competitive}` Show that n^k = O(c^n) for any k > 0 and c > 1. (Polynomials are eventually dominated by exponentials.)
21. `[CONCEPT]` `{SWE Interview}` What is a tight bound? What does it mean to say an algorithm is "optimally efficient"?
22. `[PROVE]` `{Research}` Prove the lower bound Ω(n log n) for comparison-based sorting using decision trees.
23. `[CONCEPT]` `{SWE Interview}` What is recursion depth and how does it affect space complexity?
24. `[DERIVE]` `{Competitive}` Prove that log_a(n) = Θ(log_b(n)) for any constants a, b > 1 — i.e., the base of logarithm doesn't matter asymptotically.
25. `[CONCEPT]` `{FAANG}` What is the practical impact of cache behavior on algorithm performance when two algorithms have the same asymptotic complexity?
26. `[APPLY]` `{SWE Interview}` An algorithm runs in O(n log n). Your input doubles from 10⁶ to 2×10⁶. By how much does runtime increase (approximately)?
27. `[APPLY]` `{FAANG}` You have two sorting algorithms: A runs in 3n log n operations, B runs in 0.5n² operations. For what input sizes is A faster?
28. `[TRADEOFF]` `{SWE Interview}` When is an O(n²) algorithm acceptable in production? Give three practical scenarios.
29. `[CONCEPT]` `{Competitive}` What is iterated logarithm (log*n)? What algorithm has O(n log* n) complexity?
30. `[DERIVE]` `{Research}` What is the definition of o(g(n)) ("little-o")? Prove that n = o(n log n).

---

### Recurrences (Q31–Q60)

31. `[CONCEPT]` `{SWE Interview}` What is a recurrence relation? Give the recurrence for merge sort and state its solution.
32. `[DERIVE]` `{Competitive}` Solve T(n) = 2T(n/2) + n using the substitution method. Prove T(n) = O(n log n).
33. `[DERIVE]` `{Competitive}` Solve T(n) = T(n-1) + n using substitution. What is the closed form?
34. `[CONCEPT]` `{SWE Interview}` State the Master Theorem. What are the three cases and their conditions?
35. `[APPLY]` `{FAANG}` Apply the Master Theorem to: T(n) = 4T(n/2) + n. Which case applies? What is the solution?
36. `[APPLY]` `{FAANG}` Apply the Master Theorem to: T(n) = 4T(n/2) + n². Which case applies?
37. `[APPLY]` `{FAANG}` Apply the Master Theorem to: T(n) = 4T(n/2) + n³. Which case applies?
38. `[APPLY]` `{FAANG}` Apply the Master Theorem to: T(n) = 2T(n/2) + n log n. Does the Master Theorem apply? Why not?
39. `[DERIVE]` `{Competitive}` Use the recursion tree method to solve T(n) = 3T(n/4) + Θ(n²).
40. `[DERIVE]` `{Competitive}` Use the recursion tree method to solve T(n) = T(n/3) + T(2n/3) + O(n). (Quicksort worst/balanced split.)
41. `[CONCEPT]` `{SWE Interview}` What is the Akra-Bazzi theorem? When do you use it instead of the Master Theorem?
42. `[DERIVE]` `{Research}` Solve the recurrence T(n) = T(n-1) + T(n-2) + 1, which resembles Fibonacci. What is the asymptotic growth?
43. `[PROVE]` `{Competitive}` Prove by induction that the solution to T(n) = 2T(n/2) + n is O(n log n). Show the inductive step clearly.
44. `[DERIVE]` `{Competitive}` Solve T(n) = T(√n) + 1 using the change of variables m = log n.
45. `[APPLY]` `{FAANG}` What is the recurrence for binary search? Solve it.
46. `[APPLY]` `{FAANG}` What is the recurrence for Strassen's matrix multiplication? Solve it using the Master Theorem.
47. `[DERIVE]` `{Competitive}` Solve T(n) = 2T(n/2) + Θ(1). What algorithm has this recurrence?
48. `[CONCEPT]` `{Research}` What is a "smoothness condition" in recurrence solving? Why does it matter?
49. `[DERIVE]` `{Competitive}` Solve T(n) = T(n-k) + O(n) for constant k. What algorithm pattern gives this?
50. `[PROVE]` `{Research}` Prove that the solution to T(n) = aT(n/b) + f(n) in Case 1 of the Master Theorem is Θ(n^(log_b a)).
51. `[APPLY]` `{Competitive}` What is the recurrence for the Karatsuba multiplication algorithm? Solve it. How does it compare to the naïve O(n²)?
52. `[DERIVE]` `{Competitive}` Solve T(n) = 4T(n/2) + n² log n. (Hint: Master Theorem doesn't directly apply — use recursion tree.)
53. `[CONCEPT]` `{SWE Interview}` What is memoization? How does it convert an exponential recursive algorithm into polynomial time?
54. `[APPLY]` `{SWE Interview}` Fibonacci naïve recursion has recurrence T(n) = T(n-1) + T(n-2) + O(1). What is its complexity? How does memoization reduce it?
55. `[DERIVE]` `{Competitive}` For a recurrence T(n) = T(n/3) + T(2n/3) + n, draw the recursion tree and determine the solution.
56. `[CONCEPT]` `{Research}` What is the Characteristic equation method for solving linear recurrences? Give an example.
57. `[APPLY]` `{Competitive}` What is the recurrence for the closest pair of points algorithm? Solve it.
58. `[DERIVE]` `{Competitive}` Solve T(n) = 2T(n/4) + √n using the Master Theorem. Which case applies?
59. `[CONCEPT]` `{SWE Interview}` Why does merge sort have O(n log n) runtime but O(n) space, while heapsort has O(n log n) time and O(1) space?
60. `[PROVE]` `{Research}` Prove the lower bound for recurrence solving: any algorithm that uses substitution must still "guess" the form. What technique avoids guessing?

---

### Divide and Conquer (Q61–Q80)

61. `[CONCEPT]` `{SWE Interview}` What are the three steps of a divide-and-conquer algorithm? Give a concrete example for each step using merge sort.
62. `[CODE]` `{FAANG}` Write the merge sort algorithm. What is the time and space complexity?
63. `[CODE]` `{FAANG}` Write the binary search algorithm iteratively and recursively. Prove correctness using a loop invariant.
64. `[CODE]` `{FAANG}` Write the algorithm for finding the maximum subarray using divide and conquer. What is its recurrence?
65. `[CONCEPT]` `{FAANG}` What is Strassen's algorithm? What does it improve over the naïve O(n³) matrix multiplication?
66. `[DERIVE]` `{Competitive}` Derive Strassen's recurrence T(n) = 7T(n/2) + Θ(n²). What is the solution?
67. `[CODE]` `{Competitive}` Implement the closest pair of points algorithm in O(n log n). What is the key insight of the strip step?
68. `[APPLY]` `{FAANG}` How would you use divide and conquer to count inversions in an array in O(n log n)?
69. `[APPLY]` `{FAANG}` How would you use divide and conquer to find the kth largest element? What is the worst-case complexity?
70. `[TRADEOFF]` `{SWE Interview}` Merge sort vs. quicksort in practice — both O(n log n) average. Which do you use and why?
71. `[CODE]` `{FAANG}` Write the algorithm for multiplying two n-bit integers using Karatsuba's method. What is its complexity?
72. `[APPLY]` `{Competitive}` How do you compute a^n mod m efficiently using divide and conquer? What is the time complexity?
73. `[CONCEPT]` `{SWE Interview}` What is the "combine" step in merge sort? Why is it O(n) and not O(1)?
74. `[APPLY]` `{FAANG}` Given a sorted rotated array, how do you binary search for a target? What modification to standard binary search is needed?
75. `[CODE]` `{FAANG}` Implement a divide and conquer algorithm to compute the power set of a set of n elements.
76. `[APPLY]` `{Competitive}` How would you solve the "majority element" problem (element appearing > n/2 times) using divide and conquer in O(n)?
77. `[CONCEPT]` `{Research}` What is the relationship between divide and conquer and dynamic programming? When does D&C become DP (overlapping subproblems)?
78. `[TRADEOFF]` `{FAANG}` For matrix multiplication, when would you use Strassen in practice? What are the constant factor and numerical stability tradeoffs?
79. `[APPLY]` `{Competitive}` How do you find the second smallest element in an array using divide and conquer with at most n + log n - 2 comparisons?
80. `[PROVE]` `{Research}` Prove that the maximum subarray problem cannot be solved faster than O(n) — i.e., Ω(n) is a lower bound.

---

### Probabilistic Analysis & Randomized Algorithms (Q81–Q100)

81. `[CONCEPT]` `{SWE Interview}` What is a randomized algorithm? What is the difference between Las Vegas and Monte Carlo algorithms?
82. `[CONCEPT]` `{Competitive}` What is expected running time? Is it the same as average-case running time?
83. `[DERIVE]` `{Competitive}` What is the expected number of comparisons in randomized quicksort? Derive it using indicator random variables.
84. `[CONCEPT]` `{SWE Interview}` What is indicator random variable? How does CLRS use it to simplify expected value calculations?
85. `[DERIVE]` `{Competitive}` Prove that the expected number of heads in n fair coin flips is n/2 using linearity of expectation.
86. `[DERIVE]` `{Competitive}` What is the birthday paradox? If there are n people, what is the probability that two share a birthday? At what n does this exceed 50%?
87. `[APPLY]` `{FAANG}` How would you use the birthday paradox to design a hash function analysis?
88. `[CONCEPT]` `{Research}` What is the hiring problem (secretary problem)? What is the optimal strategy and what is its expected cost?
89. `[DERIVE]` `{Competitive}` In the hiring problem, derive that the expected number of hires is Θ(ln n).
90. `[CONCEPT]` `{FAANG}` What is a random permutation? How does the RANDOMIZE-IN-PLACE algorithm work and what is its correctness argument?
91. `[PROVE]` `{Research}` Prove that RANDOMIZE-IN-PLACE produces a uniformly random permutation.
92. `[CONCEPT]` `{SWE Interview}` What is the difference between randomized quicksort and quicksort with median-of-3 pivot? Which is better in practice?
93. `[APPLY]` `{FAANG}` How does randomization help with adversarial inputs to quicksort?
94. `[DERIVE]` `{Competitive}` What is the expected number of recursive calls in randomized quicksort? Use indicator variables.
95. `[CONCEPT]` `{Research}` What is a probabilistic recurrence? Give an example from randomized selection.
96. `[APPLY]` `{SWE Interview}` How would you sample k items uniformly at random from a stream of n items without knowing n in advance? (Reservoir sampling)
97. `[CODE]` `{FAANG}` Implement reservoir sampling for k=1. Prove it samples each element with probability 1/n.
98. `[CONCEPT]` `{Research}` What is Markov's inequality? What is Chebyshev's inequality? How are they used to bound tail probabilities of randomized algorithms?
99. `[TRADEOFF]` `{FAANG}` When is a randomized algorithm preferable to a deterministic one with the same expected complexity?
100. `[APPLY]` `{Competitive}` A hash table uses a random hash function. Use the birthday paradox to determine the expected number of elements before the first collision.

---

# PART II — Sorting & Order Statistics

---

## Chapters 6–9: Sorting Algorithms

**100 Questions**

### Comparison-Based Sorting (Q1–Q50)

1. `[CONCEPT]` `{SWE Interview}` What is insertion sort? What is its time complexity in best, average, and worst case? When would you choose it over merge sort?
2. `[CODE]` `{FAANG}` Write insertion sort. Prove its loop invariant.
3. `[CONCEPT]` `{SWE Interview}` What is selection sort? What is its complexity? Why is it rarely used in practice?
4. `[CONCEPT]` `{SWE Interview}` What is bubble sort? What is its complexity? Why does it perform poorly despite being simple?
5. `[CODE]` `{FAANG}` Write merge sort. Trace through sorting [5, 2, 8, 1, 9, 3].
6. `[PROVE]` `{Competitive}` Prove merge sort's correctness by induction on the array length.
7. `[CONCEPT]` `{SWE Interview}` What is heapsort? What is its time and space complexity? How does it compare to merge sort?
8. `[CODE]` `{FAANG}` Write the MAX-HEAPIFY procedure. What is its time complexity and why?
9. `[CODE]` `{FAANG}` Write the BUILD-MAX-HEAP procedure. Why is its complexity O(n) and not O(n log n)?
10. `[DERIVE]` `{Competitive}` Prove that BUILD-MAX-HEAP runs in O(n) time using the sum of heights in a complete binary tree.
11. `[CODE]` `{FAANG}` Write the full HEAPSORT algorithm combining BUILD-MAX-HEAP and EXTRACT-MAX.
12. `[CONCEPT]` `{SWE Interview}` What is a max-heap property? How does heapsort use it?
13. `[TRADEOFF]` `{SWE Interview}` Heapsort vs. merge sort: both O(n log n). What are the cache, stability, and space tradeoffs?
14. `[CONCEPT]` `{SWE Interview}` What does it mean for a sorting algorithm to be stable? Name one stable and one unstable sorting algorithm.
15. `[CODE]` `{FAANG}` Write randomized quicksort (with random pivot selection). What is its expected complexity?
16. `[DERIVE]` `{Competitive}` What is the worst case for quicksort? Give an input that triggers it. What is its recurrence?
17. `[DERIVE]` `{Competitive}` Prove that the expected running time of randomized quicksort is O(n log n) using indicator random variables.
18. `[CONCEPT]` `{SWE Interview}` What is the PARTITION procedure in quicksort? Write the Lomuto and Hoare partition schemes.
19. `[TRADEOFF]` `{FAANG}` Compare Lomuto vs. Hoare partition. Which does fewer swaps?
20. `[CONCEPT]` `{FAANG}` What is the three-way partition (Dutch National Flag problem)? When does it make quicksort O(n) for special inputs?
21. `[CODE]` `{Competitive}` Implement introsort (introspective sort). Why does Python use Timsort instead?
22. `[CONCEPT]` `{FAANG}` What is Timsort? How does it exploit natural runs in real-world data?
23. `[PROVE]` `{Research}` Prove the Ω(n log n) lower bound for comparison-based sorting using a decision tree argument.
24. `[CONCEPT]` `{SWE Interview}` What is the decision tree model? How does it capture comparison-based sorting?
25. `[DERIVE]` `{Research}` The decision tree for sorting n elements has at least n! leaves. What height must it have? Use Stirling's approximation to show Ω(n log n).
26. `[APPLY]` `{FAANG}` In what scenarios is quicksort faster than merge sort in practice, despite identical asymptotic complexity?
27. `[APPLY]` `{SWE Interview}` When sorting nearly sorted data, which algorithm is fastest: insertion sort, merge sort, or quicksort?
28. `[CONCEPT]` `{Competitive}` What is shellsort? What is its best known time complexity?
29. `[CODE]` `{FAANG}` Implement merge sort iteratively (bottom-up). Compare it to the recursive version.
30. `[TRADEOFF]` `{SWE Interview}` When would you use an in-place sorting algorithm vs. one with auxiliary space?
31. `[APPLY]` `{FAANG}` Sort an array of 1 million integers where each integer is between 0 and 1000. What is the most efficient approach?
32. `[APPLY]` `{Competitive}` Given an array of n elements, k of which are unsorted (the rest are in sorted order), find the optimal sorting algorithm and its complexity.
33. `[CODE]` `{FAANG}` Implement sort for a linked list. Can you use in-place quicksort? Why or why not?
34. `[APPLY]` `{FAANG}` Given two sorted arrays of size m and n, merge them in O(m + n) time and O(1) space.
35. `[CONCEPT]` `{Research}` What is the information-theoretic lower bound? Why can't any comparison-based sort beat O(n log n)?
36. `[CODE]` `{Competitive}` Implement an O(n log n) algorithm to find the number of inversions in an array using merge sort.
37. `[APPLY]` `{FAANG}` You need to sort 1TB of data that doesn't fit in RAM. What algorithm do you use?
38. `[CONCEPT]` `{SWE Interview}` What is external sorting? What is the merge-sort-based approach for disk-based data?
39. `[CODE]` `{Competitive}` Implement k-way merge (merging k sorted arrays) using a min-heap.
40. `[APPLY]` `{FAANG}` What is the fastest way to find the top-k elements from n unsorted elements?
41. `[CONCEPT]` `{SWE Interview}` What is an adaptive sorting algorithm? What property of the input does it exploit?
42. `[CODE]` `{Competitive}` Implement cycle sort — the algorithm that minimizes the number of writes to the array.
43. `[PROVE]` `{Research}` Prove that any sorting algorithm that uses only comparisons must make at least ⌈log₂(n!)⌉ comparisons in the worst case.
44. `[APPLY]` `{SWE Interview}` How do you sort an array that has only two distinct values (0s and 1s) in O(n) time and O(1) space?
45. `[CODE]` `{FAANG}` Implement the Dutch National Flag algorithm to sort an array with three distinct values (0, 1, 2).
46. `[APPLY]` `{Competitive}` How would you sort a sequence of strings lexicographically most efficiently?
47. `[CONCEPT]` `{Research}` What is the AKS sorting network? What is its significance?
48. `[APPLY]` `{FAANG}` Given a stream of integers, maintain the top-k elements at all times. What data structure and what is the complexity per element?
49. `[CODE]` `{Competitive}` Implement patience sorting. What well-known algorithm does it relate to?
50. `[TRADEOFF]` `{SWE Interview}` In Python, `list.sort()` uses Timsort. In C++, `std::sort` uses introsort. When would you need to implement your own sort?

---

### Linear-Time Sorting (Q51–Q70)

51. `[CONCEPT]` `{SWE Interview}` What is counting sort? What is its time complexity? What assumption does it make?
52. `[CODE]` `{FAANG}` Write counting sort. Trace through sorting [3, 1, 4, 1, 5, 9, 2, 6] with k=9.
53. `[PROVE]` `{Competitive}` Prove that counting sort is stable. Why does stability matter here?
54. `[CONCEPT]` `{SWE Interview}` What is radix sort? How does it use counting sort as a subroutine?
55. `[CODE]` `{FAANG}` Write radix sort for integers. What is its time complexity in terms of n and the number of digits d?
56. `[DERIVE]` `{Competitive}` When is radix sort asymptotically faster than comparison-based sorts? What does d need to be?
57. `[CONCEPT]` `{SWE Interview}` What is bucket sort? What distribution assumption does it require?
58. `[CODE]` `{FAANG}` Implement bucket sort for floating point numbers uniform in [0,1). Prove its expected O(n) running time.
59. `[DERIVE]` `{Competitive}` Derive the expected running time of bucket sort using indicator random variables and the birthday paradox.
60. `[TRADEOFF]` `{SWE Interview}` When would you use bucket sort, counting sort, or radix sort instead of comparison-based sort?
61. `[PROVE]` `{Research}` Prove that the Ω(n log n) lower bound does NOT apply to counting sort. What assumption does this violate?
62. `[APPLY]` `{FAANG}` Sort 10 million IP addresses (32-bit integers). What is the most efficient approach?
63. `[APPLY]` `{Competitive}` Sort 1 million dates (in format YYYYMMDD) efficiently. What algorithm and what is the complexity?
64. `[APPLY]` `{FAANG}` Given an array of n integers each in range [1, n²], sort them in O(n) time.
65. `[CODE]` `{Competitive}` Implement LSD (Least Significant Digit) radix sort vs. MSD radix sort. When does MSD enable early termination?
66. `[APPLY]` `{FAANG}` How would you sort a list of strings using radix sort? What alphabet size matters?
67. `[CONCEPT]` `{Research}` What is the ALGORITHM X bound by van Emde Boas for sorting integers in O(n log log n)?
68. `[TRADEOFF]` `{SWE Interview}` Radix sort on integers vs. comparison sort: at what n does radix sort win on modern hardware?
69. `[APPLY]` `{Competitive}` Sort an array of n integers in range [1, n^k] for constant k. What is the time complexity of radix sort here?
70. `[CODE]` `{Competitive}` Implement stable counting sort that can be used as a subroutine in radix sort. Why must it be stable?

---

### Medians & Order Statistics (Q71–Q100)

71. `[CONCEPT]` `{SWE Interview}` What is the selection problem? What is the difference between finding the minimum and the kth smallest element?
72. `[CODE]` `{FAANG}` Write the RANDOMIZED-SELECT algorithm. What is its expected time complexity?
73. `[DERIVE]` `{Competitive}` Prove that RANDOMIZED-SELECT runs in O(n) expected time.
74. `[CODE]` `{Competitive}` Write the deterministic SELECT algorithm (median of medians). What is its worst-case time complexity?
75. `[DERIVE]` `{Competitive}` Derive the recurrence for the median-of-medians algorithm: T(n) ≤ T(n/5) + T(7n/10 + 6) + O(n). Solve it.
76. `[PROVE]` `{Research}` Prove that at least 3n/10 - 6 elements are less than the median of medians, ensuring a good split.
77. `[TRADEOFF]` `{SWE Interview}` RANDOMIZED-SELECT vs. median of medians: both O(n), but which is used in practice and why?
78. `[APPLY]` `{FAANG}` Find the median of two sorted arrays in O(log(m+n)) time. What is the key invariant?
79. `[CODE]` `{FAANG}` Implement the median of two sorted arrays algorithm. Trace through an example.
80. `[APPLY]` `{FAANG}` Find the kth smallest element in an unsorted array in O(n) worst case. Which algorithm?
81. `[CODE]` `{FAANG}` Implement a data structure that supports: insert(x), find_median(). What is the complexity of each operation?
82. `[APPLY]` `{FAANG}` Sliding window median: given a stream of numbers and a window of size k, find the median at each step.
83. `[CONCEPT]` `{SWE Interview}` What is the nth-element algorithm in C++ STL? What guarantee does it provide?
84. `[APPLY]` `{Competitive}` What is the "tournament tree" approach to finding the minimum? How many comparisons does it take?
85. `[DERIVE]` `{Competitive}` Prove that finding the minimum of n elements requires exactly n-1 comparisons. Prove the lower bound.
86. `[DERIVE]` `{Competitive}` Finding both minimum and maximum: the naïve approach uses 2n-2 comparisons. What is the optimal algorithm? How many comparisons does it use?
87. `[CODE]` `{Competitive}` Write the simultaneous min-max algorithm that uses at most 3⌊n/2⌋ comparisons.
88. `[APPLY]` `{FAANG}` Given an unsorted array of n numbers, find the two closest numbers in O(n log n) time.
89. `[APPLY]` `{Competitive}` Given a set of n points, find the point closest to the median in O(n) time.
90. `[CONCEPT]` `{Research}` What is the "AKS" decision tree lower bound for the selection problem?
91. `[APPLY]` `{FAANG}` How do you find the kth smallest element in a sorted matrix (n×n) efficiently?
92. `[CODE]` `{Competitive}` Given n sorted lists each of length k, find the overall median in O(n log(nk)) time.
93. `[APPLY]` `{FAANG}` Find the top-k largest elements in an unsorted array. What is the most efficient algorithm?
94. `[CODE]` `{Competitive}` Implement a weighted median algorithm where each element has a weight.
95. `[APPLY]` `{Competitive}` The "1-center" problem: given n points on a line, find the point that minimizes the maximum distance to any of them. What is the answer?
96. `[APPLY]` `{FAANG}` Find the median in a stream of numbers in O(log n) per insertion using two heaps.
97. `[TRADEOFF]` `{SWE Interview}` Quickselect (RANDOMIZED-SELECT) vs. a sorting-based approach for finding the median. Compare constants.
98. `[PROVE]` `{Research}` Prove the lower bound for the selection problem: finding the kth smallest element requires Ω(n) comparisons.
99. `[APPLY]` `{FAANG}` How would you use order statistics to implement a data structure that supports rank(x) and select(k) queries?
100. `[CONCEPT]` `{Research}` What is the "finger search tree"? How does it improve on binary search for near-predecessor queries?

---

# PART III — Data Structures

---

## Chapters 10–13: Hash Tables, BSTs, Red-Black Trees

**100 Questions**

### Elementary Data Structures (Q1–Q15)

1. `[CONCEPT]` `{SWE Interview}` What is the difference between an array and a linked list for implementing a stack? What are the tradeoffs?
2. `[CODE]` `{FAANG}` Implement a queue using two stacks. What is the amortized time per operation?
3. `[CODE]` `{FAANG}` Implement a stack that supports push, pop, and getMin in O(1) time per operation.
4. `[CODE]` `{FAANG}` Implement a doubly linked list with insert, delete, and search. What is the time complexity of each?
5. `[APPLY]` `{FAANG}` Detect a cycle in a linked list in O(n) time and O(1) space. (Floyd's tortoise and hare.)
6. `[CODE]` `{FAANG}` Reverse a linked list iteratively and recursively.
7. `[CONCEPT]` `{SWE Interview}` What is a sentinel node in a linked list? How does it simplify boundary conditions?
8. `[CODE]` `{Competitive}` Implement an LRU cache using a doubly linked list + hash map. What are the time complexities?
9. `[APPLY]` `{FAANG}` Merge k sorted linked lists in O(n log k) time. What data structure do you use?
10. `[CODE]` `{FAANG}` Find the middle of a linked list in one pass.
11. `[CODE]` `{FAANG}` Implement a deque (double-ended queue) with O(1) push and pop from both ends.
12. `[APPLY]` `{Competitive}` Given a string, use a stack to check if parentheses are balanced.
13. `[CODE]` `{Competitive}` Implement a circular buffer (ring buffer). What happens on overflow?
14. `[APPLY]` `{FAANG}` Use a monotonic stack to find the next greater element for each element in an array in O(n).
15. `[CODE]` `{Competitive}` Implement a skip list. What is the expected time complexity for search, insert, delete?

---

### Hash Tables (Q16–Q45)

16. `[CONCEPT]` `{SWE Interview}` What is a hash table? What is the expected O(1) time complexity predicated on?
17. `[CONCEPT]` `{SWE Interview}` What is a collision in a hash table? Name two collision resolution strategies.
18. `[CODE]` `{FAANG}` Implement separate chaining for collision resolution. What is the worst-case time for search?
19. `[CODE]` `{FAANG}` Implement open addressing with linear probing. What is the load factor α and why does it matter?
20. `[CONCEPT]` `{SWE Interview}` What is clustering in open addressing? What is primary clustering vs. secondary clustering?
21. `[CONCEPT]` `{SWE Interview}` What is quadratic probing? How does it reduce primary clustering?
22. `[CONCEPT]` `{SWE Interview}` What is double hashing? Why is it the preferred open addressing strategy?
23. `[DERIVE]` `{Competitive}` Prove that for a hash table with load factor α < 1 using open addressing, the expected number of probes for a successful search is at most (1/α) ln(1/(1-α)).
24. `[CONCEPT]` `{FAANG}` What is a good hash function? What properties should it have?
25. `[CONCEPT]` `{Research}` What is universal hashing? What does it guarantee against adversarial inputs?
26. `[PROVE]` `{Research}` Prove that a universal hash family guarantees O(1) expected time per operation regardless of input.
27. `[CONCEPT]` `{Research}` What is perfect hashing? When is it useful and what is the two-level construction?
28. `[CONCEPT]` `{SWE Interview}` What is the load factor? How does it affect hash table performance? When do you resize?
29. `[CODE]` `{FAANG}` Implement a hash table with dynamic resizing (doubling when α > 0.75). What is the amortized cost of insert?
30. `[CONCEPT]` `{FAANG}` What is consistent hashing? How is it used in distributed systems?
31. `[APPLY]` `{FAANG}` Design a hash function for strings. What is the polynomial rolling hash?
32. `[APPLY]` `{FAANG}` Two strings are anagrams of each other. How do you check in O(n) using hashing?
33. `[APPLY]` `{FAANG}` Find the first non-repeating character in a string using a hash table.
34. `[APPLY]` `{FAANG}` Find all pairs of integers in an array that sum to a target value. Use a hash table for O(n).
35. `[APPLY]` `{FAANG}` Group anagrams together from a list of strings. What is the hashing strategy?
36. `[CODE]` `{FAANG}` Implement a LRU cache using `OrderedDict` (linked hash map). What is each operation's complexity?
37. `[APPLY]` `{FAANG}` Detect duplicates in an array in O(n) time and O(n) space using hashing.
38. `[CONCEPT]` `{Research}` What is cuckoo hashing? What is its worst-case lookup time?
39. `[CONCEPT]` `{Research}` What is a Bloom filter? How does it use multiple hash functions? What can it tell you with certainty?
40. `[DERIVE]` `{Research}` Derive the optimal number of hash functions for a Bloom filter with n elements and m bits to minimize false positive rate.
41. `[APPLY]` `{FAANG}` How would you implement a spell checker using a Bloom filter?
42. `[TRADEOFF]` `{SWE Interview}` Hash table vs. balanced BST for a dictionary: what are the performance tradeoffs?
43. `[CONCEPT]` `{Research}` What is the FKS scheme (Fredman-Komlós-Szemerédi)? How does it achieve O(1) worst-case lookups?
44. `[APPLY]` `{Competitive}` Use polynomial hashing (Rabin-Karp) to check if two strings are equal in O(1) after O(n) preprocessing.
45. `[CODE]` `{Competitive}` Implement a hash map that handles arbitrary key types. What interface must the key type provide?

---

### Binary Search Trees (Q46–Q70)

46. `[CONCEPT]` `{SWE Interview}` What is a binary search tree? What is the BST property?
47. `[CODE]` `{FAANG}` Write TREE-SEARCH, TREE-INSERT, and TREE-DELETE for a BST.
48. `[DERIVE]` `{Competitive}` What is the expected height of a randomly built BST with n keys? Prove it is O(log n).
49. `[CONCEPT]` `{SWE Interview}` What is the worst-case height of a BST? What input causes it?
50. `[CODE]` `{FAANG}` Write the in-order, pre-order, and post-order traversal of a BST. What does in-order produce?
51. `[CODE]` `{FAANG}` Find the successor and predecessor of a node in a BST. What is the time complexity?
52. `[CODE]` `{FAANG}` Find the lowest common ancestor (LCA) of two nodes in a BST.
53. `[CODE]` `{FAANG}` Convert a BST to a sorted doubly linked list in-place (Morris traversal).
54. `[APPLY]` `{FAANG}` Validate whether a binary tree is a valid BST. What is the trap with a naïve recursive check?
55. `[APPLY]` `{FAANG}` Find the kth smallest element in a BST in O(log n) time with augmentation, or O(h) without.
56. `[CODE]` `{FAANG}` Serialize and deserialize a BST. What is the minimum information needed?
57. `[APPLY]` `{Competitive}` Given a sorted array, build a height-balanced BST in O(n).
58. `[CODE]` `{FAANG}` Find all elements in a BST in range [lo, hi] efficiently.
59. `[CONCEPT]` `{Research}` What is a treap? How does it combine BST and heap properties? What is its expected height?
60. `[CODE]` `{Competitive}` Implement a treap with insert, delete, and search. Use random priorities.
61. `[APPLY]` `{FAANG}` How many distinct BSTs can be formed with n keys? (Catalan numbers)
62. `[DERIVE]` `{Competitive}` Derive the recurrence for the number of BSTs with n keys. Show it equals the nth Catalan number C(n).
63. `[APPLY]` `{FAANG}` What is an optimal BST? How does DP solve it in O(n³)?
64. `[CODE]` `{Competitive}` Implement the DP solution for optimal BST from CLRS Section 14.5.
65. `[TRADEOFF]` `{SWE Interview}` BST vs. hash table vs. sorted array for a dictionary with range queries. When does each win?
66. `[CODE]` `{FAANG}` Given two BSTs, merge them into a single sorted list in O(m+n).
67. `[APPLY]` `{Competitive}` Find the distance between two nodes in a BST (number of edges in the path).
68. `[CONCEPT]` `{Research}` What is a splay tree? What property does splaying maintain? What is its amortized complexity?
69. `[CODE]` `{Research}` Describe the zig, zig-zig, and zig-zag cases in a splay tree rotation.
70. `[APPLY]` `{Competitive}` Implement `floor(x)` and `ceil(x)` for a BST — finding the greatest key ≤ x and least key ≥ x.

---

### Red-Black Trees (Q71–Q100)

71. `[CONCEPT]` `{SWE Interview}` What are the five properties of a red-black tree? What do they guarantee about tree height?
72. `[DERIVE]` `{Competitive}` Prove that a red-black tree with n nodes has height at most 2 lg(n+1).
73. `[CONCEPT]` `{SWE Interview}` What is the black-height of a node? Why is it a useful concept?
74. `[CODE]` `{Competitive}` Write the LEFT-ROTATE and RIGHT-ROTATE operations. How do they preserve the BST property?
75. `[CODE]` `{Competitive}` Write the RB-INSERT procedure including the fixup cases. What are the three cases in RB-INSERT-FIXUP?
76. `[CODE]` `{Competitive}` Write the RB-DELETE procedure and its fixup. What are the cases in RB-DELETE-FIXUP?
77. `[PROVE]` `{Research}` Prove that RB-INSERT performs at most O(log n) rotations.
78. `[PROVE]` `{Research}` Prove that RB-DELETE performs at most a constant number of color changes (amortized).
79. `[TRADEOFF]` `{SWE Interview}` Red-black tree vs. AVL tree: which is faster for lookups? Which is faster for inserts? Why?
80. `[CONCEPT]` `{Research}` What is an AVL tree? What invariant does it maintain? How does its height compare to a red-black tree?
81. `[APPLY]` `{FAANG}` Java's `TreeMap` is implemented with a red-black tree. What O(log n) operations does it support?
82. `[APPLY]` `{FAANG}` C++'s `std::map` and `std::set` use red-black trees. What operations are O(log n)?
83. `[CONCEPT]` `{Research}` What is a 2-3-4 tree? What is its relationship to red-black trees?
84. `[PROVE]` `{Research}` Show that a red-black tree is a representation of a 2-3-4 tree. What do red nodes correspond to?
85. `[CONCEPT]` `{Research}` What is a weight-balanced tree? How does it differ from a height-balanced tree?
86. `[APPLY]` `{Competitive}` Augment a red-black tree to support rank(x) and select(k) in O(log n). What extra field do you store?
87. `[CODE]` `{Competitive}` Implement an order-statistics tree (augmented RB tree with size field). Write the OS-RANK and OS-SELECT procedures.
88. `[APPLY]` `{FAANG}` Using an order-statistics tree, find the number of elements in range [a, b] in O(log n).
89. `[APPLY]` `{Competitive}` Augment a BST to support interval queries: find an interval that overlaps with a given interval.
90. `[CODE]` `{Competitive}` Implement an interval tree based on an augmented red-black tree. Write the INTERVAL-SEARCH procedure.
91. `[PROVE]` `{Research}` Prove that INTERVAL-SEARCH is correct: if no overlapping interval exists, it returns NIL.
92. `[APPLY]` `{FAANG}` Given a set of intervals, find all pairs that overlap. Use an interval tree.
93. `[CONCEPT]` `{Research}` What is the "augmentation theorem" in CLRS? What properties must a red-black tree maintain when augmented?
94. `[APPLY]` `{Competitive}` Augment a BST to answer "how many elements are less than x?" in O(log n).
95. `[TRADEOFF]` `{SWE Interview}` When would you implement a self-balancing BST vs. using a skip list vs. using a B-tree?
96. `[CONCEPT]` `{Research}` What is a persistent data structure? How can you make a BST persistent?
97. `[CODE]` `{Research}` Describe path-copying for BST persistence. What is the time and space overhead per update?
98. `[APPLY]` `{Competitive}` Using a persistent segment tree, answer "how many numbers in array A[l..r] are ≤ k?" offline.
99. `[CONCEPT]` `{Research}` What is a link-cut tree? What operations does it support in O(log n) amortized?
100. `[TRADEOFF]` `{SWE Interview}` Red-black tree vs. B-tree for a database index: which is used and why?

---

# PART IV — Advanced Design & Analysis Techniques

---

## Chapters 14–16: Dynamic Programming, Greedy, Amortized Analysis

**100 Questions**

### Dynamic Programming (Q1–Q40)

1. `[CONCEPT]` `{SWE Interview}` What are the two key properties that make a problem solvable with dynamic programming?
2. `[CONCEPT]` `{SWE Interview}` What is the difference between top-down DP (memoization) and bottom-up DP (tabulation)?
3. `[CONCEPT]` `{SWE Interview}` What is a subproblem graph? How does it help you understand the DP structure?
4. `[CODE]` `{FAANG}` Solve the rod-cutting problem (CLRS 14.1). Write both top-down and bottom-up solutions.
5. `[DERIVE]` `{Competitive}` Derive the optimal substructure for rod cutting. What is the recurrence?
6. `[CODE]` `{FAANG}` Solve the 0/1 knapsack problem with DP. What is the time and space complexity?
7. `[CODE]` `{FAANG}` Solve the matrix chain multiplication problem (CLRS 14.2). What is the recurrence?
8. `[DERIVE]` `{Competitive}` Prove optimal substructure for matrix chain multiplication: any optimal solution contains optimal solutions to subproblems.
9. `[CODE]` `{FAANG}` Solve the longest common subsequence (LCS) problem. Write the recurrence and the bottom-up solution.
10. `[CODE]` `{FAANG}` Reconstruct the actual LCS (not just its length) using the DP table.
11. `[CODE]` `{FAANG}` Solve the longest increasing subsequence (LIS) problem in O(n²) and O(n log n).
12. `[DERIVE]` `{Competitive}` Derive the patience sorting connection to LIS. Why does the number of piles equal the LIS length?
13. `[CODE]` `{FAANG}` Solve the edit distance problem (Levenshtein distance). Write the DP recurrence.
14. `[CODE]` `{FAANG}` Solve the coin change problem: minimum number of coins to make amount n. Write the DP.
15. `[CODE]` `{FAANG}` Solve the egg drop problem: find the minimum number of trials to determine the critical floor with k eggs and n floors.
16. `[CODE]` `{FAANG}` Solve the burst balloons problem. What is the key insight for the DP state definition?
17. `[CODE]` `{FAANG}` Solve the optimal BST problem from CLRS 14.5. Write the recurrence and the O(n³) DP.
18. `[CODE]` `{Competitive}` Solve the traveling salesman problem (TSP) using bitmask DP in O(n² × 2ⁿ).
19. `[CODE]` `{FAANG}` Solve the word break problem: can string s be segmented into words from a dictionary?
20. `[CODE]` `{Competitive}` Solve the "stone game" or "interval DP" game theory problems using minimax DP.
21. `[CODE]` `{FAANG}` Solve the partition equal subset sum problem using DP.
22. `[CODE]` `{FAANG}` Solve the "number of ways to climb n stairs" taking 1 or 2 steps. Generalize to k steps.
23. `[CODE]` `{FAANG}` Solve the unique paths problem on an m×n grid. Add obstacles. Add weights (minimum cost path).
24. `[CODE]` `{FAANG}` Solve the house robber problem (max sum with no two adjacent). Extend to a circular array.
25. `[APPLY]` `{Competitive}` What is "interval DP"? Give three examples of problems that use it.
26. `[APPLY]` `{Competitive}` What is "digit DP"? Give an example: count numbers from 1 to N with digit sum ≤ k.
27. `[CODE]` `{Competitive}` Solve the "maximum sum of non-adjacent elements" problem. Extend to a tree.
28. `[CODE]` `{FAANG}` Solve the "regular expression matching" problem with DP (including `*` and `.`).
29. `[TRADEOFF]` `{SWE Interview}` When does memoization outperform tabulation and vice versa? Give one example of each.
30. `[APPLY]` `{Competitive}` What is the "convex hull trick" for optimizing certain DP transitions from O(n²) to O(n)?
31. `[CODE]` `{Competitive}` Apply the divide and conquer optimization to the "online" DP problem. What condition enables it?
32. `[CODE]` `{Competitive}` Solve the "minimum cost to cut a stick" problem using DP. (CLRS-adjacent interval DP.)
33. `[APPLY]` `{FAANG}` How do you detect if a problem has overlapping subproblems vs. non-overlapping (divide and conquer)?
34. `[CODE]` `{Competitive}` Solve the Bellman-Ford algorithm for single-source shortest paths using DP. Write the recurrence.
35. `[CODE]` `{Competitive}` Solve Floyd-Warshall (all-pairs shortest paths) using DP. Write the recurrence.
36. `[PROVE]` `{Research}` Prove the principle of optimality for DP: an optimal policy has the property that whatever the initial state and decision are, the remaining decisions must form an optimal policy with respect to the resulting state.
37. `[APPLY]` `{FAANG}` Solve the "stock buy/sell with cooldown" problem using state machine DP.
38. `[TRADEOFF]` `{SWE Interview}` DP vs. greedy: how do you know when greedy gives an optimal solution?
39. `[CODE]` `{Competitive}` Solve "minimum number of palindrome partitions of a string" using DP in O(n²).
40. `[APPLY]` `{Competitive}` What is "sum over subsets" (SOS) DP? What problems does it solve?

---

### Greedy Algorithms (Q41–Q65)

41. `[CONCEPT]` `{SWE Interview}` What is the greedy choice property? How do you prove that greedy gives an optimal solution?
42. `[CONCEPT]` `{SWE Interview}` What is the difference between "greedy stays ahead" and "exchange argument" proofs of greedy optimality?
43. `[CODE]` `{FAANG}` Solve the activity selection problem (CLRS 15.1). Prove that the greedy choice (earliest finish time) is optimal.
44. `[PROVE]` `{Competitive}` Use an exchange argument to prove that choosing the activity with earliest finish time is always optimal.
45. `[CODE]` `{FAANG}` Solve the fractional knapsack problem using greedy. Why doesn't greedy work for 0/1 knapsack?
46. `[PROVE]` `{Research}` Prove that greedy solves fractional knapsack optimally but not 0/1 knapsack. Give a counterexample for 0/1.
47. `[CODE]` `{FAANG}` Build a Huffman code for a set of character frequencies (CLRS 15.3). Write the algorithm.
48. `[PROVE]` `{Research}` Prove that Huffman coding produces an optimal prefix-free code.
49. `[CODE]` `{FAANG}` Prim's algorithm for MST. How is it a greedy algorithm?
50. `[CODE]` `{FAANG}` Kruskal's algorithm for MST. How does it use a greedy strategy with a disjoint set?
51. `[CODE]` `{FAANG}` Dijkstra's algorithm for shortest paths. How is it greedy?
52. `[PROVE]` `{Research}` Prove Dijkstra's algorithm is correct using a cut property argument.
53. `[APPLY]` `{FAANG}` Design a greedy algorithm for the "jump game": can you reach the last index?
54. `[CODE]` `{FAANG}` Solve "minimum number of jumps to reach the end" greedily. Prove optimality.
55. `[APPLY]` `{FAANG}` Solve the interval scheduling maximization problem (choose max non-overlapping intervals).
56. `[APPLY]` `{FAANG}` Solve the interval scheduling minimization problem (min number of rooms for all intervals).
57. `[CODE]` `{Competitive}` Solve the "gas station" problem greedily: can you complete the circuit?
58. `[CODE]` `{FAANG}` Solve the "task scheduler" problem: minimum time to execute all tasks with cooldown constraint.
59. `[PROVE]` `{Research}` State and prove the matroid greedy theorem: greedy is optimal on any matroid.
60. `[CONCEPT]` `{Research}` What is a matroid? What is the graphic matroid? What is the partition matroid?
61. `[APPLY]` `{Competitive}` What is the weighted matroid problem? What greedy algorithm solves it?
62. `[CODE]` `{Competitive}` Solve the offline caching problem (CLRS 15.4) with a greedy eviction strategy (furthest in future).
63. `[PROVE]` `{Research}` Prove that "furthest in future" is optimal for offline caching.
64. `[TRADEOFF]` `{SWE Interview}` For the job scheduling problem (minimize weighted completion time), what is the greedy rule? Prove it.
65. `[APPLY]` `{Competitive}` What is the "Egyptian fraction" problem? Does a greedy algorithm (Fibonacci-Sylvester) always terminate?

---

### Amortized Analysis (Q66–Q100)

66. `[CONCEPT]` `{SWE Interview}` What is amortized analysis? What three methods does CLRS present?
67. `[CONCEPT]` `{SWE Interview}` What is the aggregate method of amortized analysis? Give an example.
68. `[DERIVE]` `{Competitive}` Use the aggregate method to show that n PUSH, POP, MULTIPOP operations on a stack cost O(n) total.
69. `[CONCEPT]` `{SWE Interview}` What is the accounting method? What is a "credit"? What invariant must always hold?
70. `[DERIVE]` `{Competitive}` Use the accounting method to analyze a dynamic array (doubling). Assign 3 credits per PUSH and show amortized O(1).
71. `[CONCEPT]` `{SWE Interview}` What is the potential method? What is a potential function Φ? What is the amortized cost formula?
72. `[DERIVE]` `{Competitive}` Use the potential method to analyze a dynamic array. Let Φ = 2(size - capacity/2). Derive the amortized cost per PUSH.
73. `[DERIVE]` `{Competitive}` Use the potential method to analyze the binary counter (INCREMENT operation). Let Φ = number of 1-bits.
74. `[CODE]` `{FAANG}` Implement a dynamic array that doubles on overflow and halves on ≤25% occupancy. Prove each operation is amortized O(1).
75. `[PROVE]` `{Research}` Prove that any sequence of n PUSH and POP operations on a stack costs O(n) using the accounting method.
76. `[DERIVE]` `{Competitive}` Analyze MULTIPOP on a stack. A single MULTIPOP can take O(n) time — why is the amortized cost still O(1)?
77. `[CONCEPT]` `{Research}` What is the potential function for a splay tree? Prove that the amortized cost of any splay operation is O(log n).
78. `[DERIVE]` `{Competitive}` Analyze the union-find structure with union by rank and path compression. What is the amortized time per operation?
79. `[CONCEPT]` `{Research}` What is the inverse Ackermann function α(n)? Why does it appear in union-find analysis?
80. `[DERIVE]` `{Competitive}` Show that a sequence of n operations on a binary counter takes O(n) total using the aggregate method.
81. `[APPLY]` `{FAANG}` ArrayList in Java has amortized O(1) add(). What is the worst-case? When does it occur?
82. `[CODE]` `{FAANG}` Implement a queue using a deque that supports push, pop, and getMin in amortized O(1).
83. `[DERIVE]` `{Competitive}` Analyze the two-stack queue. Show that each ENQUEUE and DEQUEUE is amortized O(1).
84. `[CONCEPT]` `{Research}` What is a Fibonacci heap? What amortized bounds does it achieve? How does it improve Dijkstra's?
85. `[DERIVE]` `{Competitive}` State the amortized complexity of Fibonacci heap operations: insert O(1), extract-min O(log n), decrease-key O(1).
86. `[CONCEPT]` `{Research}` What is the degree bound for nodes in a Fibonacci heap? Prove it is O(log n).
87. `[APPLY]` `{Competitive}` How does Fibonacci heap improve Dijkstra's algorithm from O((V+E) log V) to O(E + V log V)?
88. `[TRADEOFF]` `{SWE Interview}` Fibonacci heap vs. binary heap for Dijkstra: when is the theoretical improvement practical?
89. `[DERIVE]` `{Competitive}` Analyze the amortized cost of LINK and CUT operations in link-cut trees.
90. `[CODE]` `{FAANG}` Implement a gap buffer (used in text editors) and analyze the amortized cost of cursor movement and insertion.
91. `[APPLY]` `{FAANG}` What is the amortized cost of a hash table resize? How does the doubling strategy achieve amortized O(1) insert?
92. `[DERIVE]` `{Research}` Show that halving on occupancy ≤ 25% (not 50%) is necessary for O(1) amortized per operation in a shrinkable hash table.
93. `[APPLY]` `{Competitive}` Use amortized analysis to bound the total number of rotations in a sequence of n insertions into a red-black tree.
94. `[CONCEPT]` `{Research}` What is the difference between amortized O(1) and expected O(1)? Give an example of each.
95. `[APPLY]` `{FAANG}` Python's `list.append()` is amortized O(1). Python's `list.insert(0, x)` is O(n). Explain the difference.
96. `[DERIVE]` `{Competitive}` Analyze the offline caching algorithm (furthest-in-future) using a potential function.
97. `[APPLY]` `{Research}` What is competitive analysis? How is it different from amortized analysis?
98. `[CONCEPT]` `{Research}` What is an online algorithm? What is its competitive ratio?
99. `[DERIVE]` `{Research}` Prove that the LRU cache replacement policy has a competitive ratio of k for a cache of size k.
100. `[CONCEPT]` `{Research}` What is the "working set" property of splay trees? How does it relate to LRU caching?

---

# PART V — Advanced Data Structures

---

## Chapters 17–19: Augmented DS, B-Trees, Disjoint Sets

**100 Questions**

### Augmenting Data Structures (Q1–Q20)

1. `[CONCEPT]` `{SWE Interview}` What is the augmentation theorem? What conditions must an augmentation satisfy to maintain O(log n) operations?
2. `[CODE]` `{FAANG}` Augment a red-black tree to support OS-RANK and OS-SELECT. What field do you add?
3. `[CODE]` `{Competitive}` Implement an interval tree. Write INTERVAL-INSERT, INTERVAL-DELETE, and INTERVAL-SEARCH.
4. `[APPLY]` `{FAANG}` Use an interval tree to find all pairs of overlapping meetings in a calendar.
5. `[APPLY]` `{FAANG}` Augment a BST to support the "count of elements less than x" query in O(log n).
6. `[CODE]` `{Competitive}` Augment a BST to support "find the k-th largest element" in O(log n).
7. `[APPLY]` `{FAANG}` How do you use an augmented BST to solve "count of inversions" in O(n log n)?
8. `[CODE]` `{Competitive}` Implement a "rank tree" (order statistics tree) from scratch.
9. `[APPLY]` `{Competitive}` How do you augment a BST to support "find successor in at most k hops" efficiently?
10. `[CODE]` `{Research}` Augment a BST with a "max" field to support "find the maximum element in a subtree rooted at x."
11. `[APPLY]` `{FAANG}` Use an augmented BST to implement a "range minimum query" structure.
12. `[CODE]` `{Competitive}` Implement a segment tree from scratch supporting range sum queries and point updates in O(log n).
13. `[CODE]` `{Competitive}` Extend the segment tree to support range updates (lazy propagation).
14. `[CODE]` `{Competitive}` Implement a Fenwick tree (Binary Indexed Tree) for prefix sum queries.
15. `[DERIVE]` `{Competitive}` Explain the bit manipulation trick in Fenwick trees: how does `i & (-i)` compute the rightmost set bit?
16. `[APPLY]` `{FAANG}` How would you use a segment tree to solve "count of range sum" queries?
17. `[CODE]` `{Competitive}` Implement a 2D segment tree (for 2D range queries).
18. `[APPLY]` `{Competitive}` Use a persistent segment tree to answer "kth smallest in subarray A[l..r]".
19. `[CODE]` `{Competitive}` Implement a merge sort tree for offline range frequency queries.
20. `[TRADEOFF]` `{SWE Interview}` Segment tree vs. Fenwick tree vs. augmented BST: when do you prefer each?

---

### B-Trees (Q21–Q50)

21. `[CONCEPT]` `{SWE Interview}` What is a B-tree? What is the minimum degree t? What does it guarantee about node size?
22. `[CONCEPT]` `{SWE Interview}` Why are B-trees used in databases and file systems instead of red-black trees?
23. `[CONCEPT]` `{SWE Interview}` What is the height of a B-tree with n keys and minimum degree t? Prove the bound.
24. `[CODE]` `{Competitive}` Write B-TREE-SEARCH. How many disk reads does it take?
25. `[CODE]` `{Competitive}` Write B-TREE-INSERT. What is the "split-child" procedure?
26. `[CODE]` `{Competitive}` Write B-TREE-DELETE. What are the three cases?
27. `[CONCEPT]` `{SWE Interview}` What is a B+ tree? How does it differ from a B-tree? Why do databases prefer B+ trees?
28. `[CONCEPT]` `{SWE Interview}` What is a leaf page in a B+ tree? How does it enable efficient range scans?
29. `[DERIVE]` `{Competitive}` How many disk reads does a B-tree search take? Compare to a red-black tree for n = 10⁹.
30. `[CONCEPT]` `{SWE Interview}` What is the "branching factor" of a B-tree? Why is it tuned to match the disk page size?
31. `[APPLY]` `{SWE Interview}` PostgreSQL uses a B+ tree for indexes. What operations does it support in O(log_t n) disk reads?
32. `[TRADEOFF]` `{SWE Interview}` B-tree vs. LSM-tree for a write-heavy database workload. What are the tradeoffs?
33. `[CONCEPT]` `{Research}` What is write amplification in a B-tree? How does a COW (copy-on-write) B-tree reduce it?
34. `[APPLY]` `{SWE Interview}` Why does MySQL InnoDB use a clustered B+ tree? What does the primary key determine?
35. `[CODE]` `{Research}` Describe the "2-3 tree" — what is it and how does it relate to B-trees with t=2?
36. `[CONCEPT]` `{Research}` What is a B*-tree? How does it improve space utilization over a B-tree?
37. `[APPLY]` `{SWE Interview}` When inserting into a full B-tree page, what two strategies exist (split vs. redistribute)?
38. `[DERIVE]` `{Competitive}` Prove that a B-tree with minimum degree t and height h has at most 2t^(h+1) - 1 nodes.
39. `[APPLY]` `{SWE Interview}` Why is the "split-on-the-way-down" insertion strategy important for B-trees?
40. `[TRADEOFF]` `{Research}` B+ tree vs. hash index for equality queries vs. range queries — which wins each?
41. `[CONCEPT]` `{Research}` What is a fractal tree index (Bε-tree)? How does it improve B-tree write performance?
42. `[APPLY]` `{SWE Interview}` How does a B-tree handle concurrent access? What is page-level locking?
43. `[CONCEPT]` `{Research}` What is the "elevator algorithm" for B-tree buffer management?
44. `[APPLY]` `{SWE Interview}` What happens to a B+ tree when a node becomes half-empty after deletion? What are the two options?
45. `[DERIVE]` `{Research}` Show that B-tree deletion maintains the minimum occupancy invariant after merging or redistributing.
46. `[CODE]` `{Competitive}` Implement a B-tree (t=2, i.e., a 2-3-4 tree) with all operations.
47. `[APPLY]` `{SWE Interview}` How does a database's buffer pool interact with B-tree pages?
48. `[TRADEOFF]` `{Research}` What is the space utilization of a B-tree? What is the expected occupancy after random insertions?
49. `[APPLY]` `{SWE Interview}` Describe the "cover index" (index-only scan) optimization in B+ tree databases.
50. `[CONCEPT]` `{Research}` What is a cache-oblivious B-tree? What problem does it solve?

---

### Disjoint Sets / Union-Find (Q51–Q100)

51. `[CONCEPT]` `{SWE Interview}` What is the Union-Find data structure? What two operations does it support?
52. `[CODE]` `{FAANG}` Implement Union-Find with union by rank and path compression.
53. `[CONCEPT]` `{SWE Interview}` What is path compression in Union-Find? How does it affect the tree structure?
54. `[CONCEPT]` `{SWE Interview}` What is union by rank? What does the rank represent? How does it bound tree height?
55. `[DERIVE]` `{Research}` Prove that union by rank alone (without path compression) gives O(log n) per operation.
56. `[DERIVE]` `{Research}` State the Tarjan bound: m operations on n elements with both heuristics costs O(m α(n)) total.
57. `[CONCEPT]` `{Research}` What is the inverse Ackermann function α(n)? Why is it effectively a constant for all practical n?
58. `[APPLY]` `{FAANG}` Use Union-Find to detect a cycle in an undirected graph. Write the algorithm.
59. `[CODE]` `{FAANG}` Use Union-Find to implement Kruskal's MST algorithm.
60. `[APPLY]` `{FAANG}` Use Union-Find to solve the "number of connected components" problem dynamically.
61. `[APPLY]` `{FAANG}` Use Union-Find to solve the "accounts merge" problem (grouping emails by account).
62. `[CODE]` `{FAANG}` Use Union-Find to solve "redundant connection" — find the edge that creates a cycle.
63. `[APPLY]` `{Competitive}` Use Union-Find to solve "number of islands II" with dynamic additions.
64. `[CODE]` `{Competitive}` Implement weighted Union-Find (DSU with rollback) to support undo operations.
65. `[APPLY]` `{Competitive}` Use Union-Find with bipartiteness checking: detect if a graph is 2-colorable during edge additions.
66. `[CODE]` `{Competitive}` Implement parallel binary search using Union-Find.
67. `[CONCEPT]` `{Research}` What is "offline Union-Find"? How do you process queries in reverse using link-cut trees?
68. `[APPLY]` `{Competitive}` Use Union-Find to solve the "minimum spanning forest" problem for a disconnected graph.
69. `[CODE]` `{Competitive}` Implement DSU on trees (small to large merging). What is its time complexity?
70. `[APPLY]` `{Competitive}` Use "DSU on trees" to answer "most frequent color in subtree" queries efficiently.
71. `[APPLY]` `{FAANG}` Use Union-Find to check if two nodes are in the same connected component after edge deletions. What modification is needed?
72. `[CONCEPT]` `{Research}` What is link-cut trees and how does it generalize Union-Find to support edge deletions?
73. `[APPLY]` `{Competitive}` Solve "Kruskal's algorithm on a dynamic graph" where edges are added and removed.
74. `[CODE]` `{Competitive}` Implement persistent Union-Find using path compression with rollback.
75. `[APPLY]` `{FAANG}` Given n people and m friendship pairs, determine if everyone is friends (directly or transitively).
76. `[APPLY]` `{Competitive}` Use Union-Find to implement Borůvka's MST algorithm. What is its complexity?
77. `[CODE]` `{Competitive}` Implement Union-Find with a "find representative" that can distinguish multiple merges.
78. `[APPLY]` `{FAANG}` Use Union-Find to solve the "largest component after adding all ones in a grid" problem.
79. `[TRADEOFF]` `{SWE Interview}` Union-Find vs. BFS/DFS for connectivity queries — when is Union-Find preferable?
80. `[APPLY]` `{Competitive}` Use Union-Find to solve "minimum cost to connect all points" (minimum spanning tree on a complete graph).
81. `[CODE]` `{Competitive}` Implement "bipartite checking" using Union-Find: maintain parity in the DSU.
82. `[APPLY]` `{FAANG}` Use Union-Find to solve "satisfiability of equality equations" (a==b, b!=c).
83. `[CODE]` `{Competitive}` Implement Union-Find with "find the sum of elements in a component".
84. `[APPLY]` `{Competitive}` Use Union-Find to solve "online minimum spanning tree" as edges arrive in random order.
85. `[APPLY]` `{FAANG}` How does Union-Find help in solving the "friend circles" (or number of provinces) problem?
86. `[CODE]` `{Competitive}` Implement Union-Find on a 2D grid. What is the key mapping from (row, col) to node index?
87. `[APPLY]` `{Competitive}` Use Union-Find to detect bridges and articulation points in an undirected graph.
88. `[APPLY]` `{Research}` How is Union-Find used in Karp's algorithm for offline LCA (Lowest Common Ancestor)?
89. `[CODE]` `{Competitive}` Implement Tarjan's offline LCA algorithm using Union-Find.
90. `[APPLY]` `{Competitive}` Use Union-Find to solve "maximum XOR of elements in a component" dynamically.
91. `[TRADEOFF]` `{Research}` Union by rank vs. union by size: do they have the same asymptotic bound?
92. `[PROVE]` `{Research}` Prove that union by rank gives trees of height at most ⌊log₂ n⌋.
93. `[APPLY]` `{FAANG}` In Kruskal's algorithm, why does Union-Find give O(E log E) total complexity?
94. `[CODE]` `{Competitive}` Implement an undo-able Union-Find (DSU with rollback using a stack).
95. `[CONCEPT]` `{Research}` What is the "link-find-cut" tree? How does it generalize union-find to support path queries?
96. `[APPLY]` `{Competitive}` Use Union-Find to build a "virtual tree" (auxiliary tree) in competitive programming.
97. `[CODE]` `{Competitive}` Implement Union-Find with weighted edges (store the difference/relation between nodes).
98. `[APPLY]` `{FAANG}` Use weighted Union-Find to solve "evaluate division" (graph of ratios a/b = k).
99. `[TRADEOFF]` `{SWE Interview}` When would you use Union-Find over a hash map for grouping?
100. `[APPLY]` `{Competitive}` Solve the "most stones removed with same row or column" problem using Union-Find.

---

# PART VI — Graph Algorithms

---

## Chapters 20–25: BFS/DFS, MST, Shortest Paths, Max Flow, Matchings

**100 Questions**

### Graph Representations & BFS/DFS (Q1–Q30)

1. `[CONCEPT]` `{SWE Interview}` What are the two standard graph representations? What are the space and time tradeoffs?
2. `[CODE]` `{FAANG}` Implement BFS. What is its time complexity? What does it guarantee about shortest paths?
3. `[CODE]` `{FAANG}` Implement DFS. What is its time complexity? What does DFS compute beyond BFS?
4. `[CONCEPT]` `{SWE Interview}` What are DFS timestamps (discovery time d[v], finish time f[v])? What do they tell you about the graph structure?
5. `[CONCEPT]` `{SWE Interview}` What are the four edge classifications in DFS: tree edge, back edge, forward edge, cross edge? Which exist in undirected graphs?
6. `[CODE]` `{FAANG}` Detect a cycle in a directed graph using DFS. What edge type signals a cycle?
7. `[CODE]` `{FAANG}` Detect a cycle in an undirected graph using DFS and BFS.
8. `[CODE]` `{FAANG}` Implement topological sort of a DAG using DFS.
9. `[PROVE]` `{Research}` Prove that a directed graph is a DAG if and only if DFS produces no back edges.
10. `[CODE]` `{FAANG}` Implement BFS to find the shortest path (fewest edges) from source to target.
11. `[CODE]` `{FAANG}` Implement BFS on a grid to find the shortest path with obstacles.
12. `[CODE]` `{Competitive}` Implement bidirectional BFS. Why does it speed up shortest path finding?
13. `[APPLY]` `{FAANG}` Use BFS to solve the "word ladder" problem (transform one word to another by changing one letter at a time).
14. `[APPLY]` `{FAANG}` Use BFS to solve the "rotten oranges" problem (multi-source BFS).
15. `[APPLY]` `{FAANG}` Use DFS/BFS to find all connected components in an undirected graph.
16. `[CODE]` `{FAANG}` Implement an iterative DFS (using an explicit stack).
17. `[CODE]` `{FAANG}` Detect if a graph is bipartite using BFS. What is the coloring argument?
18. `[CODE]` `{FAANG}` Find all strongly connected components (SCCs) using Kosaraju's algorithm.
19. `[CODE]` `{Competitive}` Find all SCCs using Tarjan's algorithm (single DFS).
20. `[PROVE]` `{Research}` Prove the correctness of Kosaraju's algorithm using finish times from DFS.
21. `[CODE]` `{FAANG}` Build the condensation DAG from the SCCs of a directed graph.
22. `[CODE]` `{Competitive}` Find all bridges and articulation points in an undirected graph using DFS.
23. `[APPLY]` `{FAANG}` Use DFS to solve the "number of islands" problem.
24. `[APPLY]` `{Competitive}` Use DFS to solve the "critical connections in a network" (finding bridges).
25. `[CODE]` `{Competitive}` Implement Euler circuit detection and construction using Hierholzer's algorithm.
26. `[APPLY]` `{Competitive}` Check if a directed graph is Eulerian. What are the necessary and sufficient conditions?
27. `[CODE]` `{Competitive}` Find the longest path in a DAG using topological sort + DP.
28. `[APPLY]` `{FAANG}` Given a course dependency graph, determine if all courses can be completed (cycle detection in a directed graph).
29. `[APPLY]` `{Competitive}` Implement a topological sort that detects cycles and outputs the order simultaneously.
30. `[TRADEOFF]` `{SWE Interview}` Adjacency list vs. adjacency matrix — when would you use a matrix despite its O(V²) space?

---

### Minimum Spanning Trees (Q31–Q50)

31. `[CONCEPT]` `{SWE Interview}` What is a minimum spanning tree? What properties does it have?
32. `[CODE]` `{FAANG}` Implement Kruskal's algorithm. What is its time complexity?
33. `[CODE]` `{FAANG}` Implement Prim's algorithm with a min-heap. What is its time complexity?
34. `[PROVE]` `{Research}` Prove the cut property: for any cut of the graph, the minimum weight edge crossing the cut is in some MST.
35. `[PROVE]` `{Research}` Prove the cycle property: the maximum weight edge in any cycle is not in any MST.
36. `[TRADEOFF]` `{SWE Interview}` Kruskal's vs. Prim's: when is each preferable based on graph density?
37. `[APPLY]` `{Competitive}` Implement Borůvka's algorithm. What is its time complexity and why is it useful for parallelism?
38. `[APPLY]` `{FAANG}` Find the second minimum spanning tree. What is an efficient algorithm?
39. `[APPLY]` `{Competitive}` Minimum spanning tree on a complete graph where edge weights are given by a function. Use geometry.
40. `[APPLY]` `{Competitive}` Find the minimum spanning forest for a disconnected graph.
41. `[APPLY]` `{Research}` What is the bottleneck spanning tree? Is the minimum bottleneck spanning tree always an MST?
42. `[CODE]` `{Competitive}` Implement the "online MST" algorithm: maintain an MST as edges are added.
43. `[APPLY]` `{Competitive}` Given an MST and a new edge, update the MST in O(n) time.
44. `[APPLY]` `{FAANG}` Minimum cost to connect all cities: reduce to MST. What is the graph construction?
45. `[APPLY]` `{Competitive}` Implement the "k-spanning tree" problem: find the MST that spans exactly k vertices.
46. `[PROVE]` `{Research}` Prove that all MSTs of a graph have the same set of edge weights (as a multiset).
47. `[APPLY]` `{Competitive}` Use MST to solve the "minimax path" problem: find the path where the maximum edge weight is minimized.
48. `[CODE]` `{Competitive}` Implement Kruskal's with rollback (for offline MST with edge deletions).
49. `[APPLY]` `{Research}` What is the expected complexity of Kruskal's on a random graph?
50. `[TRADEOFF]` `{Research}` Comparing Kruskal's, Prim's, and Borůvka's: what is the theoretical best for dense vs. sparse graphs?

---

### Shortest Paths (Q51–Q75)

51. `[CONCEPT]` `{SWE Interview}` What is the single-source shortest path problem? What algorithms solve it and under what conditions?
52. `[CODE]` `{FAANG}` Implement Dijkstra's algorithm with a binary heap. What is its time complexity?
53. `[CODE]` `{Competitive}` Implement Dijkstra's algorithm with a Fibonacci heap. What is its asymptotic improvement?
54. `[PROVE]` `{Research}` Prove Dijkstra's algorithm is correct: at the moment a node is extracted from the priority queue, its distance is final.
55. `[CONCEPT]` `{SWE Interview}` Why doesn't Dijkstra work with negative edge weights?
56. `[CODE]` `{FAANG}` Implement Bellman-Ford. What is its time complexity? How does it detect negative cycles?
57. `[PROVE]` `{Research}` Prove Bellman-Ford's correctness: after i iterations, all shortest paths using at most i edges are correct.
58. `[CODE]` `{FAANG}` Implement SPFA (Shortest Path Faster Algorithm). Is it always faster than Bellman-Ford?
59. `[CODE]` `{FAANG}` Implement Floyd-Warshall (all-pairs shortest paths). What is its time and space complexity?
60. `[PROVE]` `{Research}` Prove Floyd-Warshall's correctness using the DP formulation D^(k)[i][j].
61. `[CODE]` `{FAANG}` Implement Johnson's algorithm for all-pairs shortest paths in sparse graphs. What does it use reweighting for?
62. `[PROVE]` `{Research}` Prove that Johnson's reweighting preserves shortest paths.
63. `[APPLY]` `{FAANG}` Use Dijkstra to solve "cheapest flights within k stops."
64. `[APPLY]` `{FAANG}` Use Bellman-Ford to detect currency exchange arbitrage (negative cycle detection).
65. `[APPLY]` `{FAANG}` Use Dijkstra on a modified graph to solve "minimum cost to traverse a grid with weights."
66. `[CODE]` `{Competitive}` Implement 0-1 BFS (when edge weights are 0 or 1) using a deque.
67. `[APPLY]` `{Competitive}` Use Dijkstra with states (node, state) to solve shortest paths with conditions.
68. `[CONCEPT]` `{SWE Interview}` What is the difference between SSSP and APSP? When do you need APSP?
69. `[CODE]` `{Competitive}` Implement the shortest path in a DAG using topological sort in O(V + E).
70. `[APPLY]` `{Competitive}` Find the k-th shortest path (not just the shortest) from s to t.
71. `[CONCEPT]` `{Research}` What is a shortest path tree? How is it constructed from Dijkstra's output?
72. `[APPLY]` `{Competitive}` Use Floyd-Warshall to solve the transitive closure problem.
73. `[TRADEOFF]` `{SWE Interview}` Dijkstra vs. A*: what does A* add and when does it outperform Dijkstra?
74. `[CODE]` `{Competitive}` Implement A* search with a heuristic function h(v). What admissibility condition must h satisfy?
75. `[APPLY]` `{Competitive}` Use shortest paths to solve the "critical path method" in project scheduling.

---

### Maximum Flow & Bipartite Matching (Q76–Q100)

76. `[CONCEPT]` `{SWE Interview}` What is a flow network? What are the capacity, conservation, and skew-symmetry constraints?
77. `[CONCEPT]` `{SWE Interview}` What is the max-flow min-cut theorem? State it precisely.
78. `[CODE]` `{Competitive}` Implement the Ford-Fulkerson method for maximum flow. What is its time complexity?
79. `[CODE]` `{Competitive}` Implement the Edmonds-Karp algorithm (BFS-based augmenting paths). What is its time complexity?
80. `[CODE]` `{Competitive}` Implement Dinic's algorithm. What is its time complexity? Why is it faster than Edmonds-Karp?
81. `[PROVE]` `{Research}` Prove the max-flow min-cut theorem using the augmenting path theorem.
82. `[APPLY]` `{FAANG}` Use max-flow to solve bipartite matching. What is the graph construction?
83. `[CODE]` `{Competitive}` Implement the Hungarian algorithm for maximum weight bipartite matching.
84. `[APPLY]` `{Competitive}` Use max-flow to solve "minimum vertex cover" in a bipartite graph (König's theorem).
85. `[PROVE]` `{Research}` State and prove König's theorem: in a bipartite graph, max matching = min vertex cover.
86. `[APPLY]` `{FAANG}` Use bipartite matching to solve "task assignment to workers with skill constraints."
87. `[CODE]` `{Competitive}` Implement the stable marriage algorithm (Gale-Shapley). What is its complexity? What property does it produce?
88. `[PROVE]` `{Research}` Prove that Gale-Shapley produces a stable matching. Prove that the result is optimal for the proposing side.
89. `[APPLY]` `{Competitive}` Use max-flow to solve "minimum path cover in a DAG."
90. `[CODE]` `{Competitive}` Implement push-relabel max-flow algorithm. What is its advantage over augmenting path methods?
91. `[APPLY]` `{Competitive}` Use max-flow to solve "maximum independent set in a bipartite graph."
92. `[CODE]` `{Competitive}` Model and solve "project selection" (profit maximization with prerequisites) as a min-cut problem.
93. `[APPLY]` `{Research}` Use network flow to solve "baseball elimination": can team X still win the division?
94. `[CODE]` `{Competitive}` Implement minimum cost maximum flow (MCMF) using SPFA (successive shortest path).
95. `[APPLY]` `{Competitive}` Use MCMF to solve "minimum cost assignment" (generalization of bipartite matching with costs).
96. `[TRADEOFF]` `{Research}` Ford-Fulkerson vs. Edmonds-Karp vs. Dinic's: compare time complexity on dense vs. unit-capacity graphs.
97. `[APPLY]` `{Competitive}` Use max-flow to solve "image segmentation" (graph cuts for vision).
98. `[APPLY]` `{Research}` Model "network reliability" (probability that source-to-sink path exists after random edge failures) using flow.
99. `[CODE]` `{Competitive}` Implement Hopcroft-Karp for maximum bipartite matching in O(E √V).
100. `[APPLY]` `{Competitive}` Solve the "minimum dominating set in a tree" using greedy + matching intuitions.

---

# PART VII — Selected Topics

---

## Chapters 26–30: Parallel Algorithms, Matrix Ops, Linear Programming, Polynomials/FFT, Number Theory

**100 Questions**

### Parallel Algorithms (Q1–Q15)

1. `[CONCEPT]` `{Research}` What is the work-span model for parallel algorithms? What is work W and span S?
2. `[CONCEPT]` `{Research}` What is Brent's theorem? How does it bound the running time of a parallel algorithm?
3. `[DERIVE]` `{Research}` Derive the parallelism P = W/S. What does high parallelism mean practically?
4. `[CODE]` `{Research}` Write a parallel merge sort in the work-span model. What is its work and span?
5. `[CODE]` `{Research}` Write a parallel matrix multiplication. What is its work and span?
6. `[CONCEPT]` `{Research}` What is a parallel for-loop? How does it differ from a sequential loop in work-span analysis?
7. `[CODE]` `{Research}` Write parallel BFS. What is the challenge vs. sequential BFS?
8. `[CONCEPT]` `{Research}` What is a race condition in parallel algorithms? How does the work-span model handle it?
9. `[CODE]` `{Research}` Write the parallel prefix sum (scan) algorithm. What is its work and span?
10. `[DERIVE]` `{Research}` Derive that parallel merge (merging two sorted arrays in parallel) has span O(log² n).
11. `[CODE]` `{Research}` Write a parallel Fibonacci using memoized recursion. What span does it achieve?
12. `[CONCEPT]` `{Research}` What is the Cilk task-parallel model? How does work-stealing scheduling achieve near-optimal speedup?
13. `[APPLY]` `{Research}` Design a parallel quicksort. What is its expected work and span?
14. `[TRADEOFF]` `{Research}` Parallel merge sort vs. parallel quicksort: which has better span? Which has better cache behavior?
15. `[CONCEPT]` `{Research}` What is the "parallel depth-first" traversal of a recursion tree? How does it relate to the span?

---

### Matrix Operations (Q16–Q30)

16. `[CONCEPT]` `{Research}` What is the naïve matrix multiplication algorithm? What is its time complexity?
17. `[CODE]` `{Competitive}` Implement Strassen's algorithm for 2×2 matrix multiplication. How does it reduce multiplications from 8 to 7?
18. `[DERIVE]` `{Research}` What is the current best known exponent ω for matrix multiplication? Why is ω < 3 significant?
19. `[CODE]` `{Competitive}` Implement matrix exponentiation to compute Aⁿ in O(k³ log n) where k is the matrix dimension.
20. `[APPLY]` `{Competitive}` Use matrix exponentiation to compute the nth Fibonacci number in O(log n).
21. `[APPLY]` `{Competitive}` Use matrix exponentiation to count paths of length k in a graph.
22. `[CODE]` `{Competitive}` Implement Gaussian elimination with partial pivoting. What is its time complexity?
23. `[CODE]` `{Competitive}` Implement LU decomposition. When is it preferable to Gaussian elimination?
24. `[APPLY]` `{Research}` How does LU decomposition help in solving Ax = b for multiple b vectors?
25. `[CODE]` `{Research}` Implement computing the inverse of a matrix using Gaussian elimination.
26. `[CONCEPT]` `{Research}` What is the condition number of a matrix? How does it affect numerical stability?
27. `[CODE]` `{Research}` Implement the Gauss-Jordan method for computing matrix inverse.
28. `[APPLY]` `{Competitive}` Use matrix exponentiation to solve a linear recurrence of order k in O(k³ log n).
29. `[TRADEOFF]` `{Research}` Strassen vs. naïve multiplication for small matrices: when does the constant factor make naïve faster?
30. `[APPLY]` `{Research}` How is matrix multiplication used in computing transitive closure? What is the complexity?

---

### Linear Programming (Q31–Q45)

31. `[CONCEPT]` `{Research}` What is a linear program in standard form? What are the variables, objective, and constraints?
32. `[CONCEPT]` `{Research}` What is the feasible region of an LP? What is a vertex (basic feasible solution)?
33. `[CONCEPT]` `{SWE Interview}` What is the simplex algorithm? What does "moving to an adjacent vertex" mean geometrically?
34. `[DERIVE]` `{Research}` What is the worst-case complexity of the simplex algorithm? What is its practical performance?
35. `[CONCEPT]` `{Research}` What is the interior point method? How does it compare to simplex in theory and practice?
36. `[CONCEPT]` `{Research}` What is LP duality? State the weak and strong duality theorems.
37. `[APPLY]` `{Research}` Use LP duality to prove max-flow = min-cut.
38. `[APPLY]` `{Research}` Formulate the shortest path problem as a linear program.
39. `[APPLY]` `{Research}` Formulate the maximum flow problem as a linear program.
40. `[APPLY]` `{Research}` Formulate the maximum bipartite matching problem as an LP. Prove integrality of the solution.
41. `[CONCEPT]` `{Research}` What is an integer linear program (ILP)? Why is it NP-hard in general?
42. `[CONCEPT]` `{Research}` What is LP relaxation? How is it used in approximation algorithms?
43. `[APPLY]` `{Research}` Use LP relaxation to get a 2-approximation for vertex cover.
44. `[CONCEPT]` `{Research}` What is the complementary slackness condition in LP duality?
45. `[APPLY]` `{Research}` Use LP to formulate the minimum cost flow problem.

---

### Polynomials & FFT (Q46–Q65)

46. `[CONCEPT]` `{Competitive}` What is the DFT (Discrete Fourier Transform)? What does it compute?
47. `[CONCEPT]` `{Competitive}` What is the FFT (Fast Fourier Transform)? How does the Cooley-Tukey algorithm achieve O(n log n)?
48. `[DERIVE]` `{Competitive}` Derive the FFT recurrence: DFT_n splits into two DFT_{n/2}. Write the butterfly operation.
49. `[CODE]` `{Competitive}` Implement the recursive FFT. What is its time and space complexity?
50. `[CODE]` `{Competitive}` Implement the iterative FFT (bit-reversal permutation). Why is it preferable in practice?
51. `[APPLY]` `{Competitive}` Use FFT to multiply two polynomials in O(n log n). What are the three steps?
52. `[APPLY]` `{Competitive}` Use FFT to multiply two large integers. How does polynomial multiplication relate?
53. `[CONCEPT]` `{Competitive}` What are the nth roots of unity? How does the FFT use them?
54. `[CODE]` `{Competitive}` Implement the inverse FFT (IFFT). How does it relate to the forward FFT?
55. `[APPLY]` `{Competitive}` Use FFT to compute the convolution of two arrays in O(n log n).
56. `[APPLY]` `{Competitive}` Use FFT to solve "substring matching with wildcards" in O(n log n).
57. `[APPLY]` `{Competitive}` Use FFT to compute the number of ways to write integers as sums of two squares.
58. `[TRADEOFF]` `{Competitive}` FFT over complex numbers vs. NTT (Number Theoretic Transform) over integers mod p. When do you use NTT?
59. `[CODE]` `{Competitive}` Implement NTT (Number Theoretic Transform) for polynomial multiplication modulo a prime.
60. `[APPLY]` `{Competitive}` Use FFT/NTT to solve the "string matching with at most k mismatches" problem.
61. `[CONCEPT]` `{Research}` What is the relationship between FFT and the chirp Z-transform?
62. `[APPLY]` `{Competitive}` Compute the sum of f(i) * g(j) for all (i,j) pairs where i+j = k, for all k, using FFT.
63. `[APPLY]` `{Competitive}` Use FFT to speed up the "three-sum" problem (are there three elements summing to target?).
64. `[TRADEOFF]` `{Competitive}` When does FFT-based polynomial multiplication win over naïve O(n²) in practice?
65. `[CODE]` `{Competitive}` Implement online polynomial multiplication using FFT with half-online technique.

---

### Number Theory (Q66–Q100)

66. `[CONCEPT]` `{Competitive}` What does it mean for two integers to be coprime? What is gcd(a,b)?
67. `[CODE]` `{Competitive}` Implement Euclid's algorithm for GCD. Prove its correctness and time complexity.
68. `[DERIVE]` `{Competitive}` Prove that Euclid's algorithm terminates in O(log(min(a,b))) steps.
69. `[CODE]` `{Competitive}` Implement the extended Euclidean algorithm. What does it compute beyond gcd?
70. `[APPLY]` `{Competitive}` Use the extended Euclidean algorithm to find the modular inverse of a modulo m (when gcd(a,m)=1).
71. `[CODE]` `{Competitive}` Implement fast modular exponentiation (a^b mod m) in O(log b).
72. `[CONCEPT]` `{Competitive}` State Fermat's little theorem. How does it help compute modular inverses?
73. `[CONCEPT]` `{Competitive}` State Euler's theorem. What is Euler's totient function φ(n)?
74. `[CODE]` `{Competitive}` Implement a sieve of Eratosthenes to find all primes ≤ n. What is its time complexity?
75. `[CODE]` `{Competitive}` Implement a linear sieve (Euler's sieve). What advantage does it have over the basic sieve?
76. `[CODE]` `{Competitive}` Implement trial division for primality testing. What is its complexity?
77. `[CODE]` `{Competitive}` Implement the Miller-Rabin primality test. Is it deterministic or probabilistic?
78. `[CONCEPT]` `{Research}` What is the RSA cryptosystem? What CLRS concepts underlie its security?
79. `[DERIVE]` `{Research}` Explain RSA key generation, encryption, and decryption using modular exponentiation.
80. `[CONCEPT]` `{Research}` What is the Chinese Remainder Theorem (CRT)? State it and give an algorithm to reconstruct x from residues.
81. `[CODE]` `{Competitive}` Implement CRT to solve simultaneous congruences x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂).
82. `[APPLY]` `{Competitive}` Use CRT to compute large integer arithmetic modulo different primes and reconstruct.
83. `[CONCEPT]` `{Competitive}` What is a primitive root modulo p? How many primitive roots exist modulo a prime p?
84. `[CODE]` `{Competitive}` Find a primitive root modulo a prime p. What is the algorithm?
85. `[CONCEPT]` `{Research}` What is the discrete logarithm problem? Why is it hard and why does it underlie cryptography?
86. `[CODE]` `{Competitive}` Implement baby-step giant-step for discrete logarithm in O(√p).
87. `[CONCEPT]` `{Competitive}` What is Legendre's formula for the largest power of prime p dividing n!?
88. `[CODE]` `{Competitive}` Compute the number of trailing zeros in n! using Legendre's formula.
89. `[CODE]` `{Competitive}` Implement the Möbius function μ(n) and use Möbius inversion.
90. `[APPLY]` `{Competitive}` Use Möbius inversion to count integers ≤ n coprime to all primes in a set.
91. `[CODE]` `{Competitive}` Compute Euler's totient φ(n) for all n ≤ N using a sieve.
92. `[APPLY]` `{Competitive}` Compute the number of pairs (i,j) with 1 ≤ i ≤ j ≤ n and gcd(i,j) = 1 using the Euler totient.
93. `[CODE]` `{Competitive}` Implement Pollard's rho algorithm for integer factorization. What is its expected complexity?
94. `[CONCEPT]` `{Research}` What is the AKS primality test? What is its time complexity? Why is Miller-Rabin preferred in practice?
95. `[CODE]` `{Competitive}` Implement Lucas-Lehmer test for Mersenne primes. What form must n have?
96. `[APPLY]` `{Competitive}` Compute n! mod p for large n and prime p using Wilson's theorem and factorization.
97. `[CODE]` `{Competitive}` Implement a fast algorithm for computing C(n, k) mod p using Lucas' theorem.
98. `[APPLY]` `{Competitive}` Use Fermat's little theorem to compute a^(p-2) mod p as the modular inverse of a.
99. `[TRADEOFF]` `{Research}` Trial division vs. Miller-Rabin vs. Pollard's rho: compare for different magnitudes of n.
100. `[CODE]` `{Competitive}` Implement "linear sieve with smallest prime factor" for factorizing all numbers ≤ N in O(N).

---

# PART VIII — More Selected Topics

---

## Chapters 31–35: String Matching, ML Algorithms, NP-Completeness, Approximation

**100 Questions**

### String Matching (Q1–Q25)

1. `[CONCEPT]` `{SWE Interview}` What is the string matching problem? What is the naïve algorithm and its worst-case complexity?
2. `[CODE]` `{FAANG}` Implement the naïve string matching algorithm. What is its worst-case input?
3. `[CODE]` `{FAANG}` Implement the Rabin-Karp algorithm. What is the expected and worst-case time complexity?
4. `[CONCEPT]` `{SWE Interview}` What is a rolling hash in Rabin-Karp? How do you compute the next hash in O(1)?
5. `[CODE]` `{FAANG}` Implement the KMP (Knuth-Morris-Pratt) algorithm. What is its time complexity?
6. `[DERIVE]` `{Competitive}` Explain the failure function (π table) in KMP. How is it computed in O(m)?
7. `[PROVE]` `{Research}` Prove that KMP never revisits a character in the text. Why is its total time O(n + m)?
8. `[CODE]` `{Competitive}` Implement the Boyer-Moore algorithm. What are the bad character and good suffix heuristics?
9. `[CONCEPT]` `{SWE Interview}` What is the Z-algorithm? How does it relate to KMP?
10. `[CODE]` `{Competitive}` Implement the Z-array computation. How do you use it for string matching?
11. `[CODE]` `{Competitive}` Implement Aho-Corasick for multi-pattern string matching. What is its time complexity?
12. `[APPLY]` `{FAANG}` Use KMP to find all occurrences of pattern P in text T.
13. `[APPLY]` `{Competitive}` Use the Z-algorithm to find the shortest period of a string.
14. `[CODE]` `{Competitive}` Implement a suffix array in O(n log n) using the SA-IS or prefix doubling algorithm.
15. `[CONCEPT]` `{Research}` What is a suffix array? What is its relationship to a suffix tree?
16. `[CODE]` `{Competitive}` Build the LCP (Longest Common Prefix) array from a suffix array.
17. `[APPLY]` `{Competitive}` Use suffix array + LCP to find the longest repeated substring in O(n log n).
18. `[APPLY]` `{FAANG}` Use suffix array to count the number of distinct substrings of a string.
19. `[APPLY]` `{Competitive}` Use suffix array to find the longest common substring of two strings.
20. `[CODE]` `{Research}` Describe the construction of a suffix tree in O(n) using Ukkonen's algorithm.
21. `[APPLY]` `{Competitive}` Use a suffix tree to answer "how many times does pattern P appear in T?" in O(|P|).
22. `[APPLY]` `{Competitive}` Use suffix automaton (SAM) for all substring queries. What is its size complexity?
23. `[TRADEOFF]` `{Competitive}` Suffix array vs. suffix tree vs. suffix automaton: compare construction time, space, and supported queries.
24. `[CODE]` `{Competitive}` Implement the "minimum rotation" of a string using suffix arrays (Booth's algorithm).
25. `[APPLY]` `{FAANG}` Use polynomial hashing to check if two substrings are equal in O(1) after O(n) preprocessing.

---

### NP-Completeness (Q26–Q70)

26. `[CONCEPT]` `{SWE Interview}` What is the class P? Give three examples of problems in P.
27. `[CONCEPT]` `{SWE Interview}` What is the class NP? What does "nondeterministic polynomial time" mean?
28. `[CONCEPT]` `{SWE Interview}` What is polynomial-time verification? Give an example: the Hamiltonian cycle problem.
29. `[CONCEPT]` `{SWE Interview}` What is the P vs. NP question? Why is it the most important open problem in computer science?
30. `[CONCEPT]` `{SWE Interview}` What is NP-hardness? What is NP-completeness? What is the difference?
31. `[CONCEPT]` `{SWE Interview}` What is a polynomial-time reduction? How do you use it to prove NP-hardness?
32. `[PROVE]` `{Research}` Prove that SAT (Boolean satisfiability) is NP-complete (Cook-Levin theorem).
33. `[PROVE]` `{Research}` Prove that 3-SAT is NP-complete by reduction from SAT.
34. `[PROVE]` `{Research}` Prove that CLIQUE is NP-complete by reduction from 3-SAT.
35. `[PROVE]` `{Research}` Prove that VERTEX-COVER is NP-complete by reduction from CLIQUE.
36. `[PROVE]` `{Research}` Prove that INDEPENDENT-SET is NP-complete.
37. `[PROVE]` `{Research}` Prove that HAMILTONIAN-CYCLE is NP-complete.
38. `[PROVE]` `{Research}` Prove that TSP (Travelling Salesman Problem) is NP-complete.
39. `[PROVE]` `{Research}` Prove that SUBSET-SUM is NP-complete.
40. `[PROVE]` `{Research}` Prove that 3-COLORING is NP-complete.
41. `[CONCEPT]` `{SWE Interview}` What is the difference between a decision problem and an optimization problem in NP?
42. `[CONCEPT]` `{Research}` What does it mean for a language to be in co-NP? Is NP = co-NP?
43. `[CONCEPT]` `{Research}` What is the polynomial hierarchy? What is the second level Σ₂ᵖ?
44. `[CONCEPT]` `{SWE Interview}` What is a pseudo-polynomial time algorithm? Give an example (knapsack with dynamic programming).
45. `[CONCEPT]` `{Research}` What is a strongly NP-complete problem? Give an example. Why does pseudo-polynomial time not apply?
46. `[CONCEPT]` `{SWE Interview}` What is the significance of showing a problem is NP-complete in practice?
47. `[APPLY]` `{SWE Interview}` A client asks you to solve a problem that turns out to be NP-complete. What do you do?
48. `[CONCEPT]` `{Research}` What is the exponential time hypothesis (ETH)? What does it imply about 3-SAT?
49. `[CONCEPT]` `{Research}` What is PSPACE? What is EXPTIME? Where does NP fit in?
50. `[APPLY]` `{Research}` Prove that if P = NP, then every NP-complete problem can be solved in polynomial time.
51. `[PROVE]` `{Research}` Prove that 0/1 KNAPSACK is NP-complete by reduction from SUBSET-SUM.
52. `[PROVE]` `{Research}` Prove that INTEGER LINEAR PROGRAMMING is NP-hard.
53. `[APPLY]` `{Research}` Show that the LONGEST PATH problem (find path of length ≥ k) is NP-complete.
54. `[CONCEPT]` `{Research}` What is Karp's 21 NP-complete problems? Name five of them.
55. `[APPLY]` `{Research}` Prove that MAXIMUM CUT is NP-complete.
56. `[CONCEPT]` `{Research}` What is a parsimonious reduction? Why does it preserve the hardness of counting versions (#P)?
57. `[CONCEPT]` `{Research}` What is #P? What is #P-complete? Give an example (#PERFECT-MATCHING).
58. `[APPLY]` `{Research}` Is GRAPH ISOMORPHISM in P, NP-complete, or somewhere in between? What is known?
59. `[CONCEPT]` `{Research}` What is the class BPP (Bounded-error Probabilistic Polynomial time)?
60. `[CONCEPT]` `{Research}` What is the class ZPP (Zero-error Probabilistic Polynomial time)? How does it relate to RP and co-RP?
61. `[APPLY]` `{Research}` How does the PCP theorem relate to hardness of approximation?
62. `[CONCEPT]` `{Research}` What is an NP-hard optimization problem? Give an example where no PTAS exists (assuming P≠NP).
63. `[APPLY]` `{Research}` Prove that 3-DIMENSIONAL MATCHING is NP-complete.
64. `[CONCEPT]` `{SWE Interview}` What is the relationship between NP-completeness and cryptography?
65. `[APPLY]` `{Research}` Show that BIN PACKING is NP-complete by reduction from PARTITION.
66. `[APPLY]` `{Research}` Prove that CHROMATIC NUMBER is NP-complete.
67. `[CONCEPT]` `{Research}` What is a fixed-parameter tractable (FPT) algorithm? Give an example (vertex cover parameterized by solution size k).
68. `[APPLY]` `{Research}` Give a 2^k × n FPT algorithm for VERTEX COVER with parameter k.
69. `[CONCEPT]` `{Research}` What is the W-hierarchy? What is W[1]-hard? Give an example.
70. `[APPLY]` `{SWE Interview}` Identify whether "minimum spanning tree," "shortest path," "maximum clique," and "graph coloring" are in P or NP-complete.

---

### Approximation Algorithms (Q71–Q100)

71. `[CONCEPT]` `{SWE Interview}` What is an approximation algorithm? What is an approximation ratio (factor)?
72. `[CONCEPT]` `{Research}` What is a PTAS (polynomial-time approximation scheme)? What is an FPTAS?
73. `[CODE]` `{Competitive}` Implement the 2-approximation for VERTEX COVER using a greedy matching.
74. `[PROVE]` `{Research}` Prove that the greedy matching gives a 2-approximation for vertex cover.
75. `[CODE]` `{Competitive}` Implement the Christofides algorithm for metric TSP. What approximation ratio does it achieve?
76. `[PROVE]` `{Research}` Prove that the nearest-neighbor heuristic for TSP is not always optimal. Give a counterexample.
77. `[CODE]` `{Competitive}` Implement the greedy set cover algorithm. What is its approximation ratio?
78. `[PROVE]` `{Research}` Prove that greedy set cover achieves approximation ratio H(n) = O(log n).
79. `[CONCEPT]` `{Research}` What is the inapproximability of set cover? Can you do better than O(log n) unless P=NP?
80. `[CODE]` `{Competitive}` Implement the 2-approximation for metric TSP using MST. Prove the bound.
81. `[PROVE]` `{Research}` Prove that the MST-based 2-approximation for metric TSP is valid. What triangle inequality property do you use?
82. `[CODE]` `{Competitive}` Implement a greedy (1 - 1/e)-approximation for the maximum coverage problem.
83. `[PROVE]` `{Research}` Prove the (1 - 1/e) bound for greedy maximum coverage using the submodularity property.
84. `[CONCEPT]` `{Research}` What is a randomized approximation algorithm? Give an example (MAX-3-SAT is 7/8-approximable by random assignment).
85. `[PROVE]` `{Research}` Prove that random assignment satisfies 7/8 of all 3-SAT clauses in expectation.
86. `[CODE]` `{Competitive}` Implement a 2-approximation for bin packing (First Fit Decreasing). Prove the bound.
87. `[APPLY]` `{Research}` Design a PTAS for the Euclidean TSP. What is the key algorithmic idea?
88. `[CODE]` `{Competitive}` Implement a 3/2-approximation for metric TSP (Christofides). What matching step gives the improvement over 2?
89. `[PROVE]` `{Research}` Prove Christofides gives a 3/2-approximation. Use MST + minimum weight perfect matching on odd-degree vertices.
90. `[CONCEPT]` `{Research}` What is the LP-rounding technique for approximation? Give an example.
91. `[CODE]` `{Competitive}` Design a 2-approximation for WEIGHTED VERTEX COVER using LP rounding. Prove the bound.
92. `[APPLY]` `{Research}` Use the primal-dual method to derive an approximation algorithm for set cover.
93. `[CONCEPT]` `{Research}` What is a semi-definite programming (SDP) relaxation? How does it give a 0.878-approximation for MAX-CUT?
94. `[PROVE]` `{Research}` State the Goemans-Williamson theorem for MAX-CUT. What is the approximation ratio?
95. `[CONCEPT]` `{Research}` What is the Unique Games Conjecture (UGC)? What does it imply for inapproximability?
96. `[APPLY]` `{Research}` Assuming UGC, what is the inapproximability of VERTEX COVER?
97. `[CODE]` `{Competitive}` Design a greedy O(log n)-approximation for the weighted set cover problem.
98. `[APPLY]` `{Research}` What is the FPTAS for 0/1 knapsack? How does scaling and rounding achieve (1-ε) approximation?
99. `[TRADEOFF]` `{Research}` Compare approximation algorithms vs. exact exponential algorithms vs. heuristics for NP-hard problems in practice.
100. `[APPLY]` `{SWE Interview}` You need to solve a variant of TSP for a delivery routing problem. What practical approach would you use?

---

## Master Index — CLRS Topics by Chapter

| Chapter | Topic | Questions | Key Algorithms |
|---|---|---|---|
| 1–3 | Algorithm Analysis | Foundations Q1–Q60 | Asymptotic notation, Master Theorem |
| 4 | Divide & Conquer | Foundations Q61–Q80 | Merge sort, Strassen, max subarray |
| 5 | Probabilistic Analysis | Foundations Q81–Q100 | Hiring problem, indicator RVs |
| 6 | Heapsort | Sorting Q1–Q13 | MAX-HEAPIFY, BUILD-MAX-HEAP |
| 7 | Quicksort | Sorting Q14–Q22 | PARTITION, randomized QS |
| 8 | Linear-Time Sorting | Sorting Q51–Q70 | Counting, radix, bucket sort |
| 9 | Medians & Order Stats | Sorting Q71–Q100 | RANDOMIZED-SELECT, median of medians |
| 10 | Elementary DS | DS Q1–Q15 | Stacks, queues, linked lists |
| 11 | Hash Tables | DS Q16–Q45 | Chaining, open addressing, universal hashing |
| 12 | Binary Search Trees | DS Q46–Q70 | BST ops, treap, optimal BST |
| 13 | Red-Black Trees | DS Q71–Q100 | RB-INSERT, RB-DELETE, augmentation |
| 14 | Dynamic Programming | Adv. Design Q1–Q40 | LCS, rod cutting, matrix chain |
| 15 | Greedy Algorithms | Adv. Design Q41–Q65 | Activity selection, Huffman, matroids |
| 16 | Amortized Analysis | Adv. Design Q66–Q100 | Aggregate, accounting, potential |
| 17 | Augmenting DS | Adv. DS Q1–Q20 | Order-statistics, interval trees |
| 18 | B-Trees | Adv. DS Q21–Q50 | B-tree ops, B+ trees |
| 19 | Disjoint Sets | Adv. DS Q51–Q100 | Union-Find, path compression, rank |
| 20 | Elementary Graph Alg | Graph Q1–Q30 | BFS, DFS, SCC, topological sort |
| 21 | Minimum Spanning Trees | Graph Q31–Q50 | Kruskal, Prim, Borůvka |
| 22 | Single-Source SP | Graph Q51–Q65 | Dijkstra, Bellman-Ford, DAG SP |
| 23 | All-Pairs SP | Graph Q59–Q62, Q72 | Floyd-Warshall, Johnson's |
| 24 | Maximum Flow | Graph Q76–Q100 | Ford-Fulkerson, Dinic's, push-relabel |
| 25 | Bipartite Matching | Graph Q82–Q100 | Hopcroft-Karp, Gale-Shapley, König's |
| 26 | Parallel Algorithms | Selected Q1–Q15 | Work-span model, parallel prefix |
| 27 | Matrix Operations | Selected Q16–Q30 | Strassen, matrix exponentiation, LU |
| 28 | Linear Programming | Selected Q31–Q45 | Simplex, LP duality, LP relaxation |
| 29 | Polynomials & FFT | Selected Q46–Q65 | FFT, NTT, polynomial multiplication |
| 30 | Number Theory | Selected Q66–Q100 | GCD, RSA, Miller-Rabin, CRT |
| 31 | String Matching | More Selected Q1–Q25 | KMP, Rabin-Karp, suffix arrays |
| 32 | String Matching (cont.) | More Selected Q1–Q25 | Aho-Corasick, suffix automaton |
| 33 | ML Algorithms | (covered across sections) | Clustering, gradient descent |
| 34 | NP-Completeness | More Selected Q26–Q70 | Reductions, Cook-Levin, 21 NPC problems |
| 35 | Approximation | More Selected Q71–Q100 | Vertex cover, TSP, set cover, Christofides |

---

## Priority Study Tiers

**Tier 1 — Every FAANG interview (must know cold):**
- Asymptotic notation, Master Theorem recurrences
- Merge sort, quicksort, heapsort
- Hash tables (chaining, open addressing, load factor)
- BST operations, red-black tree properties (not full code)
- DP (LCS, LIS, edit distance, knapsack, coin change)
- Greedy (activity selection, Huffman, Dijkstra)
- BFS, DFS, topological sort, cycle detection
- Kruskal's/Prim's MST
- Dijkstra, Bellman-Ford
- P, NP, NP-complete definitions + 5 canonical examples
- Union-Find

**Tier 2 — Senior/competitive rounds:**
- Amortized analysis (aggregate, accounting, potential)
- Red-black tree rotations and fixup logic
- Advanced DP (bitmask DP, digit DP, convex hull trick)
- Max-flow, bipartite matching
- All-pairs shortest paths (Floyd-Warshall, Johnson's)
- String matching (KMP, Rabin-Karp)
- Suffix arrays
- NP-completeness proofs (3-SAT → CLIQUE → VC)
- Approximation algorithms (vertex cover, set cover, TSP)

**Tier 3 — Research/system design rounds:**
- B-trees and B+ tree internals
- Fibonacci heaps, amortized analysis of decrease-key
- FFT and polynomial multiplication
- Number theory (RSA, Miller-Rabin, CRT)
- LP duality and LP relaxation
- Parallel algorithm analysis (work-span)
- Fixed-parameter tractability
- PCP theorem and inapproximability

---

*CLRS 4th Edition — Complete Interview Question Bank*
*Total: 800+ questions across 8 major topic areas*
*Every question tagged with type (CONCEPT / DERIVE / CODE / PROVE / TRADEOFF / APPLY) and context (FAANG / Competitive / Research / SWE Interview)*
