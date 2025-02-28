import * as THREE from 'three';

export class Ground {
  constructor(size = 200, segments = 10) {
    // Create a plane geometry for the ground with fewer segments
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    
    // Create a black material for the ground - using MeshBasicMaterial for better performance
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });
    
    // Create the mesh
    this.mesh = new THREE.Mesh(geometry, material);
    
    // Rotate the ground to be horizontal
    this.mesh.rotation.x = -Math.PI / 2;
    
    // Enable shadows
    this.mesh.receiveShadow = true;
    
    // Add environment elements
    this.addEnvironmentElements();
  }
  
  addEnvironmentElements() {
    // Create a group to hold all environment elements
    this.environmentGroup = new THREE.Group();
    this.mesh.add(this.environmentGroup);
    
    // Add distant light strips along the edges of the grid (reduced number)
    this.addLightStrips();
  }
  
  addLightStrips() {
    // Create light strips along the perimeter
    const stripColors = [
      0x00ff00, // Green
      0xff00ff, // Pink
      0x00ffff, // Cyan
      0xff9900  // Orange
    ];
    
    const stripSize = 100;
    const stripCount = 8; // Reduced from 20 to 8
    const stripSpacing = stripSize / stripCount;
    
    // Create strips along the perimeter
    for (let i = 0; i < stripCount; i++) {
      // Position along the edge
      const position = -stripSize / 2 + i * stripSpacing;
      const colorIndex = i % stripColors.length;
      
      // Only create strips at the corners and midpoints to reduce total count
      if (i === 0 || i === stripCount/4 || i === stripCount/2 || i === 3*stripCount/4 || i === stripCount-1) {
        // Create north edge strip
        this.createLightStrip(position, 0, -stripSize / 2 - 1, stripColors[colorIndex], 1, 0.2);
        
        // Create south edge strip
        this.createLightStrip(position, 0, stripSize / 2 + 1, stripColors[(colorIndex + 2) % stripColors.length], 1, 0.2);
        
        // Create west edge strip
        this.createLightStrip(-stripSize / 2 - 1, 0, position, stripColors[(colorIndex + 1) % stripColors.length], 0.2, 1);
        
        // Create east edge strip
        this.createLightStrip(stripSize / 2 + 1, 0, position, stripColors[(colorIndex + 3) % stripColors.length], 0.2, 1);
      }
    }
  }
  
  createLightStrip(x, y, z, color, width, depth) {
    // Create a small box for the light strip
    const geometry = new THREE.BoxGeometry(width, 0.1, depth);
    
    // Use MeshBasicMaterial instead of MeshStandardMaterial for better performance
    const material = new THREE.MeshBasicMaterial({
      color: color
    });
    
    const strip = new THREE.Mesh(geometry, material);
    strip.position.set(x, y, z);
    
    // Add a point light at the strip position with reduced distance
    const light = new THREE.PointLight(color, 0.5, 5); // Reduced distance from 10 to 5
    light.position.set(x, 0.5, z);
    
    this.environmentGroup.add(strip);
    this.environmentGroup.add(light);
  }
} 