export class InputManager {
    constructor() {
        // Key states
        this.keys = new Map();
        this.mousePosition = { x: 0, y: 0 };
        this.mouseDelta = { x: 0, y: 0 };
        this.isMouseLocked = false;

        // Bind methods
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onPointerLockChange = this.onPointerLockChange.bind(this);
    }

    init() {
        // Add event listeners
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('pointerlockchange', this.onPointerLockChange);

        // Initialize key states for movement
        this.keys.set('KeyW', false);
        this.keys.set('KeyS', false);
        this.keys.set('KeyA', false);
        this.keys.set('KeyD', false);
        this.keys.set('Space', false);
        this.keys.set('ShiftLeft', false);

        // Initialize transformation keys
        this.keys.set('Digit1', false); // Rain form
        this.keys.set('Digit2', false); // Wind form
        this.keys.set('Digit3', false); // Lightning form
        this.keys.set('Digit4', false); // Snow form
        this.keys.set('KeyE', false);   // Interact
    }

    update(deltaTime) {
        // Reset mouse delta after each frame
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
    }

    onKeyDown(event) {
        if (this.keys.has(event.code)) {
            this.keys.set(event.code, true);
        }
    }

    onKeyUp(event) {
        if (this.keys.has(event.code)) {
            this.keys.set(event.code, false);
        }
    }

    onMouseMove(event) {
        if (this.isMouseLocked) {
            this.mouseDelta.x = event.movementX || 0;
            this.mouseDelta.y = event.movementY || 0;
        }
        
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    onPointerLockChange() {
        this.isMouseLocked = document.pointerLockElement !== null;
    }

    isKeyPressed(keyCode) {
        return this.keys.get(keyCode) || false;
    }

    getMouseDelta() {
        return { ...this.mouseDelta };
    }

    getMousePosition() {
        return { ...this.mousePosition };
    }

    lockMouse() {
        document.body.requestPointerLock();
    }

    unlockMouse() {
        document.exitPointerLock();
    }

    dispose() {
        // Remove event listeners
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);

        // Clear states
        this.keys.clear();
        this.mousePosition = { x: 0, y: 0 };
        this.mouseDelta = { x: 0, y: 0 };
        this.isMouseLocked = false;
    }
} 