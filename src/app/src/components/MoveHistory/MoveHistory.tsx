import { Dispatch, memo, SetStateAction, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import cn from './MoveHistory.module.scss';
import { Move } from "chess.js";
import clsx from "clsx";

interface MoveHistoryProps {
    history: Move[],
    selected: number | undefined
    setSelected: Dispatch<SetStateAction<number | undefined>>;
}

export const MoveHistory = memo(function MoveHistory({ history, selected, setSelected }: MoveHistoryProps) {
    const ref = useRef<HTMLDivElement>(null);

    // group into two's for easier rendering
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
        setSelected(undefined);
    }, [history, setSelected]);

    const displayHoveredPos = useCallback((moveNum: number) => () => {
        setSelected(prev => prev === moveNum ? undefined : moveNum);
    }, [setSelected]);

    // const clearHoveredPos = useCallback(() => {
    //     setHoveredPos(undefined);
    // }, [setHoveredPos]);

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
                        <div className={cn.row} key={idx}>
                            <div className={cn.idx}>{idx + 1}.</div>
                            <button className={clsx(cn.move, selected === idx * 2 && cn.selected)} onClick={displayHoveredPos(idx * 2)} >{turn[0]}</button>
                            <button className={clsx(cn.move, selected === idx * 2 + 1 && cn.selected)} onClick={displayHoveredPos(idx * 2 + 1)}>{turn[1]}</button>
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