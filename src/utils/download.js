// 生成 Word 文档内容
const generateWordContent = (paper) => {
  let content = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .paper-title { text-align: center; font-size: 24px; margin-bottom: 20px; }
          .section-title { font-size: 18px; margin: 15px 0; }
          .question { margin: 10px 0; }
          .options { margin-left: 20px; }
          .example { background: #f5f5f5; padding: 10px; margin: 10px 0; }
          .answer { color: #666; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="paper-title">${paper.title}</div>
  `

  // 添加选择题
  if (paper.choice && paper.choice.length > 0) {
    content += '<div class="section-title">一、选择题</div>'
    paper.choice.forEach((q, index) => {
      content += `
        <div class="question">
          ${index + 1}. (${q.score}分) ${q.content}
          <div class="options">
            ${Object.entries(q.options).map(([key, value]) => 
              `<div>${key}. ${value}</div>`
            ).join('')}
          </div>
          <div class="answer">答案：${q.answer}</div>
        </div>
      `
    })
  }

  // 添加编程题
  if (paper.programming && paper.programming.length > 0) {
    content += '<div class="section-title">二、编程题</div>'
    paper.programming.forEach((q, index) => {
      content += `
        <div class="question">
          ${index + 1}. (${q.score}分) ${q.content}
          <div class="example">
            <div>输入示例：${q.example.input}</div>
            <div>输出示例：${q.example.output}</div>
          </div>
          <div class="answer">
            参考答案：
            <pre>${q.answer}</pre>
          </div>
        </div>
      `
    })
  }

  // 添加填空题
  if (paper.completion && paper.completion.length > 0) {
    content += '<div class="section-title">三、填空题</div>'
    paper.completion.forEach((q, index) => {
      content += `
        <div class="question">
          ${index + 1}. (${q.score}分) ${q.content}
          <div class="answer">答案：${q.answer}</div>
        </div>
      `
    })
  }

  content += `
      </body>
    </html>
  `

  return content
}

// 下载为 Word 文档
export const downloadPaperAsWord = (paper) => {
  const content = generateWordContent(paper)
  const blob = new Blob([content], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${paper.title || '试卷'}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
} 