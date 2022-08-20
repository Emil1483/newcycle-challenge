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
    uid: string
    position: Position
}

export interface ItemCreation {
    discriminator: 'ItemCreation'
    ownerUid: string
    id: string
}

export interface ItemTransfer {
    discriminator: 'ItemTransfer'
    itemId: string
    toUid: string
}

export type InteractionEvent = UserCreation | ItemCreation | ItemTransfer