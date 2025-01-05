import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chessboard as ReactChessBoard } from "react-chessboard";
import { Chess, PieceSymbol, Square } from "chess.js";
import { ChessboardProps as ReactChessboardProps, PromotionPieceOption } from "react-chessboard/dist/chessboard/types";


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

    // function onPromotionPieceSelect(
    //     piece?: PromotionPieceOption,
    //     promoteFromSquare?: Square,
    //     promoteToSquare?: Square
    // ) {
    //     if (!piece || !promoteFromSquare || !promoteToSquare) return false;
    //     makeMove(
    //         {
    //             from: promoteFromSquare,
    //             to: promoteToSquare,
    //             promotion: piece.substring(1).toLowerCase() as PieceSymbol,
    //         });

    //     return true;
    // }

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

    console.log('@ryqndev width', ~~boardWidth);
    if (!boardWidth) return null;

    return (
        <ReactChessBoard
            id="main"
            position={fen}
            boardWidth={boardWidth}
            // onPromotionPieceSelect={onPromotionPieceSelect}
            {...props}
        />
    );
});