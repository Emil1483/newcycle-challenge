import { InteractionEvent } from './interfaces';

// function sleep(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const users: User[] = []
// const items: Item[] = []

async function* InteractionStream(): AsyncGenerator<InteractionEvent> {
    const response = await fetch('src/places.json')
    console.log(await response.json())
}

export async function listenToInteractionStream(callback: (event: InteractionEvent) => void) {
    for await (const val of InteractionStream()) {
        callback(val)
    }
}