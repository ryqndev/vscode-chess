import { memo, RefObject, useEffect, useMemo, useState } from "react";
import { Chessboard as ReactChessBoard } from "react-chessboard";
import { Chess } from "chess.js";
import { ChessboardProps as ReactChessboardProps } from "react-chessboard/dist/chessboard/types";
import cn from './Chessboard.module.scss';

type ChessboardProps = Omit<ReactChessboardProps, 'ref'> & {
    fen: string;
    game: Chess;
    container: RefObject<HTMLDivElement>;
    invisibleMode?: number;
}

export const Chessboard = memo(function Chessboard({
    fen,
    container,
    invisibleMode,
    ...props
}: ChessboardProps) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!container.current) return;

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
    }, [container]);

    const boardStyles = useMemo(() => invisibleMode !== undefined ? {
        customDarkSquareStyle: { backgroundColor: `rgba(100, 100, 100, ${invisibleMode.toFixed(2)})` },
        customLightSquareStyle: { backgroundColor: `rgba(255, 255, 255, ${invisibleMode.toFixed(2)})` },
        customBoardStyle: { opacity: invisibleMode / 2 + 0.2 }
    } : {}, [invisibleMode]);

    const boardWidth = useMemo(() => ~~Math.min(dimensions.width, dimensions.height), [dimensions]);

    if (!boardWidth) return null;

    return (
        <div className={cn.container}>
            <ReactChessBoard
                id="main"
                position={fen}
                boardWidth={boardWidth}
                {...boardStyles}
                {...props}
            />
        </div>
    );
});