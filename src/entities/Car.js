import * as THREE from 'three';

export class Car {
  constructor() {
    // Car properties
    this.speed = 0;
    this.maxSpeed = 25; // Increased for a sports car
    this.acceleration = 15; // Increased for better performance
    this.deceleration = 8;
    this.turnSpeed = 3.0;
    this.position = new THREE.Vector3(0, 0.4, 0); // Lower to the ground
    this.rotation = 0;
    this.moving = false;
    
    // Track wheel positions
    this.wheelPositions = [
      new THREE.Vector3(0.8, 0, 1.3),   // front-right
      new THREE.Vector3(-0.8, 0, 1.3),  // front-left
      new THREE.Vector3(0.8, 0, -1.3),  // back-right
      new THREE.Vector3(-0.8, 0, -1.3)  // back-left
    ];
    
    // Create car mesh
    this.createMesh();
  }
  
  createMesh() {
    // Create a group to hold all car parts
    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    
    // Create car body - lower and wider for a sports car look
    const bodyGeometry = new THREE.BoxGeometry(2.2, 0.4, 4.2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a0a, // Almost black
      roughness: 0.3,
      metalness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    body.castShadow = true;
    this.mesh.add(body);
    
    // Create car cabin - more angular and aggressive
    const cabinGeometry = new THREE.BoxGeometry(1.8, 0.3, 2);
    const cabinMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a0a, // Match body color
      roughness: 0.2,
      metalness: 0.9
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 0.7, -0.2);
    cabin.castShadow = true;
    this.mesh.add(cabin);
    
    // Create windshield
    const windshieldGeometry = new THREE.BoxGeometry(1.7, 0.01, 1.2);
    const windshieldMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 0.85, 0.5);
    windshield.rotation.x = Math.PI / 6; // Angled windshield
    this.mesh.add(windshield);
    
    // Create front hood - sloped for aerodynamic look
    const hoodGeometry = new THREE.BoxGeometry(2, 0.1, 1.2);
    const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
    hood.position.set(0, 0.5, 1.3);
    hood.rotation.x = -Math.PI / 24; // Slight downward angle
    hood.castShadow = true;
    this.mesh.add(hood);
    
    // Create rear spoiler
    const spoilerStandGeometry = new THREE.BoxGeometry(1.6, 0.2, 0.1);
    const spoilerStand1 = new THREE.Mesh(spoilerStandGeometry, bodyMaterial);
    const spoilerStand2 = new THREE.Mesh(spoilerStandGeometry, bodyMaterial);
    spoilerStand1.position.set(0.7, 0.7, -1.8);
    spoilerStand2.position.set(-0.7, 0.7, -1.8);
    this.mesh.add(spoilerStand1);
    this.mesh.add(spoilerStand2);
    
    const spoilerWingGeometry = new THREE.BoxGeometry(2, 0.05, 0.4);
    const spoilerWing = new THREE.Mesh(spoilerWingGeometry, bodyMaterial);
    spoilerWing.position.set(0, 0.8, -1.9);
    spoilerWing.castShadow = true;
    this.mesh.add(spoilerWing);
    
    // Create front bumper with aggressive angles
    const frontBumperGeometry = new THREE.BoxGeometry(2.2, 0.3, 0.2);
    const frontBumper = new THREE.Mesh(frontBumperGeometry, bodyMaterial);
    frontBumper.position.set(0, 0.2, 2.1);
    frontBumper.castShadow = true;
    this.mesh.add(frontBumper);
    
    // Create side skirts
    const skirtGeometry = new THREE.BoxGeometry(0.1, 0.2, 3.8);
    const leftSkirt = new THREE.Mesh(skirtGeometry, bodyMaterial);
    const rightSkirt = new THREE.Mesh(skirtGeometry, bodyMaterial);
    leftSkirt.position.set(-1.1, 0.2, 0);
    rightSkirt.position.set(1.1, 0.2, 0);
    this.mesh.add(leftSkirt);
    this.mesh.add(rightSkirt);
    
    // Create wheels - larger for a sports car
    this.wheels = [];
    this.wheels.push(this.createWheel(this.wheelPositions[0].x, this.wheelPositions[0].y, this.wheelPositions[0].z));  // front-right
    this.wheels.push(this.createWheel(this.wheelPositions[1].x, this.wheelPositions[1].y, this.wheelPositions[1].z));  // front-left
    this.wheels.push(this.createWheel(this.wheelPositions[2].x, this.wheelPositions[2].y, this.wheelPositions[2].z));  // back-right
    this.wheels.push(this.createWheel(this.wheelPositions[3].x, this.wheelPositions[3].y, this.wheelPositions[3].z));  // back-left
    
