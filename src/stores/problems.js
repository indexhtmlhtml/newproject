import { defineStore } from 'pinia'

// 预设的算法题目
const PRESET_ALGORITHM_PROBLEMS = [
  {
    id: '1',
    title: '两数之和',
    difficulty: 'easy',
    content: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: '因为 nums[0] + nums[1] = 2 + 7 = 9，所以返回 [0, 1]。'
      }
    ],
    acceptanceRate: 75.5
  },
  {
    id: '2',
    title: '反转链表',
    difficulty: 'easy',
    content: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      }
    ],
    acceptanceRate: 82.3
  },
  {
    id: '3',
    title: '合并两个有序链表',
    difficulty: 'easy',
    content: '将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。',
    examples: [
      {
        input: 'l1 = [1,2,4], l2 = [1,3,4]',
        output: '[1,1,2,3,4,4]'
      }
    ],
    acceptanceRate: 78.9
  },
  {
    id: '4',
    title: '最长回文子串',
    difficulty: 'medium',
    content: '给你一个字符串 s，找到 s 中最长的回文子串。如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。',
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" 同样是符合题意的答案。'
      }
    ],
    acceptanceRate: 65.4
  },
  {
    id: '5',
    title: '二叉树的层序遍历',
    difficulty: 'medium',
    content: '给你二叉树的根节点 root ，返回其节点值的层序遍历。（即逐层地，从左到右访问所有节点）。',
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '[[3],[9,20],[15,7]]'
      }
    ],
    acceptanceRate: 70.2
  },
  {
    id: '6',
    title: '有效的括号',
    difficulty: 'easy',
    content: '给定一个只包括 \'(\', \')\', \'{\', \'}\', \'[\', \']\' 的字符串 s ，判断字符串是否有效。有效字符串需满足：1. 左括号必须用相同类型的右括号闭合。2. 左括号必须以正确的顺序闭合。3. 每个右括号都有一个对应的左括号。',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    acceptanceRate: 72.8
  },
  {
    id: '7',
    title: '最大子数组和',
    difficulty: 'medium',
    content: '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。子数组是数组中的一个连续部分。',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: '连续子数组 [4,-1,2,1] 的和最大，为 6。'
      }
    ],
    acceptanceRate: 68.5
  },
  {
    id: '8',
    title: '二叉树的最大深度',
    difficulty: 'easy',
    content: '给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。说明: 叶子节点是指没有子节点的节点。',
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3',
        explanation: '该二叉树的最大深度为 3，路径为：根节点 (3) -> 20 -> 7 或 15。'
      }
    ],
    acceptanceRate: 80.1
  },
  {
    id: '9',
    title: '合并区间',
    difficulty: 'medium',
    content: '给出一个区间的集合，请合并所有重叠的区间。每个区间用一个数组表示，数组的第一个数字是起始位置，第二个数字是结束位置。',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: '区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6]。'
      }
    ],
    acceptanceRate: 63.2
  },
  {
    id: '10',
    title: '单词搜索',
    difficulty: 'medium',
    content: '给定一个 m x n 的字符网格 board 和一个字符串单词 word。如果 word 存在于网格中，返回 true；否则，返回 false。单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中"相邻"单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。',
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
        explanation: '可以从 A 开始，经过 B、C、C、E、D 找到单词 "ABCCED"。'
      }
    ],
    acceptanceRate: 58.7
  },
  {
    id: '11',
    title: '岛屿数量',
    difficulty: 'medium',
    content: '给你一个由 \'1\'（陆地）和 \'0\'（水）组成的的二维网格，请你计算网格中岛屿的数量。岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。',
    examples: [
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3',
        explanation: '有三个岛屿，分别由左上、中间和右下的陆地组成。'
      }
    ],
    acceptanceRate: 61.5
  },
  {
    id: '12',
    title: '最长递增子序列',
    difficulty: 'medium',
    content: '给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。',
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: '最长递增子序列是 [2,3,7,101]，因此长度为 4。'
      }
    ],
    acceptanceRate: 55.8
  },
  {
    id: '13',
    title: '字符串解码',
    difficulty: 'medium',
    content: '给定一个经过编码的字符串，返回它解码后的字符串。编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。',
    examples: [
      {
        input: 's = "3[a]2[bc]"',
        output: '"aaabcbc"',
        explanation: '解码过程：3[a] = aaa，2[bc] = bcbc，最终结果为 aaabcbc'
      }
    ],
    acceptanceRate: 58.2
  },
  {
    id: '14',
    title: '打家劫舍',
    difficulty: 'medium',
    content: '你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下，一夜之内能够偷窃到的最高金额。',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: '偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。偷窃到的最高金额 = 1 + 3 = 4。'
      }
    ],
    acceptanceRate: 64.3
  },
  {
    id: '15',
    title: '课程表',
    difficulty: 'medium',
    content: '你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1。在选修某些课程之前需要一些先修课程。先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则必须先学习课程 bi。请你判断是否可能完成所有课程的学习？',
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: '总共有 2 门课程。学习课程 1 之前，你需要完成课程 0。这是可能的。'
      }
    ],
    acceptanceRate: 56.7
  },
  {
    id: '16',
    title: '实现红黑树',
    difficulty: 'hard',
    content: '实现一个红黑树数据结构，包括：1. 插入操作；2. 删除操作；3. 旋转平衡；4. 颜色调整。要求保证树的所有性质：根节点为黑色，红节点的子节点为黑色，每条路径黑节点数量相同等。',
    examples: [
      {
        input: '依次插入节点：7, 3, 18, 10, 22, 8, 11, 26, 2, 6',
        output: '平衡的红黑树结构',
        explanation: '需要通过旋转和重新着色来维持红黑树的性质。'
      }
    ],
    acceptanceRate: 41.2
  },
  {
    id: '17',
    title: 'LRU缓存实现',
    difficulty: 'medium',
    content: '设计并实现一个LRU（最近最少使用）缓存机制。要求：1. 在O(1)时间内完成get和put操作；2. 当缓存达到上限时，删除最久未使用的项目；3. 使用双向链表和哈希表实现。',
    examples: [
      {
        input: 'LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1);',
        output: '返回1，表示key=1的值',
        explanation: '需要在访问时更新节点位置，确保最近使用的在前面。'
      }
    ],
    acceptanceRate: 55.6
  },
  {
    id: '18',
    title: '字典树实现',
    difficulty: 'medium',
    content: '实现一个字典树（Trie），支持以下操作：1. 插入单词；2. 查找单词；3. 查找前缀；4. 统计单词数量；5. 实现通配符匹配。',
    examples: [
      {
        input: '插入单词：["apple", "app", "april"]，查找前缀"app"',
        output: '找到2个匹配的单词',
        explanation: '需要高效地存储和查找字符串前缀。'
      }
    ],
    acceptanceRate: 59.8
  },
  {
    id: '19',
    title: '图的最短路径',
    difficulty: 'hard',
    content: '实现Dijkstra算法求解带权图的最短路径。要求：1. 支持有向图和无向图；2. 处理负权边的情况；3. 输出完整的路径；4. 优化算法性能。',
    examples: [
      {
        input: '图的邻接矩阵表示，起点和终点',
        output: '最短路径的长度和具体路径',
        explanation: '需要使用优先队列优化算法性能。'
      }
    ],
    acceptanceRate: 47.3
  },
  {
    id: '20',
    title: '线段树实现',
    difficulty: 'hard',
    content: '实现一个线段树，支持区间查询和修改操作：1. 区间和查询；2. 区间最值查询；3. 单点修改；4. 区间修改（懒惰标记）。',
    examples: [
      {
        input: '数组[1,3,5,7,9,11]，查询区间[2,4]的和',
        output: '返回区间和：21',
        explanation: '需要高效处理区间查询和修改操作。'
      }
    ],
    acceptanceRate: 44.5
  },
  {
    id: '21',
    title: 'A*寻路算法',
    difficulty: 'hard',
    content: '实现A*寻路算法，用于在网格地图中找到最短路径。要求：1. 实现启发式函数；2. 处理对角线移动；3. 支持不同的代价函数；4. 优化搜索效率。',
    examples: [
      {
        input: '网格地图，起点(0,0)，终点(9,9)，包含障碍物',
        output: '最优路径坐标序列',
        explanation: '需要考虑启发式估计和实际代价的平衡。'
      }
    ],
    acceptanceRate: 43.5
  },
  {
    id: '22',
    title: 'B+树实现',
    difficulty: 'hard',
    content: '实现一个B+树数据结构，用于数据库索引。要求：1. 插入和删除操作；2. 节点分裂和合并；3. 范围查询支持；4. 磁盘IO优化。',
    examples: [
      {
        input: '连续插入数据：[3,8,12,45,23,67,9,14]',
        output: '平衡的B+树结构',
        explanation: '需要维护树的平衡和叶子节点的链接。'
      }
    ],
    acceptanceRate: 41.8
  },
  {
    id: '23',
    title: '跳表实现',
    difficulty: 'medium',
    content: '实现跳表(Skip List)数据结构。要求：1. 插入和删除操作；2. 随机层数生成；3. 快速查找；4. 空间优化。',
    examples: [
      {
        input: '插入序列：[1,4,6,8,12,15,19]',
        output: '多层链表结构',
        explanation: '需要实现概率型数据结构的特性。'
      }
    ],
    acceptanceRate: 54.2
  },
  {
    id: '24',
    title: '最小生成树算法',
    difficulty: 'medium',
    content: '实现Kruskal和Prim算法求解最小生成树。要求：1. 并查集实现；2. 堆优化；3. 处理无连通图；4. 性能对比。',
    examples: [
      {
        input: '带权无向图的邻接矩阵表示',
        output: '最小生成树的边集合',
        explanation: '需要比较两种算法的适用场景。'
      }
    ],
    acceptanceRate: 57.6
  },
  {
    id: '25',
    title: '字符串匹配算法',
    difficulty: 'medium',
    content: '实现KMP和Boyer-Moore字符串匹配算法。要求：1. 构建部分匹配表；2. 实现坏字符规则；3. 处理多模式匹配；4. 性能优化。',
    examples: [
      {
        input: '文本串："ABABCABABABC"，模式串："ABABC"',
        output: '所有匹配位置：[0,7]',
        explanation: '需要实现高效的字符串搜索。'
      }
    ],
    acceptanceRate: 56.3
  }
]

