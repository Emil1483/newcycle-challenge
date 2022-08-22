import * as THREE from 'three';
import { Item, User } from "./interfaces";
import { MeshWrapper } from "./mesh_wrapper";

export class UserMeshWrapper extends MeshWrapper {
    constructor(public data: User) {
        super(
            new THREE.Mesh(
                new THREE.BoxGeometry(0.075, 0.075, 0.01),
                new THREE.MeshLambertMaterial({ color: 0xff8181, side: 2 }),
            ),
            new THREE.Vector3(data.position.lat, data.position.lng),
        )
    }

    update(): void { }

    addItem(item: Item) {
        this.data.items.push(item)
    }

    removeItem(itemId: string) {
        const indexToRemove = this.data.items.findIndex(i => i.id == itemId)
        this.data.items.splice(indexToRemove, 1)
    }
}