    // Add headlights
    this.createHeadlight(0.8, 0.3, 2.1);
    this.createHeadlight(-0.8, 0.3, 2.1);
    
    // Add taillights
    this.createTaillight(0.8, 0.4, -2.1);
    this.createTaillight(-0.8, 0.4, -2.1);
  }
  
  createWheel(x, y, z) {
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111, // Black wheels
      roughness: 0.9,
      metalness: 0.1
    });
    
    // Rotate the wheel geometry to align with car
    wheelGeometry.rotateZ(Math.PI / 2);
    
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    this.mesh.add(wheel);
    
    // Add wheel rim
    const rimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.26, 8);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.8
    });
    rimGeometry.rotateZ(Math.PI / 2);
    
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    wheel.add(rim);
    
    return wheel;
  }
  
  createHeadlight(x, y, z) {
    // Create a point light for the headlight
    const light = new THREE.PointLight(0xffffff, 1, 10);
    light.position.set(x, y, z + 0.1);
    this.mesh.add(light);
    
    // Create a small rectangle to represent the headlight
    const headlightGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
    const headlightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1
    });
    const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight.position.set(x, y, z);
    this.mesh.add(headlight);
  }
  
  createTaillight(x, y, z) {
    // Create a point light for the taillight
    const light = new THREE.PointLight(0xff0000, 0.5, 5);
    light.position.set(x, y, z - 0.1);
    this.mesh.add(light);
    
    // Create a small rectangle to represent the taillight
    const taillightGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
    const taillightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 1
    });
    const taillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    taillight.position.set(x, y, z);
    this.mesh.add(taillight);
  }
  
  update(deltaTime, inputManager) {
    // Get movement input
    const input = inputManager.getMovementInput();
    
    // Handle acceleration/deceleration
    if (input.y > 0) {
      // Accelerate forward
      this.speed = Math.min(this.speed + this.acceleration * deltaTime, this.maxSpeed);
      this.moving = true;
    } else if (input.y < 0) {
      // Accelerate backward
      this.speed = Math.max(this.speed - this.acceleration * deltaTime, -this.maxSpeed / 2);
      this.moving = true;
    } else {
      // Decelerate when no input
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.deceleration * deltaTime);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.deceleration * deltaTime);
      }
      
      // Check if car has effectively stopped
      if (Math.abs(this.speed) < 0.1) {
        this.speed = 0;
        this.moving = false;
      }
    }
    
    // Handle turning (only when moving)
    if (Math.abs(this.speed) > 0.1) {
      // Turn rate is proportional to speed but in opposite direction when reversing
      const turnFactor = this.speed > 0 ? 1 : -1;
      this.rotation -= input.x * this.turnSpeed * deltaTime * turnFactor;
    }
    
    // Update position based on speed and rotation
    const moveX = Math.sin(this.rotation) * this.speed * deltaTime;
    const moveZ = Math.cos(this.rotation) * this.speed * deltaTime;
    
    this.position.x += moveX;
    this.position.z += moveZ;
    
    // Update mesh position and rotation
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation;
    
    // Rotate wheels based on speed
    const wheelRotationSpeed = this.speed * 2;
    for (const wheel of this.wheels) {
      wheel.rotation.y += wheelRotationSpeed * deltaTime;
    }
  }
  
  getPosition() {
    return this.position.clone();
  }
  
  isMoving() {
    return this.moving;
  }
  
  getWheelPositions() {
    // Calculate world positions of wheels
    const worldPositions = [];
    
    for (let i = 0; i < this.wheelPositions.length; i++) {
      // Create a vector for the local wheel position
      const wheelPos = this.wheelPositions[i].clone();
      
      // Apply car rotation to the wheel position
      const rotatedX = wheelPos.x * Math.cos(this.rotation) - wheelPos.z * Math.sin(this.rotation);
      const rotatedZ = wheelPos.x * Math.sin(this.rotation) + wheelPos.z * Math.cos(this.rotation);
      
      // Add car position to get world position
      const worldPos = new THREE.Vector3(
        this.position.x + rotatedX,
        0.05, // Slightly above ground to prevent z-fighting
        this.position.z + rotatedZ
      );
      
      worldPositions.push(worldPos);
    }
    
    return worldPositions;
  }
} 