
/**
 * Requires stockfish.wasm.js and stockfish.js to be present in the public/engine folder
 */
// const STOCKFISH_WASM_PUBLIC_PATH = 'engine/stockfish.wasm.js';
const STOCKFISH_JS_FALLBACK_PUBLIC_PATH = 'engine/stockfish.js';

const HELLO_WASM_TEST_STRING = Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00);


class StockfishEngine {
    engine?: Worker;

    constructor() {
        const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(HELLO_WASM_TEST_STRING);
        const workerUrl = wasmSupported ? STOCKFISH_JS_FALLBACK_PUBLIC_PATH : STOCKFISH_JS_FALLBACK_PUBLIC_PATH;

        this.engine = new Worker((workerUrl));

        console.log(workerUrl);
        // fetch('https://google.com')
        //     .then(result => result.blob())
        //     .then(() => {
        //         // const blobUrl = URL.createObjectURL(blob);
        //         // new Worker(blobUrl);
        //     });
    }

    // Inits using UCI and starts new game
    start(positionFen?: string) {
        if (!this.engine) return;
        this.engine.postMessage('uci');
        this.engine.postMessage('isready');
        this.engine.postMessage('ucinewgame');

        this.engine.postMessage('setoption name Skill Level value -1');
        console.log('@ryqndev set level');
        // this.engine.postMessage('setoption name UCI_Elo value 1320');

        this.engine.postMessage(`position ${positionFen ? 'fen ' + positionFen : 'startpos'}`);
        this.engine.postMessage(`go`);
    }

    move(positionFen: string) {
        if (!this.engine) return;

        this.engine.postMessage(`position fen ${positionFen}`);
        this.engine.postMessage(`go`);
    }

    // setDifficulty()

    listen(onMessage: (message: string) => void) {
        if (!this.engine) return;

        return this.engine.addEventListener('message', event => onMessage(event.data));
    }



}

export const Engine = new StockfishEngine();

