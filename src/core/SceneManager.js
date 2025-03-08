import * as THREE from 'three';
import { TestLevel } from '../levels/TestLevel';

export class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.currentScene = null;
        this.currentCamera = null;
        this.scenes = new Map();
    }

    async init() {
        // Create and add test level
        const testLevel = new TestLevel(this.engine);
        this.addScene('test', testLevel);
        
        // Set initial scene
        await this.setScene('test');
    }

    addScene(name, scene) {
        this.scenes.set(name, scene);
    }

    async setScene(name) {
        // Check if scene exists
        if (!this.scenes.has(name)) {
            throw new Error(`Scene ${name} does not exist`);
        }

        // Get new scene
        const newScene = this.scenes.get(name);

        // Initialize scene if needed
        if (!newScene.isInitialized) {
            await newScene.init();
        }

        // Update current scene and camera
        this.currentScene = newScene.scene;
        this.currentCamera = newScene.camera;
    }

    getCurrentScene() {
        return this.currentScene;
    }

    getCurrentCamera() {
        return this.currentCamera;
    }

    update(deltaTime) {
        // Update current scene
        if (this.currentScene) {
            const scene = Array.from(this.scenes.values()).find(s => s.scene === this.currentScene);
            if (scene) {
                scene.update(deltaTime);
            }
        }
    }

    onWindowResize(width, height) {
        // Update camera aspect ratio
        if (this.currentCamera instanceof THREE.PerspectiveCamera) {
            this.currentCamera.aspect = width / height;
            this.currentCamera.updateProjectionMatrix();
        }

        // Update current scene
        const scene = Array.from(this.scenes.values()).find(s => s.scene === this.currentScene);
        if (scene && scene.onWindowResize) {
            scene.onWindowResize(width, height);
        }
    }

    dispose() {
        // Dispose all scenes
        this.scenes.forEach(scene => {
            if (scene.dispose) {
                scene.dispose();
            }
        });

        this.scenes.clear();
        this.currentScene = null;
        this.currentCamera = null;
    }
} 