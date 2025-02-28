import { Game } from './core/Game.js';

// Create controls info element
const controlsInfo = document.createElement('div');
controlsInfo.className = 'controls-info';
controlsInfo.innerHTML = 'Controls: W (forward), A (left), S (backward), D (right)';
document.body.appendChild(controlsInfo);

// Initialize the game
const game = new Game(document.getElementById('app'));
game.start(); 