// 预设的数据库题目
const PRESET_DATABASE_PROBLEMS = [
  {
    id: 'db1',
    title: '组合两个表',
    difficulty: 'easy',
    content: '表1: Person\n' +
      'personId 是该表主键\n' +
      '+----------+----------+\n' +
      '| personId | name     |\n' +
      '+----------+----------+\n' +
      '表2: Address\n' +
      'addressId 是该表主键\n' +
      '+----------+----------+----------+\n' +
      '| addressId| personId | city     |\n' +
      '+----------+----------+----------+\n' +
      '编写一个SQL查询来报告 Person 表中每个人的姓名和城市。如果某人的地址不在 Address 表中，则报告为空 null。',
    examples: [
      {
        input: '输入：\nPerson表:\n+----------+----------+\n| personId | name     |\n+----------+----------+\n| 1        | 王伟     |\n| 2        | 李娜     |\n+----------+----------+\nAddress表:\n+----------+----------+----------+\n| addressId| personId | city     |\n+----------+----------+----------+\n| 1        | 2        | 上海     |\n+----------+----------+----------+',
        output: '+----------+----------+\n| name     | city     |\n+----------+----------+\n| 王伟     | null     |\n| 李娜     | 上海     |\n+----------+----------+',
        explanation: '王伟的地址不在Address表中，所以城市为null。'
      }
    ],
    acceptanceRate: 78.5
  },
  {
    id: 'db2',
    title: '部门工资最高的员工',
    difficulty: 'medium',
    content: '表: Employee\n' +
      '+-------------+----------+\n' +
      '| 列名        | 类型     |\n' +
      '+-------------+----------+\n' +
      '| id          | int      |\n' +
      '| name        | varchar  |\n' +
      '| salary      | int      |\n' +
      '| departmentId| int      |\n' +
      '+-------------+----------+\n' +
      'id是此表的主键。\n' +
      'departmentId是Department表中id的外键。\n' +
      '此表的每一行都表示员工的id、姓名、工资和所在部门的id。\n\n' +
      '表: Department\n' +
      '+-------------+----------+\n' +
      '| 列名        | 类型     |\n' +
      '+-------------+----------+\n' +
      '| id          | int      |\n' +
      '| name        | varchar  |\n' +
      '+-------------+----------+\n' +
      'id是此表的主键。\n' +
      '此表的每一行都表示一个部门的id及其名称。\n\n' +
      '编写SQL查询以查找每个部门中薪资最高的员工。',
    examples: [
      {
        input: 'Employee 表:\n+----+-------+--------+--------------+\n| id | name  | salary | departmentId |\n+----+-------+--------+--------------+\n| 1  | 张三  | 4000   | 1            |\n| 2  | 李四  | 3000   | 1            |\n| 3  | 王五  | 3500   | 2            |\n+----+-------+--------+--------------+\n\nDepartment 表:\n+----+-------+\n| id | name  |\n+----+-------+\n| 1  | IT    |\n| 2  | 销售  |\n+----+-------+',
        output: '+------------+----------+--------+\n| Department | Employee | Salary |\n+------------+----------+--------+\n| IT         | 张三     | 4000   |\n| 销售       | 王五     | 3500   |\n+------------+----------+--------+'
      }
    ],
    acceptanceRate: 65.2
  },
  {
    id: 'db3',
    title: '连续出现的数字',
    difficulty: 'medium',
    content: '表：Logs\n\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| num         | varchar |\n+-------------+---------+\nid 是这个表的主键。\n\n编写一个 SQL 查询，查找所有至少连续出现三次的数字。',
    examples: [
      {
        input: 'Logs 表:\n+----+-----+\n| Id | Num |\n+----+-----+\n| 1  | 1   |\n| 2  | 1   |\n| 3  | 1   |\n| 4  | 2   |\n| 5  | 1   |\n| 6  | 2   |\n| 7  | 2   |\n+----+-----+',
        output: '+-----------------+\n| ConsecutiveNums |\n+-----------------+\n| 1               |\n+-----------------+',
        explanation: '1 是唯一连续出现至少三次的数字。'
      }
    ],
    acceptanceRate: 58.9
  },
  {
    id: 'db4',
    title: '交换工资',
    difficulty: 'easy',
    content: '表: Salary\n\n+-------------+----------+\n| Column Name | Type     |\n+-------------+----------+\n| id          | int      |\n| name        | varchar  |\n| sex         | ENUM     |\n| salary      | int      |\n+-------------+----------+\nid 是这个表的主键。\nsex 这一列的值是 ENUM 类型，只能从 (\'m\',\'f\') 中取。\n该表包含公司雇员的信息。\n\n请你编写一个 SQL 查询来交换所有的 \'f\' 和 \'m\' （即，将所有 \'f\' 变为 \'m\' ，将所有 \'m\' 变为 \'f\' ）。',
    examples: [
      {
        input: 'Salary 表:\n+----+------+-----+--------+\n| id | name | sex | salary |\n+----+------+-----+--------+\n| 1  | A    | m   | 2500   |\n| 2  | B    | f   | 1500   |\n| 3  | C    | m   | 5500   |\n| 4  | D    | f   | 500    |\n+----+------+-----+--------+',
        output: '+----+------+-----+--------+\n| id | name | sex | salary |\n+----+------+-----+--------+\n| 1  | A    | f   | 2500   |\n| 2  | B    | m   | 1500   |\n| 3  | C    | f   | 5500   |\n| 4  | D    | m   | 500    |\n+----+------+-----+--------+'
      }
    ],
    acceptanceRate: 76.3
  },
  {
    id: 'db5',
    title: '超过经理收入的员工',
    difficulty: 'easy',
    content: '表：Employee\n\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| name        | varchar |\n| salary      | int     |\n| managerId   | int     |\n+-------------+---------+\nid 是该表的主键。\n该表的每一行都表示雇员的ID、姓名、工资和经理的ID。\n\n编写一个SQL查询来查找收入比经理高的员工。',
    examples: [
      {
        input: 'Employee 表:\n+----+-------+--------+-----------+\n| id | name  | salary | managerId |\n+----+-------+--------+-----------+\n| 1  | Joe   | 70000  | 3         |\n| 2  | Henry | 80000  | 4         |\n| 3  | Sam   | 60000  | Null      |\n| 4  | Max   | 90000  | Null      |\n+----+-------+--------+-----------+',
        output: '+----------+\n| Employee |\n+----------+\n| Joe      |\n+----------+',
        explanation: 'Joe 是唯一收入比经理高的员工。'
      }
    ],
    acceptanceRate: 74.8
  },
  {
    id: 'db6',
    title: '分组聚合查询',
    difficulty: 'medium',
    content: '编写SQL查询，实现复杂的分组聚合统计。要求：1. 多表关联；2. 多级分组；3. 聚合函数使用；4. HAVING子句过滤；5. 结果排序。',
    examples: [
      {
        input: '销售订单表和商品表，按照月份和商品类别统计销售额',
        output: '包含月份、类别、销售额的统计结果',
        explanation: '需要正确使用GROUP BY和聚合函数。'
      }
    ],
    acceptanceRate: 57.8
  },
  {
    id: 'db7',
    title: '递归查询实现',
    difficulty: 'hard',
    content: '使用SQL实现递归查询，解决以下问题：1. 查询组织架构树；2. 计算累计路径；3. 处理环形引用；4. 控制递归深度。',
    examples: [
      {
        input: '员工表包含employee_id和manager_id',
        output: '显示完整的组织架构层级关系',
        explanation: '需要使用WITH RECURSIVE子句。'
      }
    ],
    acceptanceRate: 48.9
  },
  {
    id: 'db8',
    title: '高级索引优化',
    difficulty: 'hard',
    content: '设计并优化复杂查询的索引策略。要求：1. 联合索引设计；2. 覆盖索引使用；3. 索引条件下推；4. 执行计划分析。',
    examples: [
      {
        input: '包含多表关联和复杂条件的查询',
        output: '优化后的索引方案和执行计划',
        explanation: '需要平衡查询性能和维护成本。'
      }
    ],
    acceptanceRate: 46.7
  },
  {
    id: 'db9',
    title: '分区表设计',
    difficulty: 'medium',
    content: '实现数据库分区策略。要求：1. 范围分区；2. 列表分区；3. 复合分区；4. 分区维护操作。',
    examples: [
      {
        input: '大规模历史订单表的分区方案',
        output: '基于时间和地区的分区策略',
        explanation: '需要考虑数据分布和查询特点。'
      }
    ],
    acceptanceRate: 58.4
  },
  {
    id: 'db10',
    title: '数据库备份恢复',
    difficulty: 'medium',
    content: '设计数据库备份和恢复方案。要求：1. 全量备份；2. 增量备份；3. 时间点恢复；4. 并行备份策略。',
    examples: [
      {
        input: '生产环境数据库的备份需求',
        output: '完整的备份恢复解决方案',
        explanation: '需要保证数据安全和恢复效率。'
      }
    ],
    acceptanceRate: 59.1
  }
]

