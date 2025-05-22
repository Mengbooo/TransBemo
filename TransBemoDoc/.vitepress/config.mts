import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TransBemo 文档',
  description: 'TransBemo 项目文档',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '首页', link: './index.md' },
      { text: 'API 文档', link: './speechTransAPI.md' },
      { text: '开发文档', link: './dev-CN.md' }
    ],
    sidebar: [
      {
        text: 'API 文档',
        items: [
          { text: '语音翻译 API', link: './speechTransAPI.md' },
          { text: '文本翻译 API', link: './textTransAPI.md' }
        ]
      },
      {
        text: '开发文档',
        items: [
          { text: '开发文档', link: './dev-CN.md' },
          { text: '架构分析与总览', link: './dev.md' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mengbooo/TransBemo' }
    ]
  }
})