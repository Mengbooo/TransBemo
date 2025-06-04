import { defineConfig } from 'vitepress'
import mermaidPlugin from './plugins/markdown-it-mermaid.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TransBemo文档",
  description: "TransBemo项目技术文档",
  srcDir: './docs',  // 指定docs为源目录
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '开发文档', link: '/dev/architecture' },
      { text: '设计文档', link: '/design/design' },
      { text: 'API文档', link: '/api/speechTransAPI' },
      { text: 'Mermaid测试', link: '/mermaid-test' }
    ],

    sidebar: [
      {
        text: '开发文档',
        items: [
          { text: '架构设计', link: '/dev/architecture' },
          { text: '环境配置', link: '/dev/environment-setup' },
          { text: '代码规范', link: '/dev/code-standards' }
        ]
      },
      {
        text: '设计文档',
        items: [
          { text: '设计规范', link: '/design/design' }
        ]
      },
      {
        text: 'API文档',
        items: [
          { text: '语音翻译API', link: '/api/speechTransAPI' },
          { text: '百度语音翻译API', link: '/api/speechTransAPI-baidu' },
          { text: '腾讯语音翻译API', link: '/api/speechTransAPI-tencent' },
          { text: '有道语音翻译API', link: '/api/speechTransAPI-youdao' },
          { text: '短语音识别', link: '/api/shortSpeechRec' },
          { text: '文本翻译API', link: '/api/textTransAPI' },
          { text: '图像翻译API', link: '/api/imageTransAPI' },
          { text: '信号处理', link: '/api/signal' },
          { text: '公共参数', link: '/api/publicArg' },
          { text: '音频提示', link: '/api/audioTip' }
        ]
      },
      {
        text: '测试页面',
        items: [
          { text: 'Mermaid图表测试', link: '/mermaid-test' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  // 添加Markdown配置
  markdown: {
    config: (md) => {
      md.use(mermaidPlugin);
    }
  },
  // 添加Mermaid支持
  head: [
    ['script', { src: 'https://cdn.jsdelivr.net/npm/mermaid@11.6.0/dist/mermaid.min.js' }],
    ['script', { type: 'module' }, `
      document.addEventListener('DOMContentLoaded', () => {
        if (typeof mermaid !== 'undefined') {
          mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
              htmlLabels: true,
              useMaxWidth: true,
              curve: 'basis'
            }
          });
          
          // 给渲染一点时间
          setTimeout(() => {
            try {
              mermaid.contentLoaded();
            } catch (e) {
              console.error('Mermaid初始化错误:', e);
            }
          }, 1000);
        }
      });
    `]
  ]
})
