import { memo, useRef } from "react";
import cn from './MainPanel.module.scss';
import clsx from "clsx";
import { usePuzzle } from "../../controllers/usePuzzle";
import { useShallow } from "zustand/shallow";
import { usePuzzleStore } from "../../controllers/puzzle-store";
import { Chessboard } from "../../../../components/Chessboard/Chessboard";

export const MainPanel = memo(function MainPanel({ hoveredPos }: { hoveredPos?: string }) {
    const container = useRef<HTMLDivElement>(null);
    const { fen } = usePuzzleStore(useShallow(({ fen }) => ({ fen })));

    const { game, onPieceDrop, onPromotionPieceSelect } = usePuzzle();
    const puzzle = usePuzzleStore(state => state.puzzle);


    if (!puzzle) return null;

    return (
        <div className={cn.main}>
            <div className={clsx(cn.player, cn.top)}>
                {puzzle.game.players[1].name} [{puzzle.game.players[1].rating}]
            </div>
            <div className={cn.board} ref={container} >
                <Chessboard
                    game={game}
                    // invisibleMode={1}
                    fen={hoveredPos ?? fen}
                    onPieceDrop={onPieceDrop}
                    container={container}
                    arePremovesAllowed={true}
                    onPromotionPieceSelect={onPromotionPieceSelect}
                />
            </div>
            <div className={clsx(cn.player, cn.bottom)}>
                {puzzle.game.players[0].name} [{puzzle.game.players[0].rating}]
            </div>
        </div>
    );
});