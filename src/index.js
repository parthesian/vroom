import { Engine } from './core/Engine';

async function main() {
    try {
        const engine = new Engine();
        await engine.init();

        // Handle cleanup on page unload
        window.addEventListener('unload', () => {
            engine.dispose();
        });
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

main(); 