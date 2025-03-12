import childProcess from 'child_process'

const mode = process.env.MODE

const workProcess = childProcess.exec(
    `vue-tsc --noEmit && cross-env NODE_ENV=production vite build --mode ${mode} && node build/remove.js`,
    { maxBuffer: 2048 * 2048 },
    error => {
        if (error) {
            console.log(error)
            return
        }
    }
)

// @ts-ignore
workProcess.stdout.on('data', data => {
    console.log(data)
})
