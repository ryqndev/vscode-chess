import { memo } from "react";
import cn from './Stats.module.scss';

export const Stats = memo(function Stats() {
    return (
        <div className={cn.container}>
            <div className={cn.stat}>0</div>
        </div>
    );
});