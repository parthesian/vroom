import * as THREE from 'three';

export class AssetManager {
    constructor() {
        // Initialize loaders
        this.textureLoader = new THREE.TextureLoader();
        this.audioLoader = new THREE.AudioLoader();

        // Asset caches
        this.textures = new Map();
        this.geometries = new Map();
        this.materials = new Map();
        this.sounds = new Map();
    }

    async init() {
        // Load default assets
        await this.loadDefaultAssets();
    }

    async loadDefaultAssets() {
        try {
            // Create default geometries
            this.createDefaultGeometries();
            
            // Create default materials
            this.createDefaultMaterials();

        } catch (error) {
            console.error('Failed to load default assets:', error);
        }
    }

    createDefaultGeometries() {
        // Ground plane
        this.geometries.set('ground', new THREE.PlaneGeometry(100, 100));
        
        // Player placeholder
        this.geometries.set('player', new THREE.BoxGeometry(1, 2, 1));
    }

    createDefaultMaterials() {
        // Default material for testing
        this.materials.set('default', new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.7,
            metalness: 0.0
        }));

        // Ground material (using checkerboard pattern)
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x999999,
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Create a checkerboard pattern
        const size = 512;
        const data = new Uint8Array(size * size * 4);
        const tileSize = 32;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const offset = (i * size + j) * 4;
                const isEven = ((Math.floor(i / tileSize) + Math.floor(j / tileSize)) % 2) === 0;
                const color = isEven ? 200 : 150;
                
                data[offset] = color;     // R
                data[offset + 1] = color; // G
                data[offset + 2] = color; // B
                data[offset + 3] = 255;   // A
            }
        }

        const groundTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(4, 4);
        groundTexture.needsUpdate = true;

        groundMaterial.map = groundTexture;
        this.materials.set('ground', groundMaterial);

        // Player materials for different forms
        this.materials.set('player_default', new THREE.MeshStandardMaterial({
            color: 0x4444ff,
            roughness: 0.3,
            metalness: 0.7
        }));

        this.materials.set('player_rain', new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.8
        }));

        this.materials.set('player_wind', new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.7
        }));

        this.materials.set('player_lightning', new THREE.MeshStandardMaterial({
            color: 0xffff00,
            roughness: 0.0,
            metalness: 1.0,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        }));

        this.materials.set('player_snow', new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.1
        }));
    }

    async loadTexture(name, url) {
        if (this.textures.has(name)) {
            return this.textures.get(name);
        }

        try {
            const texture = await this.textureLoader.loadAsync(url);
            this.textures.set(name, texture);
            return texture;
        } catch (error) {
            console.error(`Failed to load texture ${name}:`, error);
            throw error;
        }
    }

    async loadSound(name, url) {
        if (this.sounds.has(name)) {
            return this.sounds.get(name);
        }

        try {
            const buffer = await this.audioLoader.loadAsync(url);
            this.sounds.set(name, buffer);
            return buffer;
        } catch (error) {
            console.error(`Failed to load sound ${name}:`, error);
            throw error;
        }
    }

    getGeometry(name) {
        return this.geometries.get(name);
    }

    getMaterial(name) {
        return this.materials.get(name);
    }

    getTexture(name) {
        return this.textures.get(name);
    }

    getSound(name) {
        return this.sounds.get(name);
    }

    dispose() {
        // Dispose textures
        this.textures.forEach(texture => texture.dispose());
        this.textures.clear();

        // Dispose geometries
        this.geometries.forEach(geometry => geometry.dispose());
        this.geometries.clear();

        // Dispose materials
        this.materials.forEach(material => material.dispose());
        this.materials.clear();

        // Clear sounds
        this.sounds.clear();
    }
} 