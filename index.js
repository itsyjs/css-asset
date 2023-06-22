const PLACEHOLDER = '@itsy-css-asset;'

export default function() {
  let _config
  return {
    name: 'itsy:css-asset',
    enforce: 'post',
    apply: 'build',
    configResolved: (config) => _config = config,
    generateBundle(_, bundle) {
      const bundleFiles = Object.values(bundle)
      const relevantFiles = bundleFiles.filter(f => f.type === 'chunk').filter(f => f.code.match(PLACEHOLDER))
      if (!relevantFiles.length) return
      const base = _config.env.BASE_URL
      const withBase = p => new URL(p, base).href
      const cssFiles = bundleFiles.filter(f => f.type === 'asset' && f.fileName.includes('.css')).map(f => withBase(f.fileName))
      const replacementString = cssFiles.map(s => `@import '${s}';`).join('')
      for (const file of relevantFiles) file.code = file.code.replace(PLACEHOLDER, replacementString)
    }
  }
}
