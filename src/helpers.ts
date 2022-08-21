export function chooseRandomlyBetween<T>(
    functions: {
        probability: number,
        value: T
    }[]
): T {
    const probabilities = functions.map(f => f.probability)
    const indexes = []
    let i = 0
    for (const probability of probabilities) {
        indexes.push(...Array(probability).fill(i))
        i++
    }
    const index = indexes[Math.floor(Math.random() * indexes.length)]
    return functions[index].value
}

export function randomElementIn<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)]
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}