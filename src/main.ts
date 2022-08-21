import { CanvasObject } from './canvas_object';
import { listenToInteractionStream } from "./interaction_stream";
import { ItemCreation, ItemTransfer, UserCreation } from './interfaces';
import { ItemObject } from './item';
import { UserObject } from './user';

const Mappa = require('mappa-mundi');

const mappa = new Mappa('Leaflet');

const options = {
    lat: 64.96,
    lng: 16.33,
    zoom: 5,
    style: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'
}

export const map = mappa.tileMap(options);

const canvas = document.querySelector('canvas')!

map.overlay(canvas);

export const context = canvas.getContext('2d')!

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

const users: UserObject[] = []
const items: ItemObject[] = []

function draw() {
    requestAnimationFrame(draw)
    context.clearRect(0, 0, width, height)

    const canvasObjects: CanvasObject[] = [...users, ...items]

    for (const o of canvasObjects) {
        o.update()
    }
    for (const o of canvasObjects) {
        o.show()
    }
}

draw()

function onUserCreation(event: UserCreation) {
    users.push(new UserObject({
        items: [],
        position: event.position,
        uid: event.uid
    }))
}

function onItemCreation(event: ItemCreation) {
    const userIndex = users.findIndex(u => u.data.uid == event.ownerUid)
    if (userIndex == -1) {
        throw new Error(`Could not find user with uid ${event.ownerUid}`)
    }

    users[userIndex].addItem(event.item)
    items.push(new ItemObject(event.item, users[userIndex].data.position))
}

function onItemTransfer(event: ItemTransfer) {
    const fromUserIndex = users.findIndex(u => u.data.items.map(i => i.id).includes(event.itemId))
    users[fromUserIndex].removeItem(event.itemId)
    
    const toUserIndex = users.findIndex(u => u.data.uid == event.toUid)
    users[toUserIndex].addItem({id: event.itemId})

    const itemIndex = items.findIndex(i => i.data.id == event.itemId)
    items[itemIndex].updatePosition(users[toUserIndex].pos)
}

listenToInteractionStream((event) => {
    if (event.discriminator == 'UserCreation') {
        onUserCreation(event)
    } else if (event.discriminator == 'ItemCreation') {
        onItemCreation(event)
    } else if (event.discriminator == 'ItemTransfer') {
        onItemTransfer(event)
    }
})