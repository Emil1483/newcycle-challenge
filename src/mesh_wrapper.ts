import * as THREE from 'three';
import { easeOutBackCurve } from './helpers';
import { camera, HEIGHT, map, scene, WIDTH } from './map';

export abstract class MeshWrapper {
    animateInValue = 0

    constructor(public mesh: THREE.Mesh, public pos: THREE.Vector3) { }

    show() {
        if (this.animateInValue < 1) {
            this.animateInValue += 0.02
        } else {
            this.animateInValue = 1
        }

        const pos = map.latLngToPixel(this.pos.x, this.pos.y)
        const vector = new THREE.Vector3()
        vector.set((pos.x / WIDTH) * 2 - 1, -(pos.y / HEIGHT) * 2 + 1, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = -camera.position.z / dir.z
        const newPos = camera.position.clone().add(dir.multiplyScalar(distance))

        this.mesh.position.set(newPos.x, newPos.y, newPos.z)


        if (map.map) {
            const pitch = map.map.transform._pitch
            const angle = map.map.transform.angle
            const scale = map.map.transform.scale * easeOutBackCurve(this.animateInValue)

            this.mesh.scale.set(scale, scale, scale)
            this.mesh.rotation.x = -pitch
            this.mesh.rotation.z = -angle


            const v = new THREE.Vector3(0, 0, 1)
            v.applyAxisAngle(new THREE.Vector3(1, 0, 0), -pitch)
            v.multiplyScalar(this.pos.z * scale + 2)
            this.mesh.position.add(v)
        }


        scene.add(this.mesh)
    }

    abstract update(): void
}