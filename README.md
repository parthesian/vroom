# Neon Car Trails

A Three.js game where you control a car using WASD keys, leaving colorful neon trails that slowly fade away as you drive on a black ground.

## Features

- Drive a 3D car using WASD controls
- Colorful neon trails that follow the car's path
- Trails slowly fade away over time
- Black ground with subtle grid for visual reference
- Dynamic camera that follows the car

## Controls

- **W**: Accelerate forward
- **S**: Brake/Reverse
- **A**: Turn left
- **D**: Turn right

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to the local server address (usually http://localhost:5173)

## Technologies Used

- Three.js - 3D graphics library
- Vite - Build tool and development server

## Project Structure

The project follows a modular architecture with clear separation of concerns:

- `src/core/` - Core game engine components
- `src/entities/` - Game objects like the car and ground
- `src/effects/` - Visual effects like the trail system
- `src/input/` - Input handling for keyboard controls

## Performance Considerations

- Trail segments are automatically removed when they fade completely
- Maximum number of trail segments is capped to prevent memory issues
- Efficient update loop with delta time for consistent performance

## License

MIT 