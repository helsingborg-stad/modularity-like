import { createViteConfig } from 'vite-config-factory'

const entries = {
    'js/like-posts': './source/js/like-posts.ts',
    'css/like-posts': './source/sass/like-posts.scss',
}

export default createViteConfig(entries, {
    outDir: 'dist',
    manifestFile: 'manifest.json'
})