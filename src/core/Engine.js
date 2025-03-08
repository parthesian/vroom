import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { InputManager } from './InputManager';
import { AssetManager } from './AssetManager';

export class Engine {
    constructor() {
        // Initialize core properties
        this.clock = new THREE.Clock();
        this.isRunning = false;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Initialize managers
        this.assetManager = new AssetManager();
        this.inputManager = new InputManager();
        this.sceneManager = new SceneManager(this);

        // Add canvas to document
        document.body.appendChild(this.renderer.domElement);

        // Bind methods
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        // Add event listeners
        window.addEventListener('resize', this.onWindowResize, false);
    }

    async init() {
        try {
            // Initialize all managers
            await this.assetManager.init();
            await this.sceneManager.init();
            this.inputManager.init();

            // Hide loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }

            // Start game loop
            this.start();
        } catch (error) {
            console.error('Failed to initialize engine:', error);
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.clock.start();
            this.update();
        }
    }

    stop() {
        this.isRunning = false;
        this.clock.stop();
    }

    update() {
        if (!this.isRunning) return;

        // Get delta time
        const deltaTime = this.clock.getDelta();

        // Update managers
        this.inputManager.update(deltaTime);
        this.sceneManager.update(deltaTime);

        // Render
        this.render();

        // Request next frame
        requestAnimationFrame(this.update);
    }

    render() {
        this.renderer.render(
            this.sceneManager.getCurrentScene(),
            this.sceneManager.getCurrentCamera()
        );
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setSize(width, height);
        this.sceneManager.onWindowResize(width, height);
    }

    dispose() {
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);

        // Dispose managers
        this.sceneManager.dispose();
        this.inputManager.dispose();
        this.assetManager.dispose();

        // Dispose renderer
        this.renderer.dispose();
    }
} 