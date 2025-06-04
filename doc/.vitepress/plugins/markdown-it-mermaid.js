/**
 * 自定义Markdown-it插件，用于处理Mermaid代码块
 */
module.exports = (md) => {
  // 保存原始的fence渲染器
  const fence = md.renderer.rules.fence.bind(md.renderer.rules);

  // 重写fence渲染器
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();
    
    // 检查是否是mermaid代码块
    if (token.info.trim() === 'mermaid') {
      return `<div class="mermaid-container">
                <pre class="mermaid">${code}</pre>
              </div>`;
    }
    
    // 对于其他代码块，使用原始渲染器
    return fence(tokens, idx, options, env, slf);
  };
}; 