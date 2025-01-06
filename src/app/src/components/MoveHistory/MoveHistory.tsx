import { memo, useCallback, useMemo } from "react";
import cn from './MoveHistory.module.scss';
import { Move } from "chess.js";

interface MoveHistoryProps {
    history: Move[],
    setHoveredPos: (fen: string | undefined) => void
}

export const MoveHistory = memo(function MoveHistory({ history, setHoveredPos }: MoveHistoryProps) {
    const parsedHistory = useMemo(() =>
        history.reduce((acc, _, idx, array) => {
            if (idx % 2 === 0) {
                acc.push(array.slice(idx, idx + 2).map(e => e.san));
            }
            return acc;
        }, [] as string[][])
        , [history]
    );

    const displayHoveredPos = useCallback((moveNum: number) => () => {
        setHoveredPos(history[moveNum].after);
    }, [history, setHoveredPos]);

    const clearHoveredPos = useCallback(() => {
        // setHoveredPos(undefined);
    }, [setHoveredPos]);

    return (
        <div className={cn.container}>
            <div className={cn.table}>
                {
                    parsedHistory.map((turn, idx) =>
                        <div className={cn.row} key={idx} onMouseLeave={clearHoveredPos}>
                            <div>{idx + 1}.</div>
                            <div onMouseEnter={displayHoveredPos(idx * 2)} >{turn[0]}</div>
                            <div onMouseEnter={displayHoveredPos(idx * 2 + 1)}>{turn[1]}</div>
                        </div>
                    )
                }
                {!(history.length % 2) &&
                    <div className={cn.row}>
                        <div>{parsedHistory.length + 1}</div>
                    </div>}
            </div>
        </div>
    );
});