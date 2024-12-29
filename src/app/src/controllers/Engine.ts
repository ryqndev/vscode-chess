/**
 * Requires stockfish.wasm.js and stockfish.js to be present in the public/engine folder
 */
const STOCKFISH_WASM_PUBLIC_PATH = 'engine/stockfish.wasm.js'
const STOCKFISH_JS_FALLBACK_PUBLIC_PATH = 'engine/stockfish.js'

const HELLO_WASM_TEST_STRING = Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00);

// stockfish.addEventListener('message', function (e) {
//     console.log(e.data);
// });

// stockfish.postMessage('uci');



class StockfishEngine {
    engine: Worker;

    constructor() {
        const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(HELLO_WASM_TEST_STRING);
        this.engine = new Worker(wasmSupported ? STOCKFISH_WASM_PUBLIC_PATH : STOCKFISH_JS_FALLBACK_PUBLIC_PATH);
    }

    // Inits using UCI and starts new game
    start() {
        this.engine.postMessage('uci');
        this.engine.postMessage('isready');
        this.engine.postMessage('ucinewgame');
    }

    move() {

    }
}

export const Engine = new StockfishEngine();