// 预设的计算机网络题目
const PRESET_NETWORK_PROBLEMS = [
  {
    id: 'net1',
    title: 'TCP三次握手过程分析',
    difficulty: 'medium',
    content: '请详细分析TCP三次握手的完整过程。包括：1. 每一次握手的具体内容和目的；2. 相关TCP标志位的变化；3. 序列号和确认号的变化规律。',
    examples: [
      {
        input: '客户端想要与服务器建立TCP连接',
        output: '成功建立TCP连接',
        explanation: '需要详细说明SYN、ACK等标志位的变化，以及序列号的初始化和递增过程。'
      }
    ],
    acceptanceRate: 65.8
  },
  {
    id: 'net2',
    title: 'IP地址子网划分',
    difficulty: 'medium',
    content: '给定一个IP地址192.168.1.0/24，请将其划分为4个等大小的子网。要求：1. 计算每个子网的网络地址、广播地址和可用IP地址范围；2. 说明子网掩码的变化。',
    examples: [
      {
        input: 'IP地址范围：192.168.1.0/24',
        output: '四个子网的详细信息，包括各自的地址范围和子网掩码',
        explanation: '需要说明如何通过借位方法进行子网划分。'
      }
    ],
    acceptanceRate: 62.3
  },
  {
    id: 'net3',
    title: 'HTTP状态码分析',
    difficulty: 'easy',
    content: '请解释以下HTTP状态码的具体含义和使用场景：200、301、302、400、401、403、404、500、502、503。对于每个状态码，需要：1. 说明其标准含义；2. 给出典型的使用场景；3. 分析可能的解决方案。',
    examples: [
      {
        input: 'HTTP请求返回状态码404',
        output: '404表示请求的资源不存在。可能原因：1. URL错误；2. 资源已被移除；3. 服务器配置问题。',
        explanation: '需要对每个状态码进行类似的分析。'
      }
    ],
    acceptanceRate: 75.4
  },
  {
    id: 'net4',
    title: 'DNS解析过程',
    difficulty: 'medium',
    content: '详细描述一个域名(如www.example.com)的完整DNS解析过程。包括：1. 递归查询和迭代查询的区别；2. 各级DNS服务器的作用；3. DNS缓存机制；4. 可能的优化方案。',
    examples: [
      {
        input: '用户在浏览器输入www.example.com',
        output: '完整的DNS解析流程，直到获取目标IP地址',
        explanation: '需要说明从本地DNS到根DNS，再到顶级域名DNS的完整查询过程。'
      }
    ],
    acceptanceRate: 58.9
  },
  {
    id: 'net5',
    title: 'HTTPS加密原理',
    difficulty: 'hard',
    content: '分析HTTPS的加密通信原理，包括：1. 证书验证过程；2. 对称加密和非对称加密的使用场景；3. 会话密钥的生成过程；4. 常见的加密算法。',
    examples: [
      {
        input: '客户端首次访问HTTPS网站',
        output: '详细的SSL/TLS握手过程和加密通信建立过程',
        explanation: '需要说明证书验证、密钥交换等关键步骤。'
      }
    ],
    acceptanceRate: 45.6
  },
  {
    id: 'net6',
    title: 'TCP拥塞控制',
    difficulty: 'hard',
    content: '详细分析TCP的拥塞控制机制，包括：1. 慢启动；2. 拥塞避免；3. 快重传；4. 快恢复。对于每个阶段，需要说明：触发条件、具体算法、窗口大小的变化规律。',
    examples: [
      {
        input: 'TCP连接检测到网络拥塞',
        output: '拥塞控制算法的执行过程和窗口大小的调整策略',
        explanation: '需要说明cwnd和ssthresh的变化过程。'
      }
    ],
    acceptanceRate: 42.3
  },
  {
    id: 'net7',
    title: 'WebSocket协议分析',
    difficulty: 'medium',
    content: '分析WebSocket协议的工作原理，包括：1. 与HTTP的区别；2. 握手过程；3. 数据帧格式；4. 心跳机制；5. 常见应用场景。',
    examples: [
      {
        input: '需要建立WebSocket连接',
        output: '从HTTP握手升级到WebSocket连接的完整过程',
        explanation: '需要说明Upgrade请求头的使用和连接保持的机制。'
      }
    ],
    acceptanceRate: 59.7
  },
  {
    id: 'net8',
    title: 'NAT技术原理',
    difficulty: 'medium',
    content: '分析网络地址转换(NAT)的工作原理，包括：1. 地址转换的类型；2. NAT表的维护；3. 端口映射规则；4. NAT穿透技术。',
    examples: [
      {
        input: '内网主机访问外网服务',
        output: 'NAT设备进行地址转换的详细过程',
        explanation: '需要说明源地址转换和目标地址转换的具体步骤。'
      }
    ],
    acceptanceRate: 61.2
  }
]

