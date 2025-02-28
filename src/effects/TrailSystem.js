import * as THREE from 'three';

export class TrailSystem {
  constructor(scene) {
    this.scene = scene;
    
    // Trail properties
    this.trailWidth = 0.2; // Width of the trail
    this.fadeSpeed = 0.1; // How quickly the trail fades
    
    // Define neon colors for the trails (one for each wheel)
    this.trailColors = [
      new THREE.Color(0x00ff00), // Neon green (front-right)
      new THREE.Color(0xff00ff), // Neon pink (front-left)
      new THREE.Color(0x00ffff), // Neon cyan (back-right)
      new THREE.Color(0xff9900)  // Neon orange (back-left)
    ];
    
    // Create a ribbon for each wheel
    this.trails = [];
    for (let i = 0; i < 4; i++) {
      this.createTrail(i);
    }
    
    // Car reference (will be set by Game)
    this.car = null;
    
    // Points for each trail
    this.trailPoints = [[], [], [], []];
    this.maxPoints = 200; // Reduced from 500 to 200
    
    // Timer for removing points
    this.removalTimer = 0;
  }
  
  createTrail(wheelIndex) {
    // Create material with neon color
    const material = new THREE.MeshBasicMaterial({
      color: this.trailColors[wheelIndex],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });
    
    // Create empty geometry
    const geometry = new THREE.BufferGeometry();
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false; // Prevent disappearing when out of camera view
    mesh.position.y = 0.05; // Slightly above ground
    
    // Add to scene
    this.scene.add(mesh);
    
    // Store trail
    this.trails.push({
      mesh: mesh,
      material: material
    });
  }
  
  update(deltaTime, carPosition, isCarMoving) {
    // If car reference is not set, we can't do anything
    if (!this.car) return;
    
    // Get current wheel positions
    const wheelPositions = this.car.getWheelPositions();
    
    // Only add new points if the car is moving
    if (isCarMoving) {
      // Add current positions to trail points
      for (let i = 0; i < wheelPositions.length; i++) {
        const currentPos = wheelPositions[i];
        const points = this.trailPoints[i];
        
        // Only add a point if it's different enough from the last one
        if (points.length === 0 || 
            currentPos.distanceTo(points[points.length - 1]) > 0.2) {
          // Add the new point
          points.push(new THREE.Vector3(
            currentPos.x,
            0.05, // Slightly above ground
            currentPos.z
          ));
          
          // Limit the number of points
          if (points.length > this.maxPoints) {
            points.shift();
          }
          
          // Update the trail geometry
          this.updateTrailGeometry(i);
        }
      }
    }
    
    // Update removal timer
    this.removalTimer += deltaTime;
    
    // Remove oldest points periodically to create fading effect
    if (this.removalTimer > this.fadeSpeed) {
      this.removalTimer = 0;
      
      // Remove oldest point from each trail
      for (let i = 0; i < this.trails.length; i++) {
        const points = this.trailPoints[i];
        if (points.length > 2) { // Keep at least 2 points
          points.shift();
          this.updateTrailGeometry(i);
        }
      }
    }
  }
  
  updateTrailGeometry(trailIndex) {
    const trail = this.trails[trailIndex];
    const points = this.trailPoints[trailIndex];
    
    // Need at least 2 points to create a trail
    if (points.length < 2) return;
    
    // Create a ribbon-like geometry following the points
    const vertices = [];
    const indices = [];
    
    // For each point (except the last one), create a quad connecting to the next point
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      // Calculate direction vector between points
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      
      // Calculate perpendicular vector in the xz plane
      const perpendicular = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(this.trailWidth / 2);
      
      // Create the four corners of the quad
      const v1 = new THREE.Vector3().addVectors(p1, perpendicular);
      const v2 = new THREE.Vector3().subVectors(p1, perpendicular);
      const v3 = new THREE.Vector3().addVectors(p2, perpendicular);
      const v4 = new THREE.Vector3().subVectors(p2, perpendicular);
      
      // Add vertices
      vertices.push(
        v1.x, 0, v1.z,
        v2.x, 0, v2.z,
        v3.x, 0, v3.z,
        v4.x, 0, v4.z
      );
      
      // Add indices for two triangles forming the quad
      const baseIndex = i * 4;
      indices.push(
        baseIndex, baseIndex + 1, baseIndex + 2,
        baseIndex + 1, baseIndex + 3, baseIndex + 2
      );
    }
    
    // Create new geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    
    // Update the mesh geometry
    trail.mesh.geometry.dispose();
    trail.mesh.geometry = geometry;
  }
  
  // Set reference to car for getting wheel positions
  setCar(car) {
    this.car = car;
  }
} 