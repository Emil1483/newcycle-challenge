const Mappa = require('mappa-mundi');

const mappa = new Mappa('Leaflet');

const options = {
    lat: 64.96,
    lng: 16.33,
    zoom: 5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

const map = mappa.tileMap(options);

const canvas = document.querySelector('canvas')!

map.overlay(canvas);

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

    const asker = map.latLngToPixel(59.8348696, 10.4366089)

    c.clearRect(0, 0, width, height)

    c.beginPath()
    c.arc(asker.x, asker.y, 5, 0, Math.PI * 2)
    c.fillStyle = 'black'
    c.fill()
}

draw()