import { memo, useMemo } from "react";
import cn from './MoveHistory.module.scss';

export const MoveHistory = memo(function MoveHistory({ history }: { history: string[] }) {
    const parsedHistory = useMemo(() =>
        history
            .reduce((acc, _, idx, array) => {
                if (idx % 2 === 0) {
                    acc.push(array.slice(idx, idx + 2));
                }
                return acc;
            }, [] as string[][])
        , [history]);

    return (
        <div className={cn.container}>
            <div className={cn.table}>
                {
                    parsedHistory.map((turn, idx) =>
                        <div className={cn.row} key={idx}>
                            <div>{idx + 1}.</div>
                            <div>{turn[0]}</div>
                            <div>{turn[1]}</div>
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