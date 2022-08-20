import { InteractionEvent, ItemCreation, ItemTransfer, UserCreation } from './interfaces';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function* InteractionStream(): AsyncGenerator<InteractionEvent> {
    yield <UserCreation>{
        discriminator: 'UserCreation',
        uid: 'a',
        position: {
            lat: 59.8771635,
            lng: 10.4736327,
        }
    }
    yield <UserCreation>{
        discriminator: 'UserCreation',
        uid: 'b',
        position: {
            lat: 60.391823,
            lng: 5.3271424,
        }
    }
    await sleep(2000)
    yield <ItemCreation>{
        discriminator: 'ItemCreation',
        id: 'x',
        ownerUid: 'a',
    }
    await sleep(2000)
    yield <ItemTransfer>{
        discriminator: 'ItemTransfer',
        itemId: 'x',
        toUid: 'b',
    }
    await sleep(2000)
    yield <ItemTransfer>{
        discriminator: 'ItemTransfer',
        itemId: 'x',
        toUid: 'a',
    }
    await sleep(2000)
    yield <ItemTransfer>{
        discriminator: 'ItemTransfer',
        itemId: 'x',
        toUid: 'b',
    }
}

export async function listenToInteractionStream(callback: (event: InteractionEvent) => void) {
    for await (const val of InteractionStream()) {
        callback(val)
    }
}