import { Vector } from "vector2d"
import { Position } from "./interfaces"

export function chooseRandomlyBetween<T>(
    functions: {
        probability: number,
        value: T
    }[]
): T {
    const sum = functions.reduce((a, b) => a + b.probability, 0)
    const probabilities = functions.map(f => f.probability / sum)

    const r = Math.random()
    let partialSum = 0
    for (let i = 0; i < probabilities.length; i++) {
        partialSum += probabilities[i]
        if (r < partialSum) return functions[i].value
    }
    return functions[functions.length - 1].value
}

export function randomElementIn<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)]
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function vectorWithRandomOffsetFrom(position: Position, r: number) {
    return new Vector(
        position.lat + Math.random() * r * 2 - r,
        position.lng + Math.random() * r - r / 2,
    )
}

export function vectorFrom(position: Position) {
    return new Vector(position.lat, position.lng)
}