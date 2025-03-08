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
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

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
        if (this.player) {
            this.player.update(deltaTime);
            
            // Update camera to follow player with new horizontal perspective
            const playerPos = this.player.mesh.position;
            const cameraOffset = new THREE.Vector3(0, 8, 20); // Matching our initial camera offset
            this.camera.position.copy(playerPos).add(cameraOffset);
            this.camera.lookAt(playerPos.x, playerPos.y + 2, playerPos.z); // Looking slightly above player
        }
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