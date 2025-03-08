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
        // Ground plane with grass blades
        const groundSize = 100;
        const segments = 100; // Increased segments for more grass
        const grassBladeHeight = 1.5; // Increased height
        const bladeWidth = 0.2; // Wider blades
        
        // Create base ground geometry
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, segments, segments);
        
        // Add grass blade vertices by extruding some vertices upward
        const positions = groundGeometry.attributes.position.array;
        const uvs = groundGeometry.attributes.uv.array;
        
        // Create arrays for the grass blade geometry
        const grassVertices = [];
        const grassUvs = [];
        const grassIndices = [];
        
        // For each vertex in the ground plane
        for(let i = 0; i < positions.length; i += 3) {
            // Add ground vertex
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // Only add grass blades periodically
            if(Math.random() < 0.6) { // Increased probability for more density
                // Create a grass blade (two triangles forming a quad)
                const randRotation = Math.random() * Math.PI * 2;
                const randHeight = grassBladeHeight * (0.7 + Math.random() * 0.6); // More height variation
                
                // Calculate blade corners with random rotation
                const c = Math.cos(randRotation) * bladeWidth;
                const s = Math.sin(randRotation) * bladeWidth;
                
                // Base vertices (bottom corners of the blade)
                const baseLeft = [x - c, y, z - s];
                const baseRight = [x + c, y, z + s];
                
                // Tip vertices (top corners of the blade, with more random spread)
                const tipX = x + (Math.random() - 0.5) * 0.3;
                const tipZ = z + (Math.random() - 0.5) * 0.3;
                const tipLeft = [tipX - c * 0.3, y + randHeight, tipZ - s * 0.3];
                const tipRight = [tipX + c * 0.3, y + randHeight, tipZ + s * 0.3];
                
                // Add vertices
                const vertexStart = grassVertices.length / 3;
                grassVertices.push(
                    ...baseLeft, ...baseRight,
                    ...tipLeft, ...tipRight
                );
                
                // Add UVs
                grassUvs.push(
                    0, 0,  1, 0,  // Base UVs
                    0, 1,  1, 1   // Tip UVs
                );
                
                // Add indices for two triangles
                grassIndices.push(
                    vertexStart, vertexStart + 1, vertexStart + 2,     // First triangle
                    vertexStart + 1, vertexStart + 3, vertexStart + 2  // Second triangle
                );
            }
            
            // Add ground vertex
            grassVertices.push(x, y, z);
            grassUvs.push(uvs[i/3*2], uvs[i/3*2 + 1]);
        }
        
        // Create the grass geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(grassVertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(grassUvs, 2));
        geometry.setIndex(grassIndices);
        
        // Debug logging
        console.log('Grass Geometry Debug:');
        console.log('Number of vertices:', grassVertices.length / 3);
        console.log('Number of grass blades:', grassIndices.length / 6);
        
        // Store the geometry
        this.geometries.set('ground', geometry);
        
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

        // Ground material (grass shader) - Enhanced version
        const testVertexShader = `
            uniform float time;
            varying vec2 vUv;
            varying float vHeight;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Only animate vertices that are part of grass blades (UV.y > 0)
                if(uv.y > 0.0) {
                    // Add some wave motion
                    float wave = sin(time * 1.5 + position.x * 0.5 + position.z * 0.5) * 0.2;
                    pos.x += wave * uv.y; // More movement at the top
                    pos.z += wave * uv.y;
                    
                    // Add some random variation
                    float random = fract(sin(dot(vec2(position.x, position.z), vec2(12.9898, 78.233))) * 43758.5453);
                    pos.x += sin(time * (1.5 + random)) * 0.1 * uv.y;
                    pos.z += cos(time * (1.5 + random)) * 0.1 * uv.y;
                }
                
                vHeight = uv.y;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

        const testFragmentShader = `
            varying vec2 vUv;
            varying float vHeight;
            
            void main() {
                // Create a gradient from dark green at base to light green at tip
                vec3 bottomColor = vec3(0.1, 0.4, 0.0);
                vec3 topColor = vec3(0.3, 0.8, 0.1);
                vec3 color = mix(bottomColor, topColor, vHeight);
                
                // Add some variation
                float variation = sin(vUv.x * 10.0) * 0.1;
                color += vec3(variation);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const grassMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide
        });

        // Debug logging
        console.log('Testing enhanced shader with animation...');
        
        this.materials.set('ground', grassMaterial);

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