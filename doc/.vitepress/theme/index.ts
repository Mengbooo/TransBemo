 import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件或其他增强功能
  },
  setup() {
    // 在客户端加载时初始化mermaid
    if (typeof window !== 'undefined') {
      import('mermaid').then(module => {
        const mermaid = module.default
        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose'
        })
        
        // 初始化页面上已有的mermaid图表
        setTimeout(() => {
          document.querySelectorAll('.language-mermaid').forEach(el => {
            const content = el.textContent || ''
            if (content.trim()) {
              const div = document.createElement('div')
              div.className = 'mermaid'
              div.textContent = content
              el.parentNode?.replaceChild(div, el)
              try {
                mermaid.contentLoaded()
              } catch (error) {
                console.error('Mermaid初始化失败:', error)
              }
            }
          })
        }, 500)
      })
    }
  }
} 