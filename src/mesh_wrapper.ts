import * as THREE from 'three';
import { camera, HEIGHT, map, scene, WIDTH } from './main';

export abstract class MeshWrapper {
    constructor(public mesh: THREE.Mesh, public pos: THREE.Vector3) { }

    show() {
        const pos = map.latLngToPixel(this.pos.x, this.pos.y);
        const vector = new THREE.Vector3()
        vector.set((pos.x / WIDTH) * 2 - 1, -(pos.y / HEIGHT) * 2 + 1, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

        this.mesh.position.set(newPos.x, newPos.y, newPos.z);


        if (map.map) {
            const pitch = map.map.transform._pitch

            this.mesh.scale.x = map.map.transform.scale
            this.mesh.scale.y = map.map.transform.scale
            this.mesh.scale.z = map.map.transform.scale
            this.mesh.rotation.x = -pitch


            const v = new THREE.Vector3(0, 0, 1)
            v.applyAxisAngle(new THREE.Vector3(1, 0, 0), -pitch)
            v.multiplyScalar(this.pos.z)
            this.mesh.position.add(v)
        }


        scene.add(this.mesh);
    }

    abstract update(): void
}