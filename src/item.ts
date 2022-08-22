import * as THREE from 'three'
import { vectorWithRandomOffsetFrom } from "./helpers"
import { Item, User } from "./interfaces"
import { MeshWrapper } from "./mesh_wrapper"

export class ItemMeshWrapper extends MeshWrapper {
    timeToTransfer = 5
    desiredPos: THREE.Vector3
    prevPos: THREE.Vector3
    a = 0
    animating = false

    t = 0
    zOffset = 0

    constructor(public data: Item, private owner: User) {
        super(
            new THREE.Mesh(
                new THREE.SphereGeometry(0.025),
                new THREE.MeshLambertMaterial({ color: 0xffffff, side: 2 }),
            ),
            vectorWithRandomOffsetFrom(owner.position, 0.1),
        )

        this.desiredPos = this.pos.clone()
        this.prevPos = this.pos.clone()
    }

    material() {
        return this.mesh.material as THREE.MeshLambertMaterial
    }

    updateOwner(newOwner: User) {
        this.owner = newOwner
        this.desiredPos = vectorWithRandomOffsetFrom(this.owner.position, 0.08)
        this.prevPos = this.pos.clone()
        this.animating = true
        this.a = 0
        this.material().color = new THREE.Color( 0xff0000 )
    }

    update(): void {
        this.t += 0.015
        this.zOffset = Math.sin(this.t) * 0.15 + 0.2
        this.pos.z = this.zOffset

        if (!this.animating) return

        this.a += 1 / (60 * this.timeToTransfer)
        if (this.a >= 1) {
            this.animating = false
            this.pos = this.desiredPos.clone()
            this.material().color = new THREE.Color( 0xffffff )
            return
        }

        const diff = this.desiredPos.clone().sub(this.prevPos)
        this.pos = this.prevPos.clone().add(diff.multiplyScalar(-Math.cos(this.a * Math.PI) * 0.5 + 0.5))
        this.pos.z = Math.sin(this.a * Math.PI) * 0.4 + this.zOffset
    }
}