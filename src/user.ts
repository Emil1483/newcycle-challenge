import { Vector } from "vector2d";
import { CanvasObject } from "./canvas_object";
import { Item, User } from "./interfaces";
import { context } from "./main";

export class UserObject extends CanvasObject {
    constructor(public data: User) {
        super(new Vector(data.position.lat, data.position.lng))
    }

    update(): void {}
    
    show(): void {
        context.beginPath()
        context.arc(this.mapPos().x, this.mapPos().y, 5, 0, Math.PI * 2)
        context.strokeStyle = 'black'
        context.lineWidth = 2
        context.stroke()
    }

    addItem(item: Item) {
        this.data.items.push(item)
    }

    removeItem(itemId: string) {
        const indexToRemove = this.data.items.findIndex(i => i.id == itemId)
        this.data.items.splice(indexToRemove, 1)
    }
}