import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Anchor {
  id: string;
  title: string;
  timestamp: string;
  timestampSeconds: number;
  description: string;
}

export interface GlobalAnchor extends Anchor {
  author: string;
  likes: number;
  dislikes: number;
}

interface Lecture {
  id: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
  isLive?: boolean;
  videoId: string;
  anchors: Anchor[];
  globalAnchors?: GlobalAnchor[];
}

interface Course {
  title: string;
  lectures: Lecture[];
  isPinned: boolean;
}

interface CourseData {
  [key: string]: Course;
}

interface CourseContextType {
  courseData: CourseData;
  toggleLectureFavorite: (courseId: string, lectureId: string) => void;
  toggleCoursePin: (courseId: string) => void;
  addCourse: (id: string, title: string, isPinned?: boolean) => void;
  updateCourse: (id: string, title: string, isPinned?: boolean) => void;
  deleteCourse: (id: string) => void;
  addLecture: (courseId: string, lecture: Omit<Lecture, 'isFavorited'> & { isFavorited?: boolean }) => void;
  updateLecture: (courseId: string, lectureId: string, updates: Partial<Lecture>) => void;
  deleteLecture: (courseId: string, lectureId: string) => void;
}

const initialCourseData: CourseData = {
  "Group 26": {
    "title": "IID Exercises",
    "lectures": [
      {
        "id": "1",
        "title": "SCAMPER",
        "date": "26.03.2025",
        "isFavorited": false,
        "videoId": "CF9jLC2unDk",
        "anchors": [],
        "hasNotification": false,
        
      },
      {
        "id": "2",
        "title": "Low-Fi",
        "date": "09.04.2025",
        "isFavorited": false,
        "videoId": "ZXWsHqZl0dM",
        "anchors": [],
        "hasNotification": false
      },
      {
        "id": "3",
        "title": "Mid-Fi",
        "date": "20.05.2025",
        "isFavorited": false,
        "videoId": "uzOrrXnX7VM",
        "anchors": [],
        "hasNotification": true
      },
      {
        "id": "4",
        "title": "Hi-Fi",
        "date": "12.06.2025",
        "isFavorited": false,
        "videoId": "-hLtZYg1-vE",
        "anchors": [],
        "hasNotification": true,
        "isLive": true
      }
    ],
    "isPinned": true
  },
  "MIT 6.006": {
    "title": "MIT: Intro to Algorithms",
    "lectures": [
      {
        "id": "1750451578957",
        "title": "1. Algorithms and Computation",
        "date": "2022-03-14",
        "videoId": "ZA-tUyM_y7s",
        "anchors": [
          {
            "id": "pa_mit_1_1",
            "title": "Peak Finding Algorithm Notes",
            "timestamp": "00:12:30",
            "timestampSeconds": 750,
            "description": "**1D Peak Finding** using binary search approach:\n\n- Start from middle element\n- Compare with neighbors\n- Recurse on half with larger neighbor\n- Time complexity: O(log n)\n\nThis is a great example of divide-and-conquer!"
          },
          {
            "id": "pa_mit_1_2",
            "title": "2D Peak Finding Challenge",
            "timestamp": "00:32:10",
            "timestampSeconds": 1930,
            "description": "**2D Peak Finding** is more complex:\n\n- Can't use simple binary search\n- Need to find a path to a peak\n- Time complexity: O(n log n)\n- Uses greedy ascent strategy\n\nNeed to practice implementing this."
          },
          {
            "id": "pa_mit_1_3",
            "title": "Algorithm Analysis Framework",
            "timestamp": "00:45:20",
            "timestampSeconds": 2720,
            "description": "**Key questions for algorithm analysis**:\n\n1. **Correctness**: Does it always find a peak?\n2. **Efficiency**: What's the time complexity?\n3. **Optimality**: Can we do better?\n\nThis framework applies to all algorithms we'll study."
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga1",
            "title": "Peak Finding Explained",
            "timestamp": "00:12:30",
            "timestampSeconds": 750,
            "description": "This is the first algorithm presented, used to illustrate different approaches to problem-solving (e.g., 1D vs. 2D versions).",
            "author": "Prof. Srini Devadas",
            "likes": 15,
            "dislikes": 0
          },
          {
            "id": "ga1_2",
            "title": "1D Peak Finding Algorithm",
            "timestamp": "00:18:45",
            "timestampSeconds": 1125,
            "description": "**Binary search approach** for finding peaks in 1D arrays. Time complexity: `O(log n)`",
            "author": "Prof. Erik Demaine",
            "likes": 28,
            "dislikes": 2
          },
          {
            "id": "ga1_3",
            "title": "2D Peak Finding Challenge",
            "timestamp": "00:32:10",
            "timestampSeconds": 1930,
            "description": "Extending peak finding to 2D arrays. More complex than 1D version but still uses divide-and-conquer.",
            "author": "Prof. Srini Devadas",
            "likes": 22,
            "dislikes": 1
          },
          {
            "id": "ga1_4",
            "title": "Algorithm Analysis",
            "timestamp": "00:45:20",
            "timestampSeconds": 2720,
            "description": "Detailed analysis of time complexity and correctness proofs for peak finding algorithms.",
            "author": "Prof. Erik Demaine",
            "likes": 19,
            "dislikes": 3
          },
          {
            "id": "ga1_5",
            "title": "Real-world Applications",
            "timestamp": "00:52:15",
            "timestampSeconds": 3135,
            "description": "Examples of where peak finding is used in practice: image processing, signal analysis, and optimization problems.",
            "author": "Prof. Srini Devadas",
            "likes": 31,
            "dislikes": 0
          }
        ]
      },
      {
        "id": "1750451619309",
        "title": " 2. Data Structures and Dynamic Arrays ",
        "date": "2022-03-21",
        "videoId": "CHhwJjR0mZA",
        "anchors": [
          {
            "id": "pa1",
            "title": "My Confusion Point",
            "timestamp": "00:35:10",
            "timestampSeconds": 2110,
            "description": "I need to review the concept of **amortized analysis**. It's a bit tricky. Maybe I can find some extra resources on this.\n\n- [ ] Read Chapter X of CLRS.\n- [ ] Watch a tutorial on YouTube."
          },
          {
            "id": "pa_mit_2_2",
            "title": "Dynamic Array Implementation",
            "timestamp": "00:25:00",
            "timestampSeconds": 1500,
            "description": "**Dynamic array resizing strategy**:\n\n- Start with capacity 1\n- When full, double the capacity\n- Copy all elements to new array\n- Amortized cost: O(1) per insertion\n\nThis is used in Python lists, Java ArrayList, etc."
          },
          {
            "id": "pa_mit_2_3",
            "title": "Amortized Analysis Deep Dive",
            "timestamp": "00:42:30",
            "timestampSeconds": 2550,
            "description": "**Aggregate method** for amortized analysis:\n\nTotal cost = n insertions + resize costs\n= n + (1 + 2 + 4 + ... + 2^⌊log₂n⌋)\n= n + O(n) = O(n)\n\nTherefore, amortized cost = O(n)/n = O(1)"
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga3",
            "title": "Dynamic Arrays",
            "timestamp": "00:25:00",
            "timestampSeconds": 1500,
            "description": "Explanation of how dynamic arrays work, including resizing strategy. Key takeaway: doubling the size leads to *O(1) amortized* time per insertion.\n\n`Cost = 1 + 1 + ... + 1 + k` (for k-th insertion that triggers resize)",
            "author": "Prof. Srini Devadas",
            "likes": 20,
            "dislikes": 0
          },
          {
            "id": "ga3_2",
            "title": "Amortized Analysis",
            "timestamp": "00:35:10",
            "timestampSeconds": 2110,
            "description": "**Aggregate method** for analyzing amortized cost. Total cost divided by number of operations.",
            "author": "Prof. Erik Demaine",
            "likes": 25,
            "dislikes": 1
          },
          {
            "id": "ga3_3",
            "title": "Resizing Strategies",
            "timestamp": "00:42:30",
            "timestampSeconds": 2550,
            "description": "Different strategies for resizing arrays: doubling vs. additive growth. Trade-offs between space and time efficiency.",
            "author": "Prof. Srini Devadas",
            "likes": 18,
            "dislikes": 2
          },
          {
            "id": "ga3_4",
            "title": "Memory Management",
            "timestamp": "00:48:15",
            "timestampSeconds": 2895,
            "description": "How dynamic arrays handle memory allocation and deallocation. Important for understanding performance characteristics.",
            "author": "Prof. Erik Demaine",
            "likes": 16,
            "dislikes": 1
          },
          {
            "id": "ga3_5",
            "title": "Implementation Details",
            "timestamp": "00:55:20",
            "timestampSeconds": 3320,
            "description": "Code examples and implementation considerations for dynamic arrays in different programming languages.",
            "author": "Prof. Srini Devadas",
            "likes": 23,
            "dislikes": 0
          }
        ]
      },
      {
        "id": "1750451689227",
        "title": " 3. Sets and Sorting ",
        "date": "2022-03-28",
        "videoId": "oS9aPzUNG-s",
        "anchors": [
          {
            "id": "pa_mit_3_1",
            "title": "Merge Sort Implementation",
            "timestamp": "00:15:00",
            "timestampSeconds": 900,
            "description": "**Merge Sort pseudocode**:\n\n```\nfunction mergeSort(A):\n    if len(A) ≤ 1: return A\n    mid = len(A) // 2\n    left = mergeSort(A[:mid])\n    right = mergeSort(A[mid:])\n    return merge(left, right)\n```\n\nTime complexity: O(n log n), Space: O(n)"
          },
          {
            "id": "pa_mit_3_2",
            "title": "Divide and Conquer Pattern",
            "timestamp": "00:22:30",
            "timestampSeconds": 1350,
            "description": "**Divide and conquer** general pattern:\n\n1. **Divide**: Split problem into subproblems\n2. **Conquer**: Solve subproblems recursively\n3. **Combine**: Merge solutions\n\nExamples: merge sort, quick sort, binary search, FFT"
          },
          {
            "id": "pa_mit_3_3",
            "title": "Stability in Sorting",
            "timestamp": "00:41:20",
            "timestampSeconds": 2480,
            "description": "**Stable sorting** preserves relative order of equal elements.\n\nMerge sort is stable, quick sort is not.\n\nThis matters when sorting by multiple criteria:\n- Sort by last name, then first name\n- Equal last names should maintain first name order"
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga5",
            "title": "Merge Sort",
            "timestamp": "00:15:00",
            "timestampSeconds": 900,
            "description": "### Merge Sort Algorithm\nAn efficient, comparison-based, stable sorting algorithm.\n\n**Time Complexity:** `O(n log n)`",
            "author": "Prof. Erik Demaine",
            "likes": 18,
            "dislikes": 2
          },
          {
            "id": "ga5_2",
            "title": "Divide and Conquer",
            "timestamp": "00:22:30",
            "timestampSeconds": 1350,
            "description": "**Divide and conquer** paradigm applied to sorting. Split, conquer, and combine approach.",
            "author": "Prof. Srini Devadas",
            "likes": 24,
            "dislikes": 1
          },
          {
            "id": "ga5_3",
            "title": "Recursion Tree Analysis",
            "timestamp": "00:28:45",
            "timestampSeconds": 1725,
            "description": "Visualizing merge sort's recursion tree to understand the `O(n log n)` time complexity.",
            "author": "Prof. Erik Demaine",
            "likes": 20,
            "dislikes": 0
          },
          {
            "id": "ga5_4",
            "title": "In-place vs. Extra Space",
            "timestamp": "00:35:10",
            "timestampSeconds": 2110,
            "description": "Discussion of space complexity trade-offs in sorting algorithms. Merge sort requires extra space.",
            "author": "Prof. Srini Devadas",
            "likes": 17,
            "dislikes": 2
          },
          {
            "id": "ga5_5",
            "title": "Stability in Sorting",
            "timestamp": "00:41:20",
            "timestampSeconds": 2480,
            "description": "Why merge sort is **stable** and why this property matters in real-world applications.",
            "author": "Prof. Erik Demaine",
            "likes": 19,
            "dislikes": 1
          }
        ]
      },
      {
        "id": "1750451747108",
        "title": " 4. Hashing ",
        "date": "2022-04-04",
        "videoId": "Nu8YGneFCWE",
        "anchors": [
          {
            "id": "pa_mit_4_1",
            "title": "Hash Function Properties",
            "timestamp": "00:15:30",
            "timestampSeconds": 930,
            "description": "**Good hash function properties**:\n\n1. **Uniform distribution**: keys spread evenly\n2. **Fast computation**: O(1) hash computation\n3. **Minimal collisions**: few keys hash to same value\n\nExample: h(x) = x mod m (for integer keys)"
          },
          {
            "id": "pa_mit_4_2",
            "title": "Collision Resolution Methods",
            "timestamp": "00:40:10",
            "timestampSeconds": 2410,
            "description": "**Two main approaches**:\n\n1. **Chaining**: linked list at each bucket\n   - Simple, handles any number of collisions\n   - Extra space for pointers\n\n2. **Open addressing**: find next available slot\n   - Linear probing, quadratic probing, double hashing\n   - No extra space, but clustering issues"
          },
          {
            "id": "pa_mit_4_3",
            "title": "Load Factor and Performance",
            "timestamp": "00:25:45",
            "timestampSeconds": 1545,
            "description": "**Load factor α = n/m** (n items, m buckets):\n\n- α < 0.5: good performance\n- α > 0.8: performance degrades\n- α = 1: table is full\n\n**Expected search time**:\n- Successful: O(1 + α)\n- Unsuccessful: O(1 + α²)"
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga6",
            "title": "Collision Resolution",
            "timestamp": "00:40:10",
            "timestampSeconds": 2410,
            "description": "Discussion on handling hash collisions using:\n1. Chaining\n2. Open Addressing",
            "author": "Prof. Srini Devadas",
            "likes": 22,
            "dislikes": 0
          },
          {
            "id": "ga6_2",
            "title": "Hash Functions",
            "timestamp": "00:15:30",
            "timestampSeconds": 930,
            "description": "**Properties of good hash functions**: uniform distribution, fast computation, and minimal collisions.",
            "author": "Prof. Erik Demaine",
            "likes": 26,
            "dislikes": 1
          },
          {
            "id": "ga6_3",
            "title": "Load Factor",
            "timestamp": "00:25:45",
            "timestampSeconds": 1545,
            "description": "Understanding load factor `α = n/m` and its impact on hash table performance.",
            "author": "Prof. Srini Devadas",
            "likes": 21,
            "dislikes": 0
          },
          {
            "id": "ga6_4",
            "title": "Linear Probing",
            "timestamp": "00:48:20",
            "timestampSeconds": 2900,
            "description": "**Linear probing** as a collision resolution method. Simple but can lead to clustering.",
            "author": "Prof. Erik Demaine",
            "likes": 19,
            "dislikes": 2
          },
          {
            "id": "ga6_5",
            "title": "Double Hashing",
            "timestamp": "00:52:10",
            "timestampSeconds": 3130,
            "description": "**Double hashing** technique to reduce clustering in open addressing schemes.",
            "author": "Prof. Srini Devadas",
            "likes": 18,
            "dislikes": 1
          }
        ]
      }
    ],
    "isPinned": true
  },
  "MIT 18.650": {
    "title": "Statistics for Applications",
    "lectures": [
      {
        "id": "1750451910660",
        "title": " 1. Introduction to Statistics",
        "date": "2016-10-06",
        "videoId": "VPZD_aij8H0",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750451950102",
        "title": " 2. Introduction to Statistics (cont.)",
        "date": "2016-10-13",
        "videoId": "C_W1adH-NVE",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750451995041",
        "title": " 3. Parametric Inference",
        "date": "2016-10-20",
        "videoId": "TSkDZbGS94k",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750452072140",
        "title": " 4. Parametric Inference (cont.) and Maximum Likelihood Estimation",
        "date": "2016-10-27",
        "videoId": "rLlZpnT02ZU",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750452112063",
        "title": " 5. Maximum Likelihood Estimation (cont.)",
        "date": "2016-11-03",
        "videoId": "0Va2dOLqUfM",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750452145748",
        "title": " 6. Maximum Likelihood Estimation (cont.) and the Method of Moments ",
        "date": "2016-11-10",
        "videoId": "JTbZP0yt9qc",
        "anchors": [],
        "isFavorited": false
      }
    ],
    "isPinned": false
  },
  "MIT Kanji": {
    "title": "Kanji in Tobira",
    "lectures": [
      {
        "id": "1750455244003",
        "title": "Kanji in Tobira Lesson 1",
        "date": "2023-03-15",
        "videoId": "_FtXi0_ZMvk",
        "anchors": [
          {
            "id": "pa_kanji_1_1",
            "title": "Basic Stroke Order Rules",
            "timestamp": "00:05:30",
            "timestampSeconds": 330,
            "description": "**Essential stroke order rules for Kanji**:\n\n1. **Top to bottom** - Start from the top\n2. **Left to right** - Horizontal strokes first\n3. **Outside to inside** - Enclose components first\n4. **Center before sides** - Middle strokes first\n\nPractice these rules consistently!"
          },
          {
            "id": "pa_kanji_1_2",
            "title": "Radical Recognition",
            "timestamp": "00:12:15",
            "timestampSeconds": 735,
            "description": "**Key radicals in Lesson 1**:\n\n- **人 (person)** - appears in 休, 体, 作\n- **口 (mouth)** - appears in 国, 回, 図\n- **日 (sun/day)** - appears in 時, 明, 晴\n\nUnderstanding radicals helps with memorization."
          },
          {
            "id": "pa_kanji_1_3",
            "title": "Vocabulary Building",
            "timestamp": "00:18:45",
            "timestampSeconds": 1125,
            "description": "**New vocabulary from this lesson**:\n\n- [休む (やすむ)](https://jisho.org/word/休む) - to rest\n- [時間 (じかん)](https://jisho.org/word/時間) - time\n- [国 (くに)](https://jisho.org/word/国) - country\n\nPractice reading these in context."
          }
        ],
        "isFavorited": false,
        "globalAnchors": [
          {
            "id": "ga_kanji_1_1",
            "title": "Introduction to Kanji",
            "timestamp": "00:02:00",
            "timestampSeconds": 120,
            "description": "Welcome to the Kanji learning journey! This lesson covers fundamental stroke order and basic radicals.",
            "author": "Prof. Tanaka",
            "likes": 45,
            "dislikes": 2
          },
          {
            "id": "ga_kanji_1_2",
            "title": "Stroke Order Fundamentals",
            "timestamp": "00:05:30",
            "timestampSeconds": 330,
            "description": "**Mastering stroke order** is crucial for proper Kanji writing. These rules apply to all Kanji characters.",
            "author": "Prof. Tanaka",
            "likes": 38,
            "dislikes": 1
          },
          {
            "id": "ga_kanji_1_3",
            "title": "Radical System",
            "timestamp": "00:12:15",
            "timestampSeconds": 735,
            "description": "Understanding the **radical system** is key to Kanji mastery. Radicals are building blocks that appear in multiple characters.",
            "author": "Prof. Tanaka",
            "likes": 42,
            "dislikes": 0
          }
        ]
      },
      {
        "id": "1750455277947",
        "title": "Kanji in Tobira Lesson 2",
        "date": "2023-03-15",
        "videoId": "zZlD3c_1PLg",
        "anchors": [
          {
            "id": "pa_kanji_2_1",
            "title": "Compound Kanji Words",
            "timestamp": "00:07:20",
            "timestampSeconds": 440,
            "description": "**Compound words (熟語)** combine multiple Kanji:\n\n- **学校 (がっこう)** = school (学 + 校)\n- **学生 (がくせい)** = student (学 + 生)\n- **先生 (せんせい)** = teacher (先 + 生)\n\nThese are very common in Japanese."
          },
          {
            "id": "pa_kanji_2_2",
            "title": "On-yomi vs Kun-yomi",
            "timestamp": "00:14:10",
            "timestampSeconds": 850,
            "description": "**Two reading systems**:\n\n1. **On-yomi (音読み)** - Chinese-derived readings\n   - Used in compound words\n   - Example: 学 (がく)\n\n2. **Kun-yomi (訓読み)** - Japanese readings\n   - Used when Kanji stands alone\n   - Example: 学ぶ (まなぶ)"
          },
          {
            "id": "pa_kanji_2_3",
            "title": "Writing Practice Tips",
            "timestamp": "00:22:30",
            "timestampSeconds": 1350,
            "description": "**Effective practice methods**:\n\n- [ ] Write each Kanji 10 times\n- [ ] Use [Kanji Study](https://kanjistudy.com) app\n- [ ] Practice with [Anki](https://apps.ankiweb.net/) flashcards\n- [ ] Read simple texts daily\n\nConsistency is key!"
          }
        ],
        "isFavorited": false,
        "globalAnchors": [
          {
            "id": "ga_kanji_2_1",
            "title": "Reading Systems",
            "timestamp": "00:14:10",
            "timestampSeconds": 850,
            "description": "Understanding **On-yomi and Kun-yomi** is essential for proper Kanji pronunciation and usage.",
            "author": "Prof. Tanaka",
            "likes": 52,
            "dislikes": 3
          },
          {
            "id": "ga_kanji_2_2",
            "title": "Compound Words",
            "timestamp": "00:07:20",
            "timestampSeconds": 440,
            "description": "**Compound Kanji words** are the foundation of Japanese vocabulary. Most words use 2-4 Kanji characters.",
            "author": "Prof. Tanaka",
            "likes": 48,
            "dislikes": 1
          },
          {
            "id": "ga_kanji_2_3",
            "title": "Study Resources",
            "timestamp": "00:22:30",
            "timestampSeconds": 1350,
            "description": "Recommended tools and resources for effective Kanji study and practice.",
            "author": "Prof. Tanaka",
            "likes": 39,
            "dislikes": 2
          }
        ]
      },
      {
        "id": "1750455334798",
        "title": "Kanji in Tobira Lesson 3",
        "date": "2023-03-22",
        "videoId": "3N1A14hQjZA",
        "hasNotification": true,
        "anchors": [
          {
            "id": "pa_kanji_3_1",
            "title": "Advanced Radicals",
            "timestamp": "00:06:45",
            "timestampSeconds": 405,
            "description": "**Complex radicals in this lesson**:\n\n- **心 (heart)** - appears in 思, 想, 感\n- **手 (hand)** - appears in 持, 打, 投\n- **足 (foot)** - appears in 走, 起, 足\n\nThese radicals often indicate meaning."
          },
          {
            "id": "pa_kanji_3_2",
            "title": "Context Clues",
            "timestamp": "00:15:20",
            "timestampSeconds": 920,
            "description": "**Using context to guess Kanji**:\n\n1. **Look at surrounding words**\n2. **Consider the topic**\n3. **Use radical hints**\n4. **Check sentence structure**\n\nThis skill improves with practice!"
          },
          {
            "id": "pa_kanji_3_3",
            "title": "Common Mistakes",
            "timestamp": "00:24:10",
            "timestampSeconds": 1450,
            "description": "**Avoid these common errors**:\n\n- ❌ Confusing similar radicals (日 vs 目)\n- ❌ Wrong stroke order\n- ❌ Mixing up readings\n- ❌ Forgetting context\n\n[More tips here](https://www.tofugu.com/kanji/common-mistakes/)"
          }
        ],
        "isFavorited": false,

        "globalAnchors": [
          {
            "id": "ga_kanji_3_1",
            "title": "Advanced Radicals",
            "timestamp": "00:06:45",
            "timestampSeconds": 405,
            "description": "**Complex radicals** that appear in multiple Kanji characters. Understanding these helps with memorization and meaning inference.",
            "author": "Prof. Tanaka",
            "likes": 41,
            "dislikes": 1
          },
          {
            "id": "ga_kanji_3_2",
            "title": "Context Learning",
            "timestamp": "00:15:20",
            "timestampSeconds": 920,
            "description": "**Context-based learning** strategies for understanding Kanji in real-world situations.",
            "author": "Prof. Tanaka",
            "likes": 47,
            "dislikes": 2,
          },
          {
            "id": "ga_kanji_3_3",
            "title": "Error Prevention",
            "timestamp": "00:24:10",
            "timestampSeconds": 1450,
            "description": "Common mistakes students make when learning Kanji and how to avoid them.",
            "author": "Prof. Tanaka",
            "likes": 44,
            "dislikes": 0,
            
          }
        ]
      },
      {
        "id": "1750455389117",
        "title": "Kanji in Tobira Lesson 4",
        "date": "2023-03-22",
        "videoId": "TxKzqbpLi0Y",
        "isLive": true,
        "hasNotification": true,
        "anchors": [
          {
            "id": "pa_kanji_4_1",
            "title": "JLPT N4 Kanji",
            "timestamp": "00:08:15",
            "timestampSeconds": 495,
            "description": "**JLPT N4 level Kanji covered**:\n\n- **生活 (せいかつ)** - lifestyle\n- **仕事 (しごと)** - work\n- **家族 (かぞく)** - family\n- **友達 (ともだち)** - friend\n\nThese are essential for daily conversation."
          },
          {
            "id": "pa_kanji_4_2",
            "title": "Memory Techniques",
            "timestamp": "00:16:30",
            "timestampSeconds": 990,
            "description": "**Effective memorization strategies**:\n\n1. **Story method** - Create stories for complex Kanji\n2. **Component analysis** - Break down into parts\n3. **Spaced repetition** - Use apps like [WaniKani](https://www.wanikani.com/)\n4. **Writing practice** - Muscle memory helps\n\nFind what works for you!"
          },
          {
            "id": "pa_kanji_4_3",
            "title": "Reading Practice",
            "timestamp": "00:25:45",
            "timestampSeconds": 1545,
            "description": "**Reading materials for practice**:\n\n- [NHK Easy News](https://www3.nhk.or.jp/news/easy/)\n- [Tadoku Graded Readers](https://tadoku.org/japanese/en/)\n- [Manga with furigana](https://www.mangareader.net/)\n- [Japanese children's books](https://www.amazon.com/Japanese-Childrens-Books/s?k=Japanese+Childrens+Books)\n\nStart with simple texts and gradually increase difficulty."
          }
        ],
        "isFavorited": false,
        "globalAnchors": [
          {
            "id": "ga_kanji_4_1",
            "title": "JLPT Preparation",
            "timestamp": "00:08:15",
            "timestampSeconds": 495,
            "description": "**JLPT N4 Kanji** preparation. These characters are essential for the Japanese Language Proficiency Test.",
            "author": "Prof. Tanaka",
            "likes": 56,
            "dislikes": 1
          },
          {
            "id": "ga_kanji_4_2",
            "title": "Memory Techniques",
            "timestamp": "00:16:30",
            "timestampSeconds": 990,
            "description": "**Proven memorization techniques** for learning and retaining Kanji characters effectively.",
            "author": "Prof. Tanaka",
            "likes": 49,
            "dislikes": 2
          },
          {
            "id": "ga_kanji_4_3",
            "title": "Reading Resources",
            "timestamp": "00:25:45",
            "timestampSeconds": 1545,
            "description": "**Recommended reading materials** for practicing Kanji in context and improving overall Japanese skills.",
            "author": "Prof. Tanaka",
            "likes": 43,
            "dislikes": 1
          }
        ]
      }
    ],
    "isPinned": true
  },
  "MIT 9.14": {
    "title": "Brain Structure and Its Origins",
    "lectures": [
      {
        "id": "1750455531852",
        "title": "brain orientation, primitive cellular activities",
        "date": "2020-11-06",
        "videoId": "Qn7WPvap3Zo",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750455560106",
        "title": "methods and primitive cellular activities",
        "date": "2020-11-13",
        "videoId": "Z_pkmDx_eI4",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750455591098",
        "title": "Steps to the CNS of chordates, part 1",
        "date": "2020-11-20",
        "videoId": "kr8Hn8y3sEg",
        "anchors": [],
        "isFavorited": false
      },
      {
        "id": "1750455612931",
        "title": "Steps to the CNS of chordates, part 2",
        "date": "2020-11-27",
        "videoId": "spjZiKkKnmM",
        "anchors": [],
        "isFavorited": false
      }
    ],
    "isPinned": false
  }
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courseData, setCourseData] = useState<CourseData>(initialCourseData);

  const toggleLectureFavorite = (courseId: string, lectureId: string) => {
    setCourseData(prevData => {
      const course = prevData[courseId];
      if (!course) return prevData;

      const updatedLectures = course.lectures.map(lecture => {
        if (lecture.id === lectureId) {
          return { ...lecture, isFavorited: !lecture.isFavorited };
        }
        return lecture;
      });

      const newData = {
        ...prevData,
        [courseId]: {
          ...course,
          lectures: updatedLectures
        }
      };

      console.log('Toggling favorite:', { courseId, lectureId, newData });
      return newData;
    });
  };

  const toggleCoursePin = (courseId: string) => {
    setCourseData(prevData => {
      const course = prevData[courseId];
      if (!course) return prevData;

      const newData = {
        ...prevData,
        [courseId]: {
          ...course,
          isPinned: !course.isPinned
        }
      };

      console.log('Toggling course pin:', { courseId, newData });
      return newData;
    });
  };

  const addCourse = (id: string, title: string, isPinned: boolean = false) => {
    setCourseData(prev => ({
      ...prev,
      [id]: { title, lectures: [], isPinned }
    }));
  };

  const updateCourse = (id: string, title: string, isPinned?: boolean) => {
    setCourseData(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          title: title ?? prev[id].title,
          isPinned: isPinned !== undefined ? isPinned : prev[id].isPinned
        }
      };
    });
  };

  const deleteCourse = (id: string) => {
    setCourseData(prev => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const addLecture = (courseId: string, lecture: Omit<Lecture, 'isFavorited'> & { isFavorited?: boolean }) => {
    setCourseData(prev => {
      const course = prev[courseId];
      if (!course) return prev;
      return {
        ...prev,
        [courseId]: {
          ...course,
          lectures: [
            ...course.lectures,
            { ...lecture, isFavorited: lecture.isFavorited ?? false, anchors: lecture.anchors ?? [], videoId: lecture.videoId ?? "" }
          ]
        }
      };
    });
  };

  const updateLecture = (courseId: string, lectureId: string, updates: Partial<Lecture>) => {
    setCourseData(prev => {
      const course = prev[courseId];
      if (!course) return prev;
      return {
        ...prev,
        [courseId]: {
          ...course,
          lectures: course.lectures.map(l =>
            l.id === lectureId ? { ...l, ...updates } : l
          )
        }
      };
    });
  };

  const deleteLecture = (courseId: string, lectureId: string) => {
    setCourseData(prev => {
      const course = prev[courseId];
      if (!course) return prev;
      return {
        ...prev,
        [courseId]: {
          ...course,
          lectures: course.lectures.filter(l => l.id !== lectureId)
        }
      };
    });
  };

  return (
    <CourseContext.Provider value={{
      courseData,
      toggleLectureFavorite,
      toggleCoursePin,
      addCourse,
      updateCourse,
      deleteCourse,
      addLecture,
      updateLecture,
      deleteLecture
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}; 