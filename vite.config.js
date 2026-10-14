import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const workspace = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/')
function privateProjectPath(path) {
  const normalized = path.replace(/\\/g, '/')
  const relative = normalized.includes(workspace) ? normalized.slice(normalized.indexOf(workspace) + workspace.length) : normalized.replace(/^\/+/, '')
  return /^(?:functions|tests|scripts|artifacts|dist|\.cache|\.git|\.review-backups)(?:\/|$)/i.test(relative)
}
function assessmentBoundary() {
  return {
    name: 'assessment-private-boundary',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let path = (request.url || '').split('?')[0].replace(/\\/g, '/')
        try { for (let i = 0; i < 3; i++) path = decodeURIComponent(path) } catch { response.statusCode = 400; response.end('Invalid path'); return }
        if (privateProjectPath(path) || /\.map$/i.test(path)) { response.statusCode = 403; response.end('Private source is not served.'); return }
        next()
      })
    },
    generateBundle(_, bundle) {
      for (const [name, artifact] of Object.entries(bundle)) {
        if (name.endsWith('.map') || (artifact.type === 'chunk' && artifact.map)) this.error('Production source maps are prohibited for this release.')
        if (artifact.type === 'chunk') for (const module of Object.keys(artifact.modules)) {
          if (privateProjectPath(module)) this.error('Private assessment source entered a browser bundle: ' + module)
        }
      }
    },
  }
}
export default defineConfig({
  plugins: [react(), assessmentBoundary()],
  build: { sourcemap: false },
  server: {
    fs: { deny: ['.env', '.env.*', ...['.git', 'functions', 'tests', 'scripts', 'artifacts', '.cache', '.review-backups', 'dist'].map(directory => workspace + directory + '/**')] },
    watch: { ignored: ['**/.cache/**', '**/.review-backups/**', '**/functions/**'] },
  },
})
