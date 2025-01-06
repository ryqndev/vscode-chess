import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import cn from './MoveHistory.module.scss';
import { Move } from "chess.js";

interface MoveHistoryProps {
    history: Move[],
    setHoveredPos: (fen: string | undefined) => void
}

export const MoveHistory = memo(function MoveHistory({ history, setHoveredPos }: MoveHistoryProps) {
    const ref = useRef<HTMLDivElement>(null);
    const parsedHistory = useMemo(() =>
        history.reduce((acc, _, idx, array) => {
            if (idx % 2 === 0) {
                acc.push(array.slice(idx, idx + 2).map(e => e.san));
            }
            return acc;
        }, [] as string[][])
        , [history]
    );

    useEffect(() => {
        setHoveredPos(undefined);
    }, [history, setHoveredPos]);

    const displayHoveredPos = useCallback((moveNum: number) => () => {
        setHoveredPos(history[moveNum].after);
        // setTimeout(() => setHoveredPos(history[moveNum].after), 500);
    }, [history, setHoveredPos]);

    const clearHoveredPos = useCallback(() => {
        setHoveredPos(undefined);
    }, [setHoveredPos]);

    useLayoutEffect(() => {
        ref.current?.scrollTo({
            top: ref.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [parsedHistory]);

    return (
        <div className={cn.container}>
            <div className={cn.table} ref={ref}>
                {
                    parsedHistory.map((turn, idx) =>
                        <div className={cn.row} key={idx} onMouseLeave={clearHoveredPos}>
                            <div className={cn.idx}>{idx + 1}.</div>
                            <div className={cn.move} onMouseEnter={displayHoveredPos(idx * 2)} >{turn[0]}</div>
                            <div className={cn.move} onMouseEnter={displayHoveredPos(idx * 2 + 1)}>{turn[1]}</div>
                        </div>
                    )
                }
                {!(history.length % 2) &&
                    <div className={cn.row}>
                        <div className={cn.idx}>{parsedHistory.length + 1}.</div>
                        <div></div>
                        <div></div>
                    </div>}
            </div>
        </div>
    );
});