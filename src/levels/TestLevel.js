import * as THREE from 'three';
import { Player } from '../entities/Player';

export class TestLevel {
    constructor(engine) {
        this.engine = engine;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        this.isInitialized = false;
        this.player = null;
    }

    async init() {
        // Set up scene
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue

        // Set up camera
        this.camera.position.set(0, 8, 20); // Increased height to 8
        this.camera.lookAt(0, 2, 0); // Looking slightly above ground level

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Create ground
        const groundGeometry = this.engine.assetManager.getGeometry('ground');
        const groundMaterial = this.engine.assetManager.getMaterial('ground') || 
                             this.engine.assetManager.getMaterial('default');
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);

        // Add grid helper to visualize tiles
        const gridHelper = new THREE.GridHelper(100, 50, 0x000000, 0x000000);
        gridHelper.position.y = 0.01; // Slightly above ground to prevent z-fighting
        this.scene.add(gridHelper);

        // Create player
        this.player = new Player(this.engine);
        await this.player.init();
        this.scene.add(this.player.mesh);

        this.isInitialized = true;
    }

    update(deltaTime) {
        if (!this.isInitialized) return;

        // Update player
        this.player.update(deltaTime);

        // Update grass animation - only if the uniforms exist
        if (this.ground && this.ground.material.uniforms && 
            this.ground.material.uniforms.time && 
            this.ground.material.uniforms.playerPosition) {
            this.ground.material.uniforms.time.value += deltaTime;
            this.ground.material.uniforms.playerPosition.value.copy(this.player.mesh.position);
        }

        // Update camera to follow player
        const idealOffset = new THREE.Vector3(0, 8, 20);
        const idealLookat = new THREE.Vector3(0, 2, 0);
        
        // Transform ideal camera position relative to player position
        const offset = idealOffset.clone();
        offset.applyQuaternion(this.player.mesh.quaternion);
        offset.add(this.player.mesh.position);
        
        // Transform ideal lookat position relative to player position
        const lookat = idealLookat.clone();
        lookat.applyQuaternion(this.player.mesh.quaternion);
        lookat.add(this.player.mesh.position);
        
        // Smoothly move camera
        this.camera.position.lerp(offset, 0.1);
        
        // Make camera look at player
        const currentLookat = new THREE.Vector3();
        this.camera.getWorldDirection(currentLookat);
        const targetLookat = lookat.clone().sub(this.camera.position).normalize();
        const lerpedLookat = currentLookat.lerp(targetLookat, 0.1);
        this.camera.lookAt(this.camera.position.clone().add(lerpedLookat));
    }

    onWindowResize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    dispose() {
        // Dispose geometries and materials
        this.scene.traverse(object => {
            if (object instanceof THREE.Mesh) {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
        });

        // Clear scene
        while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Dispose player
        if (this.player) {
            this.player.dispose();
        }
    }
} 