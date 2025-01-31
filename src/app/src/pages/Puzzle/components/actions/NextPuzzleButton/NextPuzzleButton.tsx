import clsx from "clsx";
import cn from '../Actions.module.scss';
import { usePuzzle } from "../../../controllers/usePuzzle";
import { usePuzzleStore } from "../../../controllers/puzzle-store";
import { memo } from "react";
import SkipIcon from './skip.svg?react';
import NextIcon from './next.svg?react';
import Tooltip from "rc-tooltip";

export const NextPuzzleButton = memo(function NextPuzzleButton() {
    const solved = usePuzzleStore(state => state.solved);
    const { next } = usePuzzle();

    return (
        <Tooltip placement="top" overlay={<span>{solved ? "New" : "Skip"} Puzzle</span>}>
            <button className={clsx(cn.next, solved && cn.solved)} onClick={next}>
                {solved ? <NextIcon /> : <SkipIcon />}
            </button>
        </Tooltip>
    );
});