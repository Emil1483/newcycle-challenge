import { listenToInteractionStream } from './interaction_stream'
import { ItemCreation, ItemTransfer, UserCreation } from './interfaces'
import { ItemMeshWrapper } from './item'
import { renderScene } from './map'
import { MeshWrapper } from './mesh_wrapper'
import { UserMeshWrapper } from './user'

const dateElement = document.querySelector('#date')!
var slider = document.querySelector("#slider")! as HTMLInputElement

export let playbackSpeed = parseInt(slider.value)

const users: UserMeshWrapper[] = []
const items: ItemMeshWrapper[] = []

function allMeshWrappers(): MeshWrapper[] {
  return [...users, ...items]
}

function draw() {
  requestAnimationFrame(draw)

  allMeshWrappers().forEach(m => m.update())

  allMeshWrappers().forEach(m => m.show())

  renderScene()
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
slider.oninput = () => {
  playbackSpeed = parseInt(slider.value)
}

listenToInteractionStream((event) => {
  const date = new Date(event.happenedAt)
  dateElement.textContent = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  if (event.discriminator == 'UserCreation') {
    onUserCreation(event)
  } else if (event.discriminator == 'ItemCreation') {
    onItemCreation(event)
  } else if (event.discriminator == 'ItemTransfer') {
    onItemTransfer(event)
  }
})