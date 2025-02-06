import { memo, useMemo, useRef } from "react";
import cn from './MainPanel.module.scss';
import clsx from "clsx";
import { usePuzzle } from "../../controllers/usePuzzle";
import { useShallow } from "zustand/shallow";
import { usePuzzleStore } from "../../controllers/puzzle-store";
import { Chessboard } from "../../../../components/Chessboard/Chessboard";

export const MainPanel = memo(function MainPanel({ hoveredPos }: { hoveredPos?: string }) {
    const container = useRef<HTMLDivElement>(null);
    const { fen } = usePuzzleStore(useShallow(({ fen }) => ({ fen })));

    const { game, onPieceDrop, onPromotionPieceSelect, boardOrientation } = usePuzzle();
    const puzzle = usePuzzleStore(state => state.puzzle);

    const players = useMemo(() => {
        const nextPlayers = [...(puzzle?.game.players) ?? []];
        if (boardOrientation === "white") {
            [nextPlayers[0], nextPlayers[1]] = [nextPlayers[1], nextPlayers[0]];
        }
        return nextPlayers;
    }, [puzzle, boardOrientation]);


    if (!puzzle) return null;

    return (
        <div className={cn.container}>
            <div className={cn.main}>
                <div className={clsx(cn.player, cn.top, boardOrientation === "white" && cn.black)}>
                    {players[0].name} [{players[0].rating}]
                </div>
                <div className={cn.board} ref={container} >
                    <Chessboard
                        game={game}
                        // invisibleMode={1}
                        fen={hoveredPos ?? fen}
                        onPieceDrop={onPieceDrop}
                        boardOrientation={boardOrientation}
                        container={container}
                        arePremovesAllowed={true}
                        onPromotionPieceSelect={onPromotionPieceSelect}
                    />
                </div>
                <div className={clsx(cn.player, cn.bottom, boardOrientation === "black" && cn.black)}>
                    {players[1].name} [{players[1].rating}]
                </div>
            </div>
        </div>
    );
});