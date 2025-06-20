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
  "Group.26": {
    "title": "IID Exercises",
    "lectures": [
      {
        "id": "1",
        "title": "SCAMPER",
        "date": "26.03.2025",
        "isFavorited": false,
        "videoId": "CF9jLC2unDk",
        "anchors": [],
        "hasNotification": true
      },
      {
        "id": "2",
        "title": "Low-Fi",
        "date": "09.04.2025",
        "isFavorited": false,
        "videoId": "ZXWsHqZl0dM",
        "anchors": [],
        "hasNotification": true
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
        "hasNotification": true
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
  "Stanford CS336": {
    "title": "Language Modeling from Scratch",
    "lectures": [
      {
        "id": "1750452729033",
        "title": "1: Overview and Tokenization",
        "date": "2025-05-07",
        "videoId": "SQ3fZ1sAqXI",
        "anchors": [
          {
            "id": "pa_cs336_1_1",
            "title": "Tokenization Confusion",
            "timestamp": "00:15:30",
            "timestampSeconds": 930,
            "description": "Need to understand the difference between **BPE** and **WordPiece** tokenization. The examples are helpful but I should practice this.\n\n- [ ] Implement basic BPE\n- [ ] Compare with WordPiece\n- [ ] Read the original papers"
          },
          {
            "id": "pa_cs336_1_2",
            "title": "Vocabulary Size Trade-offs",
            "timestamp": "00:28:45",
            "timestampSeconds": 1725,
            "description": "Interesting discussion on vocabulary size vs. sequence length trade-offs. Larger vocab = shorter sequences but more parameters.\n\n**Key insight:** There's a sweet spot around 50k tokens."
          },
          {
            "id": "pa_cs336_1_3",
            "title": "Subword Tokenization Benefits",
            "timestamp": "00:42:10",
            "timestampSeconds": 2530,
            "description": "Subword tokenization handles out-of-vocabulary words better than word-level. This is crucial for multilingual models.\n\nExamples:\n- 'unhappiness' → ['un', 'happi', 'ness']\n- 'preprocessing' → ['pre', 'process', 'ing']"
          }
        ],
        "isFavorited": false,
        "hasNotification": true
      },
      {
        "id": "1750452763841",
        "title": " 2: Pytorch, Resource Accounting",
        "date": "2025-07-14",
        "videoId": "msHyYioAyNE",
        "anchors": [
          {
            "id": "pa_cs336_2_1",
            "title": "Memory Management Tips",
            "timestamp": "00:12:20",
            "timestampSeconds": 740,
            "description": "Important memory management techniques:\n\n1. **Gradient checkpointing** - trade compute for memory\n2. **Mixed precision** - use fp16 to save memory\n3. **Gradient accumulation** - simulate larger batch sizes\n\nNeed to implement these in my projects."
          },
          {
            "id": "pa_cs336_2_2",
            "title": "FLOPs Calculation",
            "timestamp": "00:25:15",
            "timestampSeconds": 1515,
            "description": "**FLOPs = 2 × parameters × sequence_length**\n\nThis is a useful rule of thumb for estimating computational requirements. For GPT-3 175B:\n- 175B parameters\n- 2048 sequence length\n- ~716 TFLOPs per forward pass!"
          },
          {
            "id": "pa_cs336_2_3",
            "title": "PyTorch Profiling",
            "timestamp": "00:38:30",
            "timestampSeconds": 2310,
            "description": "Use `torch.profiler` to identify bottlenecks:\n\n```python\nwith torch.profiler.profile() as prof:\n    model(input)\nprint(prof.key_averages().table())\n```\n\nThis will help optimize my training pipeline."
          }
        ],
        "isFavorited": false,
        "hasNotification": true
      },
      {
        "id": "1750452834347",
        "title": "3: Architectures, Hyperparameters",
        "date": "2025-05-21",
        "videoId": "ptFiH_bHnJw",
        "anchors": [
          {
            "id": "pa_cs336_3_1",
            "title": "Attention Mechanism Deep Dive",
            "timestamp": "00:18:45",
            "timestampSeconds": 1125,
            "description": "**Multi-head attention** allows the model to focus on different parts of the input simultaneously.\n\nKey parameters:\n- `num_heads`: typically 8-16\n- `head_dim`: usually 64-128\n- `d_model`: embedding dimension"
          },
          {
            "id": "pa_cs336_3_2",
            "title": "Learning Rate Scheduling",
            "timestamp": "00:32:10",
            "timestampSeconds": 1930,
            "description": "**Cosine annealing** with warmup is the standard for transformer training:\n\n1. Linear warmup for first 10% of steps\n2. Cosine decay to 10% of max LR\n3. Helps with convergence and final performance"
          },
          {
            "id": "pa_cs336_3_3",
            "title": "Model Size Scaling",
            "timestamp": "00:45:20",
            "timestampSeconds": 2720,
            "description": "**Chinchilla scaling laws**: optimal model size depends on compute budget.\n\nFor a given compute budget C:\n- Optimal parameters: ~C^0.5\n- Optimal tokens: ~C^0.5\n\nThis explains why smaller models trained longer often perform better."
          }
        ],
        "isFavorited": false,
        "hasNotification": true
      },
      {
        "id": "1750452861200",
        "title": "4: Mixture of experts",
        "date": "2025-05-28",
        "videoId": "LPv1KfUXLCo",
        "anchors": [
          {
            "id": "pa_cs336_4_1",
            "title": "MoE Architecture",
            "timestamp": "00:14:30",
            "timestampSeconds": 870,
            "description": "**Mixture of Experts** uses multiple expert networks with a gating mechanism.\n\nBenefits:\n- Scales model capacity without proportional compute increase\n- Each expert can specialize in different patterns\n- Gating learns to route inputs appropriately"
          },
          {
            "id": "pa_cs336_4_2",
            "title": "Load Balancing",
            "timestamp": "00:28:15",
            "timestampSeconds": 1695,
            "description": "**Load balancing** is crucial for MoE training. Without it, some experts get overused while others are underutilized.\n\nTechniques:\n- Auxiliary loss to encourage uniform expert usage\n- Noisy gating to explore different experts\n- Expert diversity regularization"
          },
          {
            "id": "pa_cs336_4_3",
            "title": "Sparsity Benefits",
            "timestamp": "00:41:45",
            "timestampSeconds": 2505,
            "description": "MoE enables **conditional computation** - only activate a subset of experts per token.\n\nThis allows for:\n- Much larger models (e.g., GLaM 1.2T parameters)\n- Faster inference (only compute active experts)\n- Better efficiency than dense models"
          }
        ],
        "isFavorited": false,
        "hasNotification": true
      }
    ],
    "isPinned": false
  },
  "Stanford CS224W": {
    "title": "Machine Learning with Graphs",
    "lectures": [
      {
        "id": "1750453009453",
        "title": "1.1 - Why Graphs",
        "date": "2021-04-13",
        "videoId": "JAB_plj2rbA",
        "anchors": [
          {
            "id": "pa_cs224w_1_1",
            "title": "Graph Representation Notes",
            "timestamp": "00:03:15",
            "timestampSeconds": 495,
            "description": "**Adjacency matrix** vs **adjacency list**:\n\n- Matrix: O(V²) space, O(1) edge lookup\n- List: O(E) space, O(degree) edge lookup\n\nFor sparse graphs, adjacency list is much more efficient."
          },
          {
            "id": "pa_cs224w_1_2",
            "title": "Real-world Graph Examples",
            "timestamp": "00:08:30",
            "timestampSeconds": 750,
            "description": "Examples of real-world graphs:\n\n1. **Social networks**: Facebook friends, Twitter followers\n2. **Biological networks**: protein interactions, gene regulation\n3. **Knowledge graphs**: Wikipedia links, entity relationships\n4. **Transportation**: road networks, flight routes"
          },
          {
            "id": "pa_cs224w_1_3",
            "title": "Graph Properties to Remember",
            "timestamp": "00:10:45",
            "timestampSeconds": 1125,
            "description": "Key graph properties:\n\n- **Degree distribution**: often follows power law\n- **Clustering coefficient**: measures local connectivity\n- **Path length**: average shortest path between nodes\n- **Diameter**: longest shortest path\n\nThese properties help characterize different types of networks."
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga2",
            "title": "Course Overview",
            "timestamp": "00:01:50",
            "timestampSeconds": 110,
            "description": "Jure Leskovec gives an overview of the course topics, including structure of graphs, graph analysis, and graph neural networks.",
            "author": "Jure Leskovec",
            "likes": 25,
            "dislikes": 1
          },
          {
            "id": "ga2_2",
            "title": "Graph Representation",
            "timestamp": "00:08:15",
            "timestampSeconds": 495,
            "description": "**Adjacency matrix** vs **adjacency list** representations. Trade-offs between space and time complexity.",
            "author": "Jure Leskovec",
            "likes": 32,
            "dislikes": 0
          },
          {
            "id": "ga2_3",
            "title": "Types of Graphs",
            "timestamp": "00:10:30",
            "timestampSeconds": 750,
            "description": "Directed vs undirected graphs, weighted vs unweighted, and their applications in different domains.",
            "author": "Jure Leskovec",
            "likes": 28,
            "dislikes": 1
          },

        ]
      },
      {
        "id": "1750453084777",
        "title": "1.2 - Applications of Graph ML",
        "date": "2021-04-20",
        "videoId": "aBHC6xzx9YI",
        "anchors": [
          {
            "id": "pa_cs224w_2_1",
            "title": "Drug Discovery Applications",
            "timestamp": "00:15:45",
            "timestampSeconds": 945,
            "description": "**Molecular property prediction** using graph neural networks:\n\n- Represent molecules as graphs (atoms = nodes, bonds = edges)\n- Predict properties like toxicity, solubility, binding affinity\n- Much better than traditional molecular fingerprints\n\nThis could revolutionize drug discovery!"
          },
          {
            "id": "pa_cs224w_2_2",
            "title": "Social Network Analysis",
            "timestamp": "00:08:30",
            "timestampSeconds": 510,
            "description": "**Friend recommendations** and **influence maximization**:\n\n- Use graph structure to predict missing edges\n- Identify influential nodes for viral marketing\n- Community detection for targeted advertising\n\nFacebook and Twitter use these techniques extensively."
          },
          {
            "id": "pa_cs224w_2_3",
            "title": "Knowledge Graph Completion",
            "timestamp": "00:22:10",
            "timestampSeconds": 1330,
            "description": "**Entity linking** and **relation extraction**:\n\n- Fill in missing facts in knowledge bases\n- Link entities across different datasets\n- Extract relationships from text\n\nUsed by Google, Amazon, and other tech companies."
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga4",
            "title": "Real-world Applications",
            "timestamp": "00:03:15",
            "timestampSeconds": 195,
            "description": "This section covers exciting applications of Graph ML:\n\n* **Drug discovery:** Finding new molecules.\n* **Social networks:** Recommender systems.\n* **Physics:** Simulating particle interactions.",
            "author": "Jure Leskovec",
            "likes": 30,
            "dislikes": 0
          },
          {
            "id": "ga4_2",
            "title": "Social Network Analysis",
            "timestamp": "00:08:30",
            "timestampSeconds": 510,
            "description": "**Friend recommendations**, **influence maximization**, and **community detection** in social networks.",
            "author": "Jure Leskovec",
            "likes": 35,
            "dislikes": 1
          },
          {
            "id": "ga4_3",
            "title": "Biological Networks",
            "timestamp": "00:15:45",
            "timestampSeconds": 945,
            "description": "Protein-protein interaction networks, gene regulatory networks, and metabolic pathways.",
            "author": "Jure Leskovec",
            "likes": 29,
            "dislikes": 0
          },
          {
            "id": "ga4_4",
            "title": "Knowledge Graphs",
            "timestamp": "00:22:10",
            "timestampSeconds": 1330,
            "description": "**Entity linking**, **relation extraction**, and **knowledge base completion** using graph methods.",
            "author": "Jure Leskovec",
            "likes": 27,
            "dislikes": 1
          },
          {
            "id": "ga4_5",
            "title": "Computer Vision",
            "timestamp": "00:28:20",
            "timestampSeconds": 1700,
            "description": "Scene graphs, object detection, and image understanding through graph representations.",
            "author": "Jure Leskovec",
            "likes": 31,
            "dislikes": 0
          }
        ]
      },
      {
        "id": "1750453143274",
        "title": "2.1 - Traditional Feature-based Methods: Node",
        "date": "2021-04-27",
        "videoId": "3IS7UhNMQ3U",
        "anchors": [
          {
            "id": "pa_cs224w_3_1",
            "title": "Centrality Measures Comparison",
            "timestamp": "00:25:15",
            "timestampSeconds": 1515,
            "description": "**Degree centrality** vs **betweenness centrality** vs **closeness centrality**:\n\n- **Degree**: counts direct connections (simple but effective)\n- **Betweenness**: measures control over information flow\n- **Closeness**: measures accessibility to the network\n\nEach captures different aspects of node importance."
          },
          {
            "id": "pa_cs224w_3_2",
            "title": "Eigenvector Centrality Intuition",
            "timestamp": "00:45:10",
            "timestampSeconds": 2710,
            "description": "**Eigenvector centrality** considers not just your connections, but the importance of your connections.\n\nIt's like saying: \"You're important if you're connected to important people.\"\n\nThis is why celebrities have high eigenvector centrality even with fewer direct connections."
          },
          {
            "id": "pa_cs224w_3_3",
            "title": "Computational Complexity",
            "timestamp": "00:32:40",
            "timestampSeconds": 1960,
            "description": "**Computational costs** of different centrality measures:\n\n- Degree centrality: O(E) - just count edges\n- Closeness centrality: O(VE) - need shortest paths\n- Betweenness centrality: O(V²E) - very expensive!\n- Eigenvector centrality: O(V³) - matrix operations\n\nFor large graphs, we need approximations."
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga7",
            "title": "Node Centrality",
            "timestamp": "00:22:30",
            "timestampSeconds": 1350,
            "description": "Covers different node centrality measures:\n\n- **Degree Centrality**\n- **Betweenness Centrality**\n- **Closeness Centrality**",
            "author": "Jure Leskovec",
            "likes": 40,
            "dislikes": 0
          },
          {
            "id": "ga7_2",
            "title": "Degree Centrality",
            "timestamp": "00:25:15",
            "timestampSeconds": 1515,
            "description": "**Degree centrality** = number of neighbors. Simple but effective measure of node importance.",
            "author": "Jure Leskovec",
            "likes": 33,
            "dislikes": 1
          },
          {
            "id": "ga7_3",
            "title": "Betweenness Centrality",
            "timestamp": "00:32:40",
            "timestampSeconds": 1960,
            "description": "**Betweenness centrality** measures how often a node appears on shortest paths between other nodes.",
            "author": "Jure Leskovec",
            "likes": 28,
            "dislikes": 2
          },
          {
            "id": "ga7_4",
            "title": "Closeness Centrality",
            "timestamp": "00:38:20",
            "timestampSeconds": 2300,
            "description": "**Closeness centrality** = inverse of average distance to all other nodes. Measures accessibility.",
            "author": "Jure Leskovec",
            "likes": 25,
            "dislikes": 1
          },
          {
            "id": "ga7_5",
            "title": "Eigenvector Centrality",
            "timestamp": "00:45:10",
            "timestampSeconds": 2710,
            "description": "**Eigenvector centrality** considers not just direct connections but also the centrality of neighbors.",
            "author": "Jure Leskovec",
            "likes": 30,
            "dislikes": 0
          }
        ]
      },
      {
        "id": "1750453279206",
        "title": "2.2 - Traditional Feature-based Methods: Graph",
        "date": "2021-05-04",
        "videoId": "buzsHTa4Hgs",
        "anchors": [
          {
            "id": "pa_cs224w_4_1",
            "title": "Graphlets for Graph Classification",
            "timestamp": "00:10:00",
            "timestampSeconds": 600,
            "description": "**Graphlets** are small induced subgraphs that serve as building blocks.\n\nCommon graphlets:\n- 3-node: triangle, path\n- 4-node: square, star, claw\n\nCounting graphlets gives a fingerprint of the graph structure, useful for classification."
          },
          {
            "id": "pa_cs224w_4_2",
            "title": "Kernel Methods for Graphs",
            "timestamp": "00:22:45",
            "timestampSeconds": 1365,
            "description": "**Graph kernels** measure similarity between graphs:\n\n- **Random walk kernels**: count common random walks\n- **Weisfeiler-Lehman kernels**: iterative node relabeling\n- **Graphlet kernels**: count common subgraphs\n\nThese enable SVM and other kernel methods on graphs."
          },
          {
            "id": "pa_cs224w_4_3",
            "title": "Limitations of Traditional Methods",
            "timestamp": "00:35:20",
            "timestampSeconds": 2120,
            "description": "**Why traditional methods fail**:\n\n1. **Hand-crafted features** don't capture complex patterns\n2. **No learning** - features are fixed\n3. **Poor generalization** to unseen graph structures\n4. **Scalability issues** - expensive to compute\n\nThis motivates the need for **graph neural networks**!"
          }
        ],
        "isFavorited": false,
        "hasNotification": true,
        "globalAnchors": [
          {
            "id": "ga8",
            "title": "Graphlets",
            "timestamp": "00:10:00",
            "timestampSeconds": 600,
            "description": "Using graphlets (small induced subgraphs) as features for graphs. This is useful for graph classification tasks.",
            "author": "Jure Leskovec",
            "likes": 35,
            "dislikes": 1
          },
          {
            "id": "ga8_2",
            "title": "Graph-level Features",
            "timestamp": "00:15:30",
            "timestampSeconds": 930,
            "description": "**Global features** like number of nodes, edges, diameter, and clustering coefficient.",
            "author": "Jure Leskovec",
            "likes": 29,
            "dislikes": 0
          },
          {
            "id": "ga8_3",
            "title": "Kernel Methods",
            "timestamp": "00:22:45",
            "timestampSeconds": 1365,
            "description": "**Graph kernels** for measuring similarity between graphs. Examples: random walk kernels, Weisfeiler-Lehman kernels.",
            "author": "Jure Leskovec",
            "likes": 26,
            "dislikes": 2
          },
          {
            "id": "ga8_4",
            "title": "Bag of Nodes",
            "timestamp": "00:28:10",
            "timestampSeconds": 1690,
            "description": "**Bag of nodes** approach: treat graph as a collection of node features, ignoring structure.",
            "author": "Jure Leskovec",
            "likes": 24,
            "dislikes": 1
          },
          {
            "id": "ga8_5",
            "title": "Limitations",
            "timestamp": "00:35:20",
            "timestampSeconds": 2120,
            "description": "**Limitations of traditional methods**: they don't capture complex structural patterns and relationships.",
            "author": "Jure Leskovec",
            "likes": 22,
            "dislikes": 0
          }
        ]
      }
    ],
    "isPinned": true
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