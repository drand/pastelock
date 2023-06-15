const { build } = require('esbuild')

const options = {
    entryPoints: ['./src/client/index.tsx'],
    outfile: './public/app.js',
    bundle: true,
    minify: true,
    define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.API_URL': '"https://pastelock.drand.love"',
    },
}

build(options).catch(err => {
    console.error(err)
    process.exit(1)
})