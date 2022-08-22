import * as THREE from 'three'
import { listenToInteractionStream } from './interaction_stream'
import { ItemCreation, ItemTransfer, UserCreation } from './interfaces'
import { ItemMeshWrapper } from './item'
import { MeshWrapper } from './mesh_wrapper'
import { UserMeshWrapper } from './user'

const Mappa = require('mappa-mundi')

const users: UserMeshWrapper[] = []
const items: ItemMeshWrapper[] = []

function allMeshWrappers(): MeshWrapper[] {
  return [...users, ...items]
}

export const WIDTH = innerWidth
export const HEIGHT = innerHeight
const VIEW_ANGLE = 45
const ASPECT = WIDTH / HEIGHT
const NEAR = 0.1
const FAR = 10000

export const scene = new THREE.Scene()
export const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
const canvas = document.querySelector('canvas')!
const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas })

camera.position.z = 300
scene.add(camera)
renderer.setSize(WIDTH, HEIGHT)

const light = new THREE.PointLight(0xffffff, 1.2)
light.position.set(0, 0, 200)
scene.add(light)

const options = {
  lat: 64.96,
  lng: 15.93,
  zoom: 4.5,
  pitch: VIEW_ANGLE,
}

const mappa = new Mappa('MapboxGL', process.env.MAPBOX_KEY)
export const map = mappa.tileMap(options)
map.overlay(canvas)

function draw() {
  requestAnimationFrame(draw)

  allMeshWrappers().forEach(m => m.update())

  allMeshWrappers().forEach(m => m.show())

  renderer.render(scene, camera)
}

draw()

function onUserCreation(event: UserCreation) {
  users.push(new UserMeshWrapper({
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
  items.push(new ItemMeshWrapper(event.item, users[userIndex].data))
}

function onItemTransfer(event: ItemTransfer) {
  const fromUserIndex = users.findIndex(u => u.data.items.map(i => i.id).includes(event.itemId))
  const toUserIndex = users.findIndex(u => u.data.uid == event.toUid)

  if (fromUserIndex == toUserIndex) {
      throw new Error('Do not transfer item to its owner')
  }

  users[fromUserIndex].removeItem(event.itemId)
  users[toUserIndex].addItem({ id: event.itemId })

  const itemIndex = items.findIndex(i => i.data.id == event.itemId)
  items[itemIndex].updateOwner(users[toUserIndex].data)
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