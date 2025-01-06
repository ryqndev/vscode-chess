import { memo, RefObject, useEffect, useMemo, useState } from "react";
import { Chessboard as ReactChessBoard } from "react-chessboard";
import { Chess } from "chess.js";
import { ChessboardProps as ReactChessboardProps } from "react-chessboard/dist/chessboard/types";


type ChessboardProps = Omit<ReactChessboardProps, 'ref'> & {
    fen: string;
    game: Chess;
    container: RefObject<HTMLDivElement>;
}

export const Chessboard = memo(function Chessboard({
    fen,
    container,
    ...props
}: ChessboardProps) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (container.current) {
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setDimensions({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                    });
                }
            });

            observer.observe(container.current);

            return () => {
                observer.disconnect();
            };
        }
    }, [container]);
    const boardWidth = useMemo(() => ~~Math.min(dimensions.width, dimensions.height), [dimensions]);

    if (!boardWidth) return null;

    return (
        <ReactChessBoard
            id="main"
            position={fen}
            boardWidth={boardWidth}
            {...props}
        />
    );
});