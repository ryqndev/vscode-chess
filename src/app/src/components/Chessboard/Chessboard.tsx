import { memo, RefObject, useEffect, useMemo, useState } from "react";
import { Chessboard as ReactChessBoard } from "react-chessboard";
import { Chess } from "chess.js";
import { ChessboardProps as ReactChessboardProps } from "react-chessboard/dist/chessboard/types";
import cn from './Chessboard.module.scss';
import { usePieceClick } from "./hooks/usePieceClick";
import { useSettingsStore } from "../../controllers/settings.store";

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
    const pieceClickProps = usePieceClick(props.onPieceDrop);
    const invisibleMode = useSettingsStore(state => state.invisibleMode);
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
        return () => observer.disconnect();
    }, [container]);


    const boardStyles = useMemo(() => invisibleMode !== undefined ? {
        customDarkSquareStyle: { backgroundColor: `rgba(100, 100, 100, ${invisibleMode / 2 + 0.5})` },
        customLightSquareStyle: { backgroundColor: `rgba(255, 255, 255, ${invisibleMode.toFixed(2)})` },
        customBoardStyle: { opacity: invisibleMode / 2 + 0.5 }
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
                {...pieceClickProps}
                {...props}
            />
        </div>
    );
});