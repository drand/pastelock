const { build } = require('esbuild')

const options = {
    stdio: 'inherit',
    entryPoints: ['./src/client/index.tsx'],
    outfile: './public/app.js',
    bundle: true,
    minify: true,
    define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.API_URL': '"http://localhost:4444"',
    },
}

build(options).catch(() => process.exit(1))