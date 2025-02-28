import * as THREE from 'three';
import { Car } from '../entities/Car.js';
import { Ground } from '../entities/Ground.js';
import { InputManager } from '../input/InputManager.js';
import { TrailSystem } from '../effects/TrailSystem.js';

export class Game {
  constructor(container) {
    this.container = container;
    
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    // Reduce fog density for better performance
    this.scene.fog = new THREE.FogExp2(0x000000, 0.005);
    
    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(0, 15, 15); // Higher position for 45-degree angle view
    this.camera.lookAt(0, 0, 0);
    
    // Initialize lights
    this.setupLights();
    
    // Initialize input manager
    this.inputManager = new InputManager();
    
    // Initialize game objects
    this.ground = new Ground();
    this.scene.add(this.ground.mesh);
    
    this.car = new Car();
    this.scene.add(this.car.mesh);
    
    // Initialize trail system
    this.trailSystem = new TrailSystem(this.scene);
    // Connect car to trail system
    this.trailSystem.setCar(this.car);
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Initialize clock for delta time
    this.clock = new THREE.Clock();
    
    // Enable shadows
    this.setupShadows();
    
    // Add post-processing effects
    this.setupPostProcessing();
  }
  
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light (sun) - simplified
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
    
    // Remove spotlight and backlight for performance
    // Add a single point light for the car
    const carLight = new THREE.PointLight(0xffffff, 1, 20);
    carLight.position.set(0, 5, 0);
    this.scene.add(carLight);
  }
  
  setupShadows() {
    this.renderer.shadowMap.enabled = false;
  }
  
  setupPostProcessing() {
    // Post-processing would be implemented here
    // For simplicity, we're not adding it in this implementation
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  update() {
    const delta = Math.min(this.clock.getDelta(), 0.1); // Cap delta time to prevent large jumps
    
    // Update car based on input
    this.car.update(delta, this.inputManager);
    
    // Update camera to follow car
    this.updateCamera();
    
    // Update trail system - pass car's moving state
    this.trailSystem.update(delta, this.car.getPosition(), this.car.isMoving());
  }
  
  updateCamera() {
    const carPosition = this.car.getPosition();
    
    // Fixed camera position at 45-degree angle
    const cameraDistance = 15; // Distance from car
    const cameraHeight = 15;   // Height above ground
    
    // Calculate camera position (fixed offset, doesn't rotate with car)
    const cameraTargetPosition = new THREE.Vector3(
      carPosition.x,
      carPosition.y + cameraHeight,
      carPosition.z + cameraDistance
    );
    
    // Smoothly move camera to follow car
    this.camera.position.lerp(cameraTargetPosition, 0.05);
    
    // Always look at the car
    this.camera.lookAt(carPosition);
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  start() {
    this.animate();
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.update();
    this.render();
  }
} 