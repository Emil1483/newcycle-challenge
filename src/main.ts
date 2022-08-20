const canvas = document.querySelector('canvas')!

const c = canvas.getContext('2d')!

canvas.width = innerWidth
canvas.height = innerHeight

export const width = canvas.width
export const height = canvas.height

const keysPressed: Array<string> = []

addEventListener('keydown', (event) => {
    const index = keysPressed.indexOf(event.key)
    if (index == -1) {
        keysPressed.push(event.key)
    }
})
addEventListener('keyup', (event) => {
    const index = keysPressed.indexOf(event.key)
    keysPressed.splice(index, 1)
})

export function pressing(char: string): boolean {
    const index = keysPressed.map((c) => c.toLowerCase()).indexOf(char)
    return index != -1
}

function draw() {
    requestAnimationFrame(draw)

    c.fillStyle = 'black'
    c.fillRect(0, 0, width, height)
}

draw()