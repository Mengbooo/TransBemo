import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TransBemo 文档',
  description: 'TransBemo 项目文档',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'API 文档', link: '/speechTransAPI' },
      { text: '开发文档', link: '/dev-CN' }
    ],
    sidebar: [
      {
        text: 'API 文档',
        items: [
          { text: '语音翻译 API', link: '/speechTransAPI' },
          { text: '文本翻译 API', link: '/textTransAPI' }
        ]
      },
      {
        text: '开发文档',
        items: [
          { text: '中文开发文档', link: '/dev-CN' },
          { text: '英文开发文档', link: '/dev' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/TransBemo' }
    ]
  }
})