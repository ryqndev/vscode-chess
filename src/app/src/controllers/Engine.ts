import SF from './stockfish.wasm.js?raw';

class StockfishEngine {
    engine: Worker;

    constructor() {
        this.engine = new Worker(`data:text/javascript;base64,${btoa(SF)}`);
    }

    // Inits using UCI and starts new game
    start(positionFen?: string) {
        this.engine.postMessage('uci');
        this.engine.postMessage('isready');
        this.engine.postMessage('ucinewgame');

        this.engine.postMessage('setoption name Skill Level value -1');
        // this.engine.postMessage('setoption name UCI_Elo value 1320');

        this.engine.postMessage(`position ${positionFen ? 'fen ' + positionFen : 'startpos'}`);
        this.engine.postMessage(`go`);
    }

    move(positionFen: string) {
        this.engine.postMessage(`position fen ${positionFen}`);
        this.engine.postMessage(`go`);
    }

    // setDifficulty()

    listen(onMessage: (message: string) => void) {
        return this.engine.addEventListener('message', event => onMessage(event.data));
    }



}

export const Engine = new StockfishEngine();

