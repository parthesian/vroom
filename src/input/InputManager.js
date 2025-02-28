export class InputManager {
  constructor() {
    // Initialize key states
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false
    };
    
    // Set up event listeners
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }
  
  onKeyDown(event) {
    // Convert key to lowercase to handle both upper and lower case
    const key = event.key.toLowerCase();
    
    // Update key state if it's one we're tracking
    if (key in this.keys) {
      this.keys[key] = true;
    }
  }
  
  onKeyUp(event) {
    // Convert key to lowercase to handle both upper and lower case
    const key = event.key.toLowerCase();
    
    // Update key state if it's one we're tracking
    if (key in this.keys) {
      this.keys[key] = false;
    }
  }
  
  // Check if a specific key is pressed
  isKeyPressed(key) {
    return this.keys[key.toLowerCase()] || false;
  }
  
  // Get movement input as a vector (x: left/right, y: forward/backward)
  getMovementInput() {
    return {
      x: (this.isKeyPressed('d') ? 1 : 0) - (this.isKeyPressed('a') ? 1 : 0),
      y: (this.isKeyPressed('w') ? 1 : 0) - (this.isKeyPressed('s') ? 1 : 0)
    };
  }
} 