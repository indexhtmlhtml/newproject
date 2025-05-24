// 下载为 Word 文档
export const downloadPaperAsWord = (paper) => {
  // 自动补全所有题型和题目字段
  const fillQuestion = (q, type) => {
    if (!q) return {};
    // 题干
    if (!('content' in q) || !q.content) q.content = '[题干缺失]';
    // 分值
    if (!('score' in q)) q.score = '?';
    // 答案
    if (!('answer' in q)) q.answer = '[无]';
    // 选项
    if (type === 'choice') {
      if (!('options' in q) || !q.options) q.options = [];
      if (Array.isArray(q.options)) {
        q.options = q.options.map(opt => opt ?? '[空]');
      } else if (typeof q.options === 'object') {
        Object.keys(q.options).forEach(k => {
          if (!q.options[k]) q.options[k] = '[空]';
        });
      }
    }
    // 编程题示例
    if (type === 'programming') {
      if (!('example' in q) || !q.example) q.example = { input: '', output: '' };
      if (!('input' in q.example)) q.example.input = '';
      if (!('output' in q.example)) q.example.output = '';
    }
    // 匹配题
    if (type === 'matching') {
      if (!('leftItems' in q) || !Array.isArray(q.leftItems)) q.leftItems = [];
      if (!('rightItems' in q) || !Array.isArray(q.rightItems)) q.rightItems = [];
      if (!('answer' in q) || !Array.isArray(q.answer)) q.answer = [];
    }
    return q;
  };

  // 对所有题型做补全
  ['choice','programming','completion','truefalse','shortanswer','matching'].forEach(type => {
    if (Array.isArray(paper[type])) {
      paper[type] = paper[type].map(q => fillQuestion(q, type));
    }
  });

  // 创建文档内容
  let content = `
    <h1 style="text-align: center;">${paper.title || '编程能力测试'}</h1>
    <div style="text-align: center; margin: 20px 0; color: #666;">
      <span>时长：${paper.duration}分钟</span> | 
      <span>总分：${paper.totalScore}分</span> | 
      <span>难度：${paper.difficulty}</span>
    </div>
  `

  // 添加选择题
  if (paper.choice?.length) {
    content += `
      <h2>一、选择题</h2>
      ${paper.choice.map((q, i) => {
        // 确保选项是数组
        const options = Array.isArray(q.options) ? q.options : Object.values(q.options)
        return `
          <div class="question">
            <p>${i + 1}. ${q.content} (${q.score}分)</p>
            <div class="options">
              ${options.map((opt, j) => `
                <p>${String.fromCharCode(65 + j)}. ${opt}</p>
              `).join('')}
            </div>
          </div>
        `
      }).join('')}
    `
  }

  // 添加编程题
  if (paper.programming?.length) {
    content += `
      <h2>二、编程题</h2>
      ${paper.programming.map((q, i) => `
        <div class="question">
          <p>${i + 1}. ${q.content} (${q.score}分)</p>
          ${q.example ? `
            <div class="example">
              <p><strong>示例输入：</strong>${q.example.input}</p>
              <p><strong>示例输出：</strong>${q.example.output}</p>
            </div>
          ` : ''}
        </div>
      `).join('')}
    `
  }

  // 添加填空题
  if (paper.completion?.length) {
    content += `
      <h2>三、填空题</h2>
      ${paper.completion.map((q, i) => `
        <div class="question">
          <p>${i + 1}. ${q.content} (${q.score}分)</p>
          <div class="blank-line">_________________</div>
        </div>
      `).join('')}
    `
  }

  // 添加判断题
  if (paper.truefalse?.length) {
    content += `
      <h2>四、判断题</h2>
      ${paper.truefalse.map((q, i) => `
        <div class="question">
          <p>${i + 1}. ${q.content} (${q.score}分)</p>
          <div class="tf-options">
            <span>【 】正确</span>
            <span>【 】错误</span>
          </div>
        </div>
      `).join('')}
    `
  }

  // 添加简答题
  if (paper.shortanswer?.length) {
    content += `
      <h2>五、简答题</h2>
      ${paper.shortanswer.map((q, i) => `
        <div class="question">
          <p>${i + 1}. ${q.content} (${q.score}分)</p>
          <div class="answer-space"></div>
        </div>
      `).join('')}
    `
  }

  // 添加匹配题
  if (paper.matching?.length) {
    content += `
      <h2>六、匹配题</h2>
      ${paper.matching.map((q, i) => `
        <div class="question">
          <p>${i + 1}. ${q.content} (${q.score}分)</p>
          <div class="matching-grid">
            <div class="left-column">
              ${q.leftItems.map((item, j) => `
                <p>${j + 1}. ${item} ______</p>
              `).join('')}
            </div>
            <div class="right-column">
              ${q.rightItems.map((item, j) => `
                <p>${String.fromCharCode(65 + j)}. ${item}</p>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    `
  }

  // 创建 Blob 对象
  const blob = new Blob([`
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 40px;
          }
          h1 { font-size: 24px; margin-bottom: 20px; }
          h2 { font-size: 18px; margin-top: 30px; color: #333; }
          .question {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .options p {
            margin: 5px 0 5px 20px;
          }
          .example {
            margin: 10px 0 10px 20px;
            padding: 10px;
            background: #f5f5f5;
            border-left: 3px solid #ddd;
          }
          .blank-line {
            margin: 10px 0 10px 20px;
          }
          .tf-options {
            margin: 10px 0 10px 20px;
          }
          .tf-options span {
            margin-right: 20px;
          }
          .answer-space {
            height: 150px;
            border-bottom: 1px solid #ccc;
            margin: 10px 0;
          }
          .matching-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 10px 20px;
          }
          @page {
            margin: 2cm;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `], { type: 'application/msword' })

  // 创建下载链接
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${paper.title || '编程能力测试'}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
} 