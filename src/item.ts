import { AbstractVector } from "vector2d";
import { CanvasObject } from "./canvas_object";
import { vectorWithRandomOffsetFrom } from "./helpers";
import { Item, User } from "./interfaces";
import { context } from './main';

export class ItemObject extends CanvasObject {
    timeToTransfer = 2
    desiredPos: AbstractVector
    prevPos: AbstractVector
    a = 0
    animating = false

    constructor(public data: Item, private owner: User) {
        super(vectorWithRandomOffsetFrom(owner.position, 0.08))
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
        context.arc(this.mapPos().x, this.mapPos().y, 2, 0, Math.PI * 2)
        context.fillStyle = 'rgba(0, 0, 0, 0.75)'
        context.fill()
    }

    updateOwner(newOwner: User) {
        this.owner = newOwner
        this.desiredPos = vectorWithRandomOffsetFrom(this.owner.position, 0.08)
        this.prevPos = this.pos.clone()
        this.animating = true
        this.a = 0
    }
}