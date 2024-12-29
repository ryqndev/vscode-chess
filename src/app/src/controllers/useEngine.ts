import { useEffect, useState } from "react";
import { Engine } from './Engine';

/**
 * should also load in from localStorage if previous game existed
 */
export const useEngine = (fen?: string) => {
    const [bestMove, setBestMove] = useState<string>();

    useEffect(() => {
        Engine.listen(rawMessage => {
            const message = rawMessage.split(' ');
            console.log(rawMessage);
            switch (message[0]) {
                case "bestmove":
                    setBestMove(message[1]);
                    break;
                default:
                    return;
            }
        });
    }, []);

    useEffect(() => {
        if (!fen) {
            return Engine.start();
        }
        Engine.move(fen);
    }, [fen]);

    return {
        bestMove
    };
};