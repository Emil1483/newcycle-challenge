import { chooseRandomlyBetween, randomElementIn, sleep } from './helpers';
import { InteractionEvent, Item, ItemCreation, ItemTransfer, Position, User, UserCreation } from './interfaces';

const users: User[] = []

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
    const owner = randomElementIn(users)
    
    let numItems = 0
    for (const user of users) {
        numItems += user.items.length
    }

    const item: Item = {
        id: numItems.toString(),
    }

    owner.items.push(item)

    return <ItemCreation>{
        discriminator: 'ItemCreation',
        item: item,
        ownerUid: owner.uid
    }
}

async function buildItemTransferEvent(): Promise<ItemTransfer> {
    const usersWithItems = users.filter(u => u.items.length > 0)
    const fromUser = randomElementIn(usersWithItems)
    const toUser = randomElementIn(users)

    const itemToTransfer = fromUser.items.splice(0)[0]
    toUser.items.push(itemToTransfer)
    return {
        discriminator: 'ItemTransfer',
        itemId: itemToTransfer.id,
        toUid: toUser.uid,
    }
}

async function* InteractionStream(): AsyncGenerator<InteractionEvent> {
    yield await buildUserCreationEvent()
    await sleep(1000)
    yield await buildItemCreationEvent()
    await sleep(1000)

    while (true) {
        await sleep(1000)
        const buildEvent = chooseRandomlyBetween<() => Promise<InteractionEvent>>([
            {
                probability: 1,
                value: buildUserCreationEvent
            },
            {
                probability: 1,
                value: buildItemCreationEvent
            },
            {
                probability: 1,
                value: buildItemTransferEvent
            },
        ])
        yield await buildEvent()
    }
}

export async function listenToInteractionStream(callback: (event: InteractionEvent) => void) {
    for await (const val of InteractionStream()) {
        callback(val)
    }
}