import { AbstractVector, Vector } from 'vector2d';
import { map } from './main';

export abstract class CanvasObject {
    constructor(public pos: AbstractVector) { }

    mapPos(): AbstractVector {
        const pos = map.latLngToPixel(this.pos.x, this.pos.y)
        return new Vector(pos.x, pos.y)
    }

    abstract update(): void
    abstract show(): void
}