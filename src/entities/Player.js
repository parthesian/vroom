import * as THREE from 'three';
import { gsap } from 'gsap';

export class Player {
    constructor(engine) {
        this.engine = engine;
        this.mesh = null;
        this.gridPosition = new THREE.Vector2(0, 0); // Current grid position
        this.isMoving = false;
        this.currentForm = 'default';
        this.tileSize = 2; // Size of each grid tile
        
        // Form-specific properties
        this.formProperties = {
            default: {
                moveSpeed: 0.3, // Duration of movement in seconds
                jumpForce: 15
            },
            rain: {
                moveSpeed: 0.4,
                jumpForce: 12
            },
            wind: {
                moveSpeed: 0.2,
                jumpForce: 20
            },
            lightning: {
                moveSpeed: 0.15,
                jumpForce: 15
            },
            snow: {
                moveSpeed: 0.5,
                jumpForce: 10
            }
        };
    }

    async init() {
        // Create player mesh
        const geometry = this.engine.assetManager.getGeometry('player');
        const material = this.engine.assetManager.getMaterial('player_default');
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 1, 0);
        this.mesh.castShadow = true;
    }

    update(deltaTime) {
        if (!this.isMoving) {
            this.handleInput(deltaTime);
        }
    }

    handleInput(deltaTime) {
        const input = this.engine.inputManager;
        const moveSpeed = this.formProperties[this.currentForm].moveSpeed;

        // Grid-based movement
        if (input.isKeyPressed('KeyW')) {
            this.moveToTile(this.gridPosition.x, this.gridPosition.y - 1, moveSpeed);
        } else if (input.isKeyPressed('KeyS')) {
            this.moveToTile(this.gridPosition.x, this.gridPosition.y + 1, moveSpeed);
        } else if (input.isKeyPressed('KeyA')) {
            this.moveToTile(this.gridPosition.x - 1, this.gridPosition.y, moveSpeed);
        } else if (input.isKeyPressed('KeyD')) {
            this.moveToTile(this.gridPosition.x + 1, this.gridPosition.y, moveSpeed);
        }

        // Form changes
        if (input.isKeyPressed('Digit1')) {
            this.transform('rain');
        } else if (input.isKeyPressed('Digit2')) {
            this.transform('wind');
        } else if (input.isKeyPressed('Digit3')) {
            this.transform('lightning');
        } else if (input.isKeyPressed('Digit4')) {
            this.transform('snow');
        }
    }

    moveToTile(newX, newY, duration) {
        if (this.isMoving) return;

        // Check bounds
        const bounds = 22; // Half of ground size (100/2) divided by tileSize (2)
        if (Math.abs(newX) > bounds || Math.abs(newY) > bounds) return;

        this.isMoving = true;
        this.gridPosition.set(newX, newY);

        // Calculate new world position
        const targetX = newX * this.tileSize;
        const targetZ = newY * this.tileSize;

        // Animate movement
        gsap.to(this.mesh.position, {
            x: targetX,
            z: targetZ,
            duration: duration,
            ease: "power2.inOut",
            onComplete: () => {
                this.isMoving = false;
            }
        });
    }

    transform(form) {
        if (this.currentForm === form) return;

        // Update form
        this.currentForm = form;

        // Update material
        const material = this.engine.assetManager.getMaterial(`player_${form}`);
        if (material) {
            this.mesh.material = material;
        }

        // Apply form-specific effects (to be implemented)
        switch (form) {
            case 'rain':
                // Add rain particle effects
                break;
            case 'wind':
                // Add wind trail effects
                break;
            case 'lightning':
                // Add lightning effects
                break;
            case 'snow':
                // Add snow effects
                break;
        }
    }

    dispose() {
        if (this.mesh) {
            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }
            if (this.mesh.material) {
                this.mesh.material.dispose();
            }
        }
    }
} 