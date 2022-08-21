import { chooseRandomlyBetween, randomElementIn, sleep, vectorFrom } from './helpers';
import { InteractionEvent, Item, ItemCreation, ItemTransfer, Position, User, UserCreation } from './interfaces';

const users: User[] = []

function itemsCount(): number {
    let itemsCount = 0
    for (const user of users) {
        itemsCount += user.items.length
    }
    return itemsCount
}

async function buildUserCreationEvent(): Promise<UserCreation> {
    const positions = await fetch('src/positions_in_norway.json').then(r => r.json())
    const position = randomElementIn<Position>(positions)

    const newUser = {
        items: [],
        position: position,
        uid: users.length.toString(),
    }

    users.push(newUser)

    return <UserCreation>{
        discriminator: 'UserCreation',
        uid: newUser.uid,
        position: newUser.position,
    }
}

async function buildItemCreationEvent(): Promise<ItemCreation> {
    if (users.length == 0) {
        throw new Error('There must be at least one user in order to add an item')
    }

    const owner = randomElementIn(users)

    const item: Item = {
        id: itemsCount().toString(),
    }

    owner.items.push(item)

    return <ItemCreation>{
        discriminator: 'ItemCreation',
        item: item,
        ownerUid: owner.uid
    }
}

async function buildItemTransferEvent(): Promise<ItemTransfer> {
    if (users.length < 2) {
        throw new Error('We need at least 2 users in order to transfer an item')
    }

    const usersWithItems = users.filter(u => u.items.length > 0)

    if (usersWithItems.length == 0) {
        throw new Error('There are no items to transfer')
    }

    const fromUser = randomElementIn(usersWithItems)

    const toUser = chooseRandomlyBetween(users.filter(u => u.uid != fromUser.uid).map(u => {
        const distance = 5 * vectorFrom(u.position).distance(vectorFrom(fromUser.position))
        const clampedDistance = Math.max(1, distance)
        return {
            probability: 1 / Math.pow(clampedDistance, 2),
            value: u
        }
    }))

    const itemToTransfer = fromUser.items.splice(0, 1)[0]
    toUser.items.push(itemToTransfer)

    return {
        discriminator: 'ItemTransfer',
        itemId: itemToTransfer.id,
        toUid: toUser.uid,
    }
}

async function* interactionStream(): AsyncGenerator<InteractionEvent> {
    const maxUsers = 500
    const maxItems = maxUsers * 4

    yield await buildUserCreationEvent()
    yield await buildUserCreationEvent()
    while (true) {
        const userCountDot = 2 * users.length * (1 - users.length / maxUsers)
        const itemCountDot = 2.5 * users.length * (1 - itemsCount() / maxItems)
        const itemTransferCountDot = 0.01 * itemsCount()

        await sleep(1000 / (userCountDot + itemCountDot + itemTransferCountDot))

        const buildEvent = chooseRandomlyBetween<() => Promise<InteractionEvent>>([
            {
                probability: userCountDot,
                value: buildUserCreationEvent
            },
            {
                probability: itemCountDot,
                value: buildItemCreationEvent
            },
            {
                probability: itemTransferCountDot,
                value: buildItemTransferEvent
            },
        ])
        yield await buildEvent()
    }
}

export async function listenToInteractionStream(callback: (event: InteractionEvent) => void) {
    for await (const val of interactionStream()) {
        callback(val)
    }
}