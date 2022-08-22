export interface Position {
    lng: number
    lat: number
}

export interface User {
    uid: string
    position: Position
    items: Item[]
}

export interface Item {
    id: string
}

export interface UserCreation {
    discriminator: 'UserCreation'
    happenedAt: number
    uid: string
    position: Position
}

export interface ItemCreation {
    discriminator: 'ItemCreation'
    happenedAt: number
    ownerUid: string
    item: Item
}

export interface ItemTransfer {
    discriminator: 'ItemTransfer'
    happenedAt: number
    itemId: string
    toUid: string
}

export type InteractionEvent = UserCreation | ItemCreation | ItemTransfer