import * as THREE from 'three';
import { Item, User } from "./interfaces";
import { MeshWrapper } from "./mesh_wrapper";

export class UserMeshWrapper extends MeshWrapper {
    constructor(public data: User) {
        super(
            new THREE.Mesh(
                new THREE.TorusGeometry(0.1, 0.02, 16, 100),
                new THREE.MeshLambertMaterial({ color: 0xff0000, side: 2 }),
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