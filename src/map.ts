import * as THREE from 'three'
const Mappa = require('mappa-mundi')

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

export function renderScene() {
    renderer.render(scene, camera)
}