// 预设的操作系统题目
const PRESET_OS_PROBLEMS = [
  {
    id: 'os1',
    title: '进程调度算法',
    difficulty: 'medium',
    content: '比较不同的进程调度算法：1. 先来先服务(FCFS)；2. 最短作业优先(SJF)；3. 优先级调度；4. 时间片轮转；5. 多级反馈队列。对于给定的进程序列，计算每种算法下的平均等待时间和平均周转时间。',
    examples: [
      {
        input: '进程序列：P1(到达时间=0,运行时间=6), P2(到达时间=1,运行时间=3), P3(到达时间=2,运行时间=1)',
        output: '使用不同调度算法的调度过程和性能指标比较',
        explanation: '需要计算并比较各种算法的平均等待时间和平均周转时间。'
      }
    ],
    acceptanceRate: 63.5
  },
  {
    id: 'os2',
    title: '死锁检测与预防',
    difficulty: 'hard',
    content: '在一个系统中存在多个进程和多种资源，请：1. 使用银行家算法进行死锁预防；2. 使用资源分配图进行死锁检测；3. 提供死锁恢复策略。',
    examples: [
      {
        input: '系统当前状态：进程P1持有资源R1，请求资源R2；进程P2持有资源R2，请求资源R1',
        output: '死锁检测结果和可能的解决方案',
        explanation: '需要分析是否存在死锁，并提供预防或恢复措施。'
      }
    ],
    acceptanceRate: 48.9
  },
  {
    id: 'os3',
    title: '页面置换算法',
    difficulty: 'medium',
    content: '实现并比较不同的页面置换算法：1. 最近最少使用(LRU)；2. 先进先出(FIFO)；3. 最佳置换(OPT)；4. 时钟算法(CLOCK)。对于给定的页面访问序列，计算每种算法的缺页率。',
    examples: [
      {
        input: '页面访问序列：1,2,3,4,1,2,5,1,2,3,4,5',
        output: '各种置换算法的缺页情况和缺页率',
        explanation: '需要模拟每种算法的页面置换过程。'
      }
    ],
    acceptanceRate: 59.4
  },
  {
    id: 'os4',
    title: '文件系统结构',
    difficulty: 'medium',
    content: '分析常见文件系统的结构和实现原理，包括：1. 文件的物理结构和逻辑结构；2. 目录的组织方式；3. 空闲空间管理；4. 文件共享和保护机制。',
    examples: [
      {
        input: '需要设计一个支持大小文件的文件系统',
        output: '文件系统的详细设计方案，包括索引结构和分配策略',
        explanation: '需要说明如何处理大文件和小文件的存储。'
      }
    ],
    acceptanceRate: 62.1
  },
  {
    id: 'os5',
    title: '内存管理机制',
    difficulty: 'hard',
    content: '分析操作系统的内存管理机制，包括：1. 分段和分页的区别；2. 虚拟内存的实现；3. 地址转换过程；4. TLB的作用；5. 内存分配算法。',
    examples: [
      {
        input: '程序访问虚拟地址0x12345678',
        output: '详细的地址转换过程，包括页表查询和TLB使用',
        explanation: '需要说明从虚拟地址到物理地址的转换步骤。'
      }
    ],
    acceptanceRate: 45.7
  },
  {
    id: 'os6',
    title: '进程同步机制',
    difficulty: 'medium',
    content: '实现并比较不同的进程同步机制：1. 信号量；2. 管程；3. 条件变量；4. 互斥锁。解决经典的同步问题：生产者-消费者、读者-写者、哲学家就餐。',
    examples: [
      {
        input: '5个哲学家围坐在圆桌前，中间放着5根筷子',
        output: '使用不同同步机制解决哲学家就餐问题',
        explanation: '需要避免死锁并确保公平性。'
      }
    ],
    acceptanceRate: 58.3
  },
  {
    id: 'os7',
    title: 'I/O设备管理',
    difficulty: 'medium',
    content: '分析I/O设备管理的关键技术，包括：1. 设备驱动程序的结构；2. 缓冲区管理；3. 磁盘调度算法；4. DMA技术；5. 中断处理机制。',
    examples: [
      {
        input: '磁盘访问请求序列：98,183,37,122,14,124,65,67',
        output: '使用不同磁盘调度算法的访问顺序和寻道距离',
        explanation: '需要比较FCFS、SSTF、SCAN等算法的性能。'
      }
    ],
    acceptanceRate: 60.8
  },
  {
    id: 'os8',
    title: '系统调用实现',
    difficulty: 'hard',
    content: '分析系统调用的实现机制，包括：1. 用户态到内核态的切换；2. 参数传递方式；3. 系统调用表；4. 中断向量表；5. 上下文切换过程。',
    examples: [
      {
        input: '用户程序调用read()系统调用',
        output: '完整的系统调用执行过程，包括特权级切换和参数传递',
        explanation: '需要说明从用户态到内核态的切换细节。'
      }
    ],
    acceptanceRate: 46.2
  }
]

