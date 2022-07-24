import esbuild from 'esbuild'
import fs from 'node:fs/promises'
import { promisify } from 'node:util'
import { gzip as _gzip } from 'node:zlib'
const gzip = promisify(_gzip)
const gzipSize = async (filename) => (await gzip(await fs.readFile(filename))).byteLength

/** @type esbuild.BuildOptions */
const options = {
  entryPoints: {
    'index': 'src/index.ts',
    'styles.min': 'styles.css',
    'styles2.min': 'styles2.css',
  },
  outdir: '.',
  bundle: true,
  minify: true,
  plugins: [{
    name: 'gzip-size',
    setup(build) {
      build.onEnd(async () => {
        const [index, styles, styles2] = await Promise.all(['index.js', 'styles.min.css', 'styles2.min.css'].map(gzipSize))
        console.log(`       index.js: ${index} bytes`)
        console.log(` styles.min.css: ${styles} bytes`)
        console.log(`styles2.min.css: ${styles2} bytes`)
      })
    },
  }],
}

if (process.argv.includes('--serve')) {
  esbuild.serve({ servedir: '.' }, options).then(({ port }) => console.log(`http://localhost:${port}`))
} else {
  esbuild.build(options)
}
