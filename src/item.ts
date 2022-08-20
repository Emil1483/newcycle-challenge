import { AbstractVector, Vector } from "vector2d";
import { CanvasObject } from "./canvas_object";
import { Item, Position } from "./interfaces";
import { context } from './main';

export class ItemObject extends CanvasObject {
    timeToTransfer = 2
    desiredPos: AbstractVector
    prevPos: AbstractVector
    a = 0
    animating = false

    constructor(public data: Item, position: Position) {
        super(new Vector(position.lat, position.lng))
        this.desiredPos = this.pos.clone()
        this.prevPos = this.pos.clone()
    }

    update(): void {
        if (!this.animating) return

        this.a += 1 / (60 * this.timeToTransfer)
        if (this.a >= 1) {
            this.animating = false
            this.pos = this.desiredPos.clone()
            return
        }

        const diff = this.desiredPos.clone().subtract(this.prevPos)
        this.pos = this.prevPos.clone().add(diff.multiplyByScalar(this.a))
    }

    show(): void {
        context.beginPath()
        context.arc(this.mapPos().x, this.mapPos().y, 5, 0, Math.PI * 2)
        context.fillStyle = 'black'
        context.fill()
    }

    updatePosition(newPosition: AbstractVector) {
        this.desiredPos = newPosition.clone()
        this.prevPos = this.pos.clone()
        this.animating = true
        this.a = 0
    }
}