// 预设的前端题目
const PRESET_FRONTEND_PROBLEMS = [
  {
    id: 'fe1',
    title: '实现防抖函数',
    difficulty: 'medium',
    content: '请实现一个防抖函数 debounce，要求：1. 可以设置等待时间；2. 支持立即执行选项；3. 支持取消功能；4. 支持返回 Promise。函数应该能正确处理 this 指向和参数传递。',
    examples: [
      {
        input: 'window.addEventListener("resize", debounce(handleResize, 500))',
        output: '窗口调整完成500ms后才执行handleResize函数',
        explanation: '在连续触发事件时，防抖函数会在最后一次触发后等待指定时间再执行。'
      }
    ],
    acceptanceRate: 62.5
  },
  {
    id: 'fe2',
    title: '虚拟DOM实现',
    difficulty: 'hard',
    content: '实现一个简单的虚拟DOM系统，包括：1. 创建虚拟DOM节点的函数；2. 将虚拟DOM渲染为真实DOM的函数；3. diff算法；4. patch函数进行更新。',
    examples: [
      {
        input: 'const vnode = h("div", { class: "container" }, [h("p", null, "Hello")])',
        output: '生成对应的真实DOM节点',
        explanation: '需要正确处理节点的创建、属性设置和子节点渲染。'
      }
    ],
    acceptanceRate: 45.8
  },
  {
    id: 'fe3',
    title: 'Promise实现',
    difficulty: 'hard',
    content: '手写实现符合Promise/A+规范的Promise类，包括：1. 基本的resolve和reject功能；2. then方法的链式调用；3. catch和finally方法；4. Promise.all和Promise.race等静态方法。',
    examples: [
      {
        input: 'new MyPromise((resolve, reject) => { setTimeout(() => resolve(1), 100) })',
        output: '一个能正常工作的Promise实例',
        explanation: '需要处理异步操作、状态转换和错误处理。'
      }
    ],
    acceptanceRate: 48.2
  },
  {
    id: 'fe4',
    title: '响应式系统实现',
    difficulty: 'hard',
    content: '实现一个简单的响应式系统，类似Vue的响应式原理，包括：1. 数据劫持（Object.defineProperty或Proxy）；2. 依赖收集；3. 派发更新；4. 异步更新队列。',
    examples: [
      {
        input: 'const state = reactive({ count: 0 })',
        output: '当state.count改变时自动触发更新',
        explanation: '需要实现数据响应式和自动更新功能。'
      }
    ],
    acceptanceRate: 43.7
  },
  {
    id: 'fe5',
    title: '前端路由实现',
    difficulty: 'medium',
    content: '实现一个简单的前端路由系统，支持：1. hash模式和history模式；2. 路由配置和参数解析；3. 路由守卫；4. 嵌套路由。',
    examples: [
      {
        input: 'router.push("/user/123")',
        output: '更新URL并渲染对应组件',
        explanation: '需要处理URL变化、组件渲染和参数传递。'
      }
    ],
    acceptanceRate: 58.9
  },
  {
    id: 'fe6',
    title: '前端路由实现',
    difficulty: 'medium',
    content: '实现一个前端路由系统，支持：1. hash模式和history模式；2. 路由配置和参数解析；3. 路由守卫；4. 嵌套路由；5. 路由懒加载。',
    examples: [
      {
        input: '用户访问/user/123/profile',
        output: '解析路由参数并加载对应组件',
        explanation: '需要处理路由参数和组件加载。'
      }
    ],
    acceptanceRate: 57.4
  },
  {
    id: 'fe7',
    title: '状态管理系统',
    difficulty: 'hard',
    content: '实现一个类似Vuex/Redux的状态管理系统，包括：1. 状态树管理；2. 修改提交机制；3. 异步操作处理；4. 模块化支持；5. 插件机制。',
    examples: [
      {
        input: '多组件共享的状态管理需求',
        output: '完整的状态管理解决方案',
        explanation: '需要实现状态的集中管理和变更追踪。'
      }
    ],
    acceptanceRate: 46.8
  },
  {
    id: 'fe8',
    title: '前端性能监控',
    difficulty: 'medium',
    content: '设计前端性能监控系统，要求：1. 性能指标采集；2. 错误监控；3. 用户行为跟踪；4. 资源加载分析；5. 性能报告生成。',
    examples: [
      {
        input: '网站性能监控需求',
        output: '完整的性能监控方案',
        explanation: '需要收集和分析各类性能指标。'
      }
    ],
    acceptanceRate: 58.9
  }
]

// 预设的后端题目
const PRESET_BACKEND_PROBLEMS = [
  {
    id: 'be1',
    title: '实现JWT认证',
    difficulty: 'medium',
    content: '实现基于JWT的用户认证系统，要求：1. 生成和验证JWT token；2. 处理token过期和刷新；3. 实现中间件进行认证；4. 处理多设备登录。',
    examples: [
      {
        input: '用户登录请求，包含用户名和密码',
        output: '返回包含token的响应',
        explanation: '需要实现完整的JWT认证流程。'
      }
    ],
    acceptanceRate: 64.3
  },
  {
    id: 'be2',
    title: '分布式锁实现',
    difficulty: 'hard',
    content: '使用Redis实现分布式锁，要求：1. 支持超时自动释放；2. 防止锁被其他进程释放；3. 支持可重入；4. 实现等待队列。',
    examples: [
      {
        input: '多个服务实例同时请求锁',
        output: '确保同一时间只有一个实例获得锁',
        explanation: '需要处理并发、超时和异常情况。'
      }
    ],
    acceptanceRate: 46.7
  },
  {
    id: 'be3',
    title: '限流器实现',
    difficulty: 'medium',
    content: '实现一个高性能的限流器，支持：1. 固定窗口限流；2. 滑动窗口限流；3. 令牌桶算法；4. 分布式环境下的限流。',
    examples: [
      {
        input: '服务每秒收到1000个请求',
        output: '根据限流策略允许或拒绝请求',
        explanation: '需要实现不同的限流算法并处理并发。'
      }
    ],
    acceptanceRate: 59.4
  },
  {
    id: 'be4',
    title: '消息队列实现',
    difficulty: 'hard',
    content: '实现一个简单的消息队列系统，要求：1. 支持发布订阅模式；2. 实现消息持久化；3. 处理消费者组；4. 支持消息重试和死信队列。',
    examples: [
      {
        input: '生产者发送消息，多个消费者订阅',
        output: '消息被正确投递和消费',
        explanation: '需要处理消息存储、分发和异常情况。'
      }
    ],
    acceptanceRate: 45.2
  },
  {
    id: 'be5',
    title: '缓存系统设计',
    difficulty: 'medium',
    content: '设计并实现一个缓存系统，包括：1. LRU淘汰策略；2. 过期时间管理；3. 并发控制；4. 缓存穿透、击穿、雪崩的解决方案。',
    examples: [
      {
        input: '高并发场景下的缓存操作',
        output: '正确处理缓存读写和异常情况',
        explanation: '需要考虑性能、一致性和异常处理。'
      }
    ],
    acceptanceRate: 57.8
  },
  {
    id: 'be6',
    title: '分布式任务调度',
    difficulty: 'hard',
    content: '实现分布式任务调度系统，要求：1. 任务分发策略；2. 执行状态跟踪；3. 失败重试机制；4. 负载均衡；5. 动态扩缩容。',
    examples: [
      {
        input: '大规模定时任务调度需求',
        output: '分布式调度系统设计方案',
        explanation: '需要处理任务分配和执行监控。'
      }
    ],
    acceptanceRate: 44.5
  },
  {
    id: 'be7',
    title: '实时计算引擎',
    difficulty: 'hard',
    content: '设计实时数据处理引擎，包括：1. 数据流处理；2. 窗口计算；3. 状态管理；4. 容错机制；5. 吞吐量优化。',
    examples: [
      {
        input: '实时数据分析需求',
        output: '流处理引擎实现方案',
        explanation: '需要处理高并发数据流。'
      }
    ],
    acceptanceRate: 42.3
  },
  {
    id: 'be8',
    title: 'RPC框架实现',
    difficulty: 'hard',
    content: '实现一个RPC框架，要求：1. 服务注册发现；2. 序列化机制；3. 通信协议；4. 超时重试；5. 负载均衡。',
    examples: [
      {
        input: '分布式服务调用需求',
        output: 'RPC框架设计和实现',
        explanation: '需要处理远程调用的各个环节。'
      }
    ],
    acceptanceRate: 45.7
  },
  {
    id: 'be9',
    title: '分布式日志系统',
    difficulty: 'medium',
    content: '设计分布式日志收集系统，包括：1. 日志采集；2. 传输机制；3. 存储策略；4. 检索功能；5. 告警规则。',
    examples: [
      {
        input: '分布式系统日志管理需求',
        output: '日志系统架构设计',
        explanation: '需要处理大规模日志数据。'
      }
    ],
    acceptanceRate: 56.8
  },
  {
    id: 'be10',
    title: '服务降级熔断',
    difficulty: 'medium',
    content: '实现服务降级和熔断机制，要求：1. 熔断器状态管理；2. 降级策略配置；3. 恢复机制；4. 监控告警；5. 动态调整。',
    examples: [
      {
        input: '服务调用异常处理需求',
        output: '完整的降级熔断方案',
        explanation: '需要保护系统免受级联故障。'
      }
    ],
    acceptanceRate: 54.9
  }
]

// 预设的人工智能题目
const PRESET_AI_PROBLEMS = [
  {
    id: 'ai1',
    title: '实现决策树算法',
    difficulty: 'medium',
    content: '实现ID3决策树算法，要求：1. 计算信息熵和信息增益；2. 构建决策树；3. 处理连续值属性；4. 实现剪枝操作。',
    examples: [
      {
        input: '包含多个特征的训练数据集',
        output: '构建好的决策树模型',
        explanation: '需要实现特征选择和树的构建过程。'
      }
    ],
    acceptanceRate: 62.1
  },
  {
    id: 'ai2',
    title: '神经网络反向传播',
    difficulty: 'hard',
    content: '实现神经网络的反向传播算法，包括：1. 前向传播计算；2. 计算损失函数；3. 反向传播梯度；4. 参数更新。',
    examples: [
      {
        input: '训练数据和网络结构',
        output: '训练过程中的梯度计算和参数更新',
        explanation: '需要正确实现梯度计算和参数优化。'
      }
    ],
    acceptanceRate: 45.6
  },
  {
    id: 'ai3',
    title: 'K-means聚类算法',
    difficulty: 'medium',
    content: '实现K-means聚类算法，要求：1. 随机初始化聚类中心；2. 迭代优化过程；3. 处理异常情况；4. 评估聚类效果。',
    examples: [
      {
        input: '二维平面上的多个数据点',
        output: '聚类结果和中心点',
        explanation: '需要实现聚类过程和结果评估。'
      }
    ],
    acceptanceRate: 58.9
  },
  {
    id: 'ai4',
    title: '实现遗传算法',
    difficulty: 'hard',
    content: '实现一个遗传算法框架，包括：1. 种群初始化；2. 适应度计算；3. 选择、交叉和变异操作；4. 终止条件判断。',
    examples: [
      {
        input: '优化问题的目标函数和约束条件',
        output: '进化过程和最优解',
        explanation: '需要实现完整的遗传算法流程。'
      }
    ],
    acceptanceRate: 47.3
  },
  {
    id: 'ai5',
    title: '强化学习实现',
    difficulty: 'hard',
    content: '实现Q-learning算法，要求：1. 环境和状态空间定义；2. Q表更新规则；3. 探索与利用策略；4. 学习过程可视化。',
    examples: [
      {
        input: '给定环境和奖励函数',
        output: '学习得到的最优策略',
        explanation: '需要实现强化学习的核心组件。'
      }
    ],
    acceptanceRate: 44.8
  }
]

// 预设的网络安全题目
const PRESET_SECURITY_PROBLEMS = [
  {
    id: 'sec1',
    title: 'SQL注入防御',
    difficulty: 'medium',
    content: '实现一个安全的数据库查询系统，防止SQL注入攻击。要求：1. 实现参数化查询；2. 输入验证和过滤；3. 最小权限原则；4. 防止错误信息泄露。',
    examples: [
      {
        input: '用户输入：username = "admin\' OR \'1\'=\'1"',
        output: '安全处理后的查询语句和防护措施',
        explanation: '需要正确处理特殊字符和转义。'
      }
    ],
    acceptanceRate: 63.4
  },
  {
    id: 'sec2',
    title: 'XSS攻击防御',
    difficulty: 'medium',
    content: '实现Web应用的XSS防御机制，包括：1. 输入数据净化；2. 输出编码；3. CSP策略配置；4. HttpOnly Cookie设置。',
    examples: [
      {
        input: '用户提交包含脚本的评论',
        output: '安全处理后的显示结果',
        explanation: '需要正确处理HTML特殊字符和JavaScript代码。'
      }
    ],
    acceptanceRate: 58.7
  },
  {
    id: 'sec3',
    title: '密码系统设计',
    difficulty: 'hard',
    content: '设计一个安全的密码管理系统，要求：1. 密码加密存储；2. 密码强度检测；3. 防暴力破解；4. 密码重置流程；5. 会话管理。',
    examples: [
      {
        input: '用户注册时的密码处理',
        output: '加密存储和验证流程',
        explanation: '需要使用加盐哈希和适当的加密算法。'
      }
    ],
    acceptanceRate: 45.2
  },
  {
    id: 'sec4',
    title: 'CSRF防护实现',
    difficulty: 'medium',
    content: '实现CSRF防护机制，包括：1. Token验证；2. Same-Site Cookie；3. Referer检查；4. 自定义请求头。',
    examples: [
      {
        input: '用户提交表单请求',
        output: '带有CSRF防护的请求处理流程',
        explanation: '需要在表单中加入token并验证。'
      }
    ],
    acceptanceRate: 61.8
  },
  {
    id: 'sec5',
    title: '安全审计系统',
    difficulty: 'hard',
    content: '设计并实现安全审计系统，要求：1. 日志收集和存储；2. 异常行为检测；3. 实时告警机制；4. 审计报告生成。',
    examples: [
      {
        input: '系统操作日志流',
        output: '安全分析报告和告警信息',
        explanation: '需要实现日志分析和异常检测算法。'
      }
    ],
    acceptanceRate: 47.5
  },
  {
    id: 'sec6',
    title: 'OAuth2.0认证流程',
    difficulty: 'medium',
    content: '实现一个完整的OAuth2.0授权服务器，支持授权码模式和密码模式。需要处理令牌生成、刷新和验证，并确保整个认证流程的安全性。',
    examples: [
      {
        input: '用户请求第三方应用授权',
        output: '返回授权码和访问令牌',
        explanation: '完整的OAuth2.0授权流程实现'
      }
    ],
    acceptanceRate: 56.8
  },
  {
    id: 'sec7',
    title: 'Web应用防火墙',
    difficulty: 'hard',
    content: '设计一个Web应用防火墙(WAF)，能够检测和阻止常见的Web攻击，包括SQL注入、XSS、CSRF等。系统需要支持自定义规则和实时监控。',
    examples: [
      {
        input: '可疑的HTTP请求',
        output: '拦截报告和处理结果',
        explanation: '基于规则的请求过滤系统'
      }
    ],
    acceptanceRate: 45.2
  }
]

// 预设的云计算题目
const PRESET_CLOUD_PROBLEMS = [
  {
    id: 'cloud1',
    title: '容器编排系统',
    difficulty: 'hard',
    content: '实现一个简单的容器编排系统，要求：1. 容器生命周期管理；2. 服务发现和负载均衡；3. 健康检查；4. 滚动更新策略。',
    examples: [
      {
        input: '部署微服务应用',
        output: '容器集群的管理和调度方案',
        explanation: '需要处理容器编排和服务管理。'
      }
    ],
    acceptanceRate: 43.2
  },
  {
    id: 'cloud2',
    title: '自动扩缩容实现',
    difficulty: 'medium',
    content: '实现云服务的自动扩缩容机制，包括：1. 负载监控；2. 扩缩容策略；3. 资源调度；4. 成本优化。',
    examples: [
      {
        input: '服务负载监控数据',
        output: '扩缩容决策和执行计划',
        explanation: '需要根据负载指标自动调整资源。'
      }
    ],
    acceptanceRate: 57.8
  },
  {
    id: 'cloud3',
    title: '分布式配置中心',
    difficulty: 'medium',
    content: '设计分布式配置中心，要求：1. 配置管理和版本控制；2. 实时推送；3. 权限控制；4. 配置回滚。',
    examples: [
      {
        input: '配置更新请求',
        output: '配置分发和生效过程',
        explanation: '需要处理配置的一致性和实时性。'
      }
    ],
    acceptanceRate: 59.4
  },
  {
    id: 'cloud4',
    title: '服务网格实现',
    difficulty: 'hard',
    content: '实现基本的服务网格功能，包括：1. 流量管理；2. 安全策略；3. 可观测性；4. 故障注入。',
    examples: [
      {
        input: '微服务间的通信请求',
        output: '服务网格的处理流程',
        explanation: '需要实现代理注入和流量控制。'
      }
    ],
    acceptanceRate: 44.6
  },
  {
    id: 'cloud5',
    title: '云存储系统设计',
    difficulty: 'hard',
    content: '设计分布式云存储系统，要求：1. 数据分片；2. 副本管理；3. 一致性保证；4. 故障恢复。',
    examples: [
      {
        input: '文件存储和访问请求',
        output: '数据分布和访问策略',
        explanation: '需要处理数据的分布式存储和访问。'
      }
    ],
    acceptanceRate: 46.3
  },
  {
    id: 'cloud6',
    title: '容器调度系统',
    difficulty: 'hard',
    content: '实现一个类似Kubernetes的容器调度系统，能够管理容器的生命周期，处理服务发现、负载均衡和故障转移。系统需要保证高可用性和可扩展性。',
    examples: [
      {
        input: '部署微服务应用集群',
        output: '容器编排和调度方案',
        explanation: '分布式容器管理系统'
      }
    ],
    acceptanceRate: 42.5
  },
  {
    id: 'cloud7',
    title: '分布式缓存系统',
    difficulty: 'medium',
    content: '设计一个分布式缓存系统，支持数据分片、副本复制和故障恢复。系统需要保证数据一致性和高性能的读写操作。',
    examples: [
      {
        input: '高并发缓存请求',
        output: '缓存处理结果',
        explanation: '分布式数据缓存实现'
      }
    ],
    acceptanceRate: 58.3
  }
]

// 预设的移动开发题目
const PRESET_MOBILE_PROBLEMS = [
  {
    id: 'mob1',
    title: '移动端性能优化',
    difficulty: 'hard',
    content: '实现移动应用的性能优化方案，包括：1. 启动速度优化；2. 内存管理；3. 电量优化；4. 网络请求优化；5. 图片加载优化。',
    examples: [
      {
        input: '应用启动时间超过3秒',
        output: '优化后的启动流程和性能指标',
        explanation: '需要分析启动过程并实现多级优化。'
      }
    ],
    acceptanceRate: 45.6
  },
  {
    id: 'mob2',
    title: '离线数据同步',
    difficulty: 'medium',
    content: '实现移动应用的离线数据同步机制，要求：1. 本地数据存储；2. 冲突解决策略；3. 增量同步；4. 后台同步；5. 错误恢复。',
    examples: [
      {
        input: '用户在离线状态下修改数据',
        output: '网络恢复后的数据同步流程',
        explanation: '需要处理数据一致性和冲突解决。'
      }
    ],
    acceptanceRate: 58.3
  },
  {
    id: 'mob3',
    title: '手势识别系统',
    difficulty: 'medium',
    content: '实现移动应用的手势识别系统，支持：1. 基本手势（点击、滑动、缩放等）；2. 自定义手势；3. 手势冲突处理；4. 多点触控。',
    examples: [
      {
        input: '用户在屏幕上进行手势操作',
        output: '识别手势类型和相应的处理',
        explanation: '需要处理触摸事件和手势识别。'
      }
    ],
    acceptanceRate: 62.4
  },
  {
    id: 'mob4',
    title: '推送通知系统',
    difficulty: 'medium',
    content: '设计移动应用的推送通知系统，包括：1. 消息分类和优先级；2. 通知栏管理；3. 定时推送；4. 用户设置；5. 推送统计。',
    examples: [
      {
        input: '后端发送推送消息',
        output: '客户端接收和显示通知',
        explanation: '需要处理不同平台的推送机制。'
      }
    ],
    acceptanceRate: 59.7
  },
  {
    id: 'mob5',
    title: '移动支付集成',
    difficulty: 'hard',
    content: '实现移动应用的支付功能，要求：1. 集成多种支付方式；2. 支付流程管理；3. 订单状态同步；4. 安全验证；5. 支付结果处理。',
    examples: [
      {
        input: '用户发起支付请求',
        output: '完整的支付流程和结果处理',
        explanation: '需要处理支付安全和异常情况。'
      }
    ],
    acceptanceRate: 46.8
  },
  {
    id: 'mob6',
    title: '移动端图片处理',
    difficulty: 'medium',
    content: '开发一个移动端的图片处理库，支持图片压缩、裁剪、滤镜效果和实时预览。需要考虑内存占用和处理性能。',
    examples: [
      {
        input: '用户选择的原始图片',
        output: '处理后的图片效果',
        explanation: '图片实时处理功能'
      }
    ],
    acceptanceRate: 59.4
  },
  {
    id: 'mob7',
    title: '移动端音视频编辑',
    difficulty: 'hard',
    content: '实现一个移动端的音视频编辑器，支持视频剪辑、音频混音、特效添加和格式转换。需要优化渲染性能和导出效率。',
    examples: [
      {
        input: '原始视频文件',
        output: '编辑后的成品视频',
        explanation: '音视频处理工具'
      }
    ],
    acceptanceRate: 46.7
  }
]

// 预设的系统架构题目
const PRESET_ARCHITECTURE_PROBLEMS = [
  {
    id: 'arch1',
    title: '微服务架构设计',
    difficulty: 'hard',
    content: '设计一个电商系统的微服务架构，包括：1. 服务拆分原则；2. 服务间通信；3. 数据一致性；4. 服务治理；5. 监控告警。',
    examples: [
      {
        input: '大型单体应用需要改造为微服务',
        output: '完整的微服务架构设计方案',
        explanation: '需要考虑业务拆分和技术选型。'
      }
    ],
    acceptanceRate: 42.3
  },
  {
    id: 'arch2',
    title: '高可用系统设计',
    difficulty: 'hard',
    content: '设计一个高可用系统，要求：1. 负载均衡策略；2. 故障转移机制；3. 限流熔断；4. 灾备方案；5. 可用性指标监控。',
    examples: [
      {
        input: '系统需要达到99.99%可用性',
        output: '高可用架构设计和实现方案',
        explanation: '需要考虑各种故障场景和恢复策略。'
      }
    ],
    acceptanceRate: 44.5
  },
  {
    id: 'arch3',
    title: '分布式事务实现',
    difficulty: 'hard',
    content: '实现分布式事务解决方案，包括：1. 2PC/3PC协议；2. TCC补偿；3. 消息队列；4. Saga模式；5. 最终一致性。',
    examples: [
      {
        input: '跨服务的订单支付流程',
        output: '分布式事务的处理方案',
        explanation: '需要处理各种异常情况和数据一致性。'
      }
    ],
    acceptanceRate: 41.2
  },
  {
    id: 'arch4',
    title: '缓存架构设计',
    difficulty: 'medium',
    content: '设计大型系统的缓存架构，包括：1. 多级缓存策略；2. 缓存一致性；3. 热点数据处理；4. 缓存更新机制；5. 性能优化。',
    examples: [
      {
        input: '系统面临缓存性能瓶颈',
        output: '缓存架构优化方案',
        explanation: '需要解决缓存常见问题和优化策略。'
      }
    ],
    acceptanceRate: 56.7
  },
  {
    id: 'arch5',
    title: '搜索引擎架构',
    difficulty: 'hard',
    content: '设计一个搜索引擎系统，要求：1. 数据采集和更新；2. 索引构建；3. 查询解析和处理；4. 相关性排序；5. 性能优化。',
    examples: [
      {
        input: '需要支持亿级数据的实时搜索',
        output: '搜索引擎的架构设计方案',
        explanation: '需要考虑数据规模和实时性要求。'
      }
    ],
    acceptanceRate: 43.8
  }
]

// 预设的软件测试题目
const PRESET_TESTING_PROBLEMS = [
  {
    id: 'test1',
    title: '自动化测试框架',
    difficulty: 'medium',
    content: '设计并实现自动化测试框架，包括：1. 测试用例管理；2. 测试数据准备；3. 断言机制；4. 测试报告生成；5. CI/CD集成。',
    examples: [
      {
        input: '需要对Web应用进行自动化测试',
        output: '完整的自动化测试解决方案',
        explanation: '需要考虑测试效率和可维护性。'
      }
    ],
    acceptanceRate: 58.9
  },
  {
    id: 'test2',
    title: '性能测试实现',
    difficulty: 'hard',
    content: '实现性能测试方案，要求：1. 负载模拟；2. 性能指标采集；3. 瓶颈分析；4. 压力测试；5. 性能调优建议。',
    examples: [
      {
        input: '系统需要支持10000并发用户',
        output: '性能测试执行方案和结果分析',
        explanation: '需要模拟真实场景并收集性能数据。'
      }
    ],
    acceptanceRate: 45.6
  },
  {
    id: 'test3',
    title: '接口测试设计',
    difficulty: 'medium',
    content: '设计REST API的测试方案，包括：1. 接口用例设计；2. 参数验证；3. 异常测试；4. 安全测试；5. 自动化实现。',
    examples: [
      {
        input: '新开发的REST API需要测试',
        output: '完整的API测试用例集',
        explanation: '需要覆盖各种请求场景和异常情况。'
      }
    ],
    acceptanceRate: 62.3
  },
  {
    id: 'test4',
    title: '移动应用测试',
    difficulty: 'medium',
    content: '实现移动应用的测试方案，包括：1. 功能测试；2. 兼容性测试；3. 安装测试；4. 升级测试；5. 性能测试。',
    examples: [
      {
        input: '移动应用发布前的测试需求',
        output: '移动测试策略和执行方案',
        explanation: '需要考虑不同设备和系统版本。'
      }
    ],
    acceptanceRate: 59.4
  },
  {
    id: 'test5',
    title: '安全测试方案',
    difficulty: 'hard',
    content: '设计应用的安全测试方案，包括：1. 漏洞扫描；2. 渗透测试；3. 安全配置检查；4. 加密测试；5. 认证授权测试。',
    examples: [
      {
        input: '系统上线前的安全测试需求',
        output: '安全测试执行方案和报告',
        explanation: '需要发现和验证各类安全漏洞。'
      }
    ],
    acceptanceRate: 46.7
  }
]

export const useProblemsStore = defineStore({
  id: 'problems',
  state: () => {
    const initialState = {
      currentProblem: null,
      problemsByCategory: {
        algorithms: [...PRESET_ALGORITHM_PROBLEMS],
        database: [...PRESET_DATABASE_PROBLEMS],
        network: [...PRESET_NETWORK_PROBLEMS],
        os: [...PRESET_OS_PROBLEMS],
        frontend: [...PRESET_FRONTEND_PROBLEMS],
        backend: [...PRESET_BACKEND_PROBLEMS],
        ai: [...PRESET_AI_PROBLEMS],
        security: [...PRESET_SECURITY_PROBLEMS],
        cloud: [...PRESET_CLOUD_PROBLEMS],
        mobile: [...PRESET_MOBILE_PROBLEMS],
        architecture: [...PRESET_ARCHITECTURE_PROBLEMS],
        testing: [...PRESET_TESTING_PROBLEMS]
      }
    }
    console.log('Initializing store with:', initialState)
    return initialState
  },
  
  actions: {
    setCurrentProblem(problem) {
      if (!problem || !problem.id) {
        console.error('Invalid problem data:', problem)
        return
      }
      if (!problem.acceptanceRate) {
        const acceptanceRateRange = {
          easy: { min: 65, max: 85 },
          medium: { min: 45, max: 65 },
          hard: { min: 25, max: 45 }
        }
        const range = acceptanceRateRange[problem.difficulty?.toLowerCase()] || acceptanceRateRange.medium
        problem.acceptanceRate = (Math.random() * (range.max - range.min) + range.min).toFixed(1)
      }
      this.currentProblem = problem
    },
    
    getCurrentProblem() {
      return this.currentProblem
    },

    getProblemsByCategory(category) {
      if (!category) {
        console.error('Category is required')
        return []
      }
      console.log('Getting problems for category:', category)
      console.log('Current problems:', this.problemsByCategory[category])
      return this.problemsByCategory[category] || []
    },

    addProblems(category, problems) {
      if (!category || !Array.isArray(problems)) {
        console.error('Invalid parameters:', { category, problems })
        return
      }
      
      // 确保 problemsByCategory 对象存在
      if (!this.problemsByCategory) {
        this.problemsByCategory = {}
      }

      // 根据类别添加预设题目
      if ((category === 'algorithms' || category === 'database' || category === 'network' || 
           category === 'os' || category === 'frontend' || category === 'backend' || category === 'ai' ||
           category === 'security' || category === 'cloud' || category === 'mobile' ||
           category === 'architecture' || category === 'testing') && 
          (!this.problemsByCategory[category] || this.problemsByCategory[category].length === 0)) {
        console.log(`Adding preset problems for ${category}`)
        const presetMap = {
          algorithms: PRESET_ALGORITHM_PROBLEMS,
          database: PRESET_DATABASE_PROBLEMS,
          network: PRESET_NETWORK_PROBLEMS,
          os: PRESET_OS_PROBLEMS,
          frontend: PRESET_FRONTEND_PROBLEMS,
          backend: PRESET_BACKEND_PROBLEMS,
          ai: PRESET_AI_PROBLEMS,
          security: PRESET_SECURITY_PROBLEMS,
          cloud: PRESET_CLOUD_PROBLEMS,
          mobile: PRESET_MOBILE_PROBLEMS,
          architecture: PRESET_ARCHITECTURE_PROBLEMS,
          testing: PRESET_TESTING_PROBLEMS
        }
        this.problemsByCategory[category] = [...presetMap[category]]
      }
      
      // 只有当有新题目要添加时才合并
      if (problems.length > 0) {
        this.problemsByCategory[category] = [
          ...(this.problemsByCategory[category] || []),
          ...problems.map(p => ({
            id: p.id || p.problemId || Date.now().toString(),
            ...p
          }))
        ]
      }
      
      console.log('Updated problems for category:', category, this.problemsByCategory[category])
    },

    deleteProblem(category, problemId) {
      if (this.problemsByCategory[category]) {
        this.problemsByCategory[category] = this.problemsByCategory[category]
          .filter(p => p.id !== problemId)
      }
    }
  },

  getters: {
    currentProblemDetails: (state) => state.currentProblem,
    totalProblemsCount: (state) => {
      return Object.values(state.problemsByCategory)
        .reduce((total, problems) => total + problems.length, 0)
    }
  }
}) 