import clsx from "clsx";
import { Dispatch, memo, SetStateAction, useEffect, useMemo, useState } from "react";
import cn from './SidePanel.module.scss';
import { usePuzzle } from "../../controllers/usePuzzle";
import { game, usePuzzleStore } from "../../controllers/puzzle.store";
import { MoveHistory } from "../../../../components/MoveHistory/MoveHistory";
import { NextPuzzleButton } from "../actions/NextPuzzleButton/NextPuzzleButton";
import { SettingsButton } from "../actions/SettingsButton/SettingsButton";
import { useSettingsStore } from "../../../../controllers/settings.store";
import Tooltip from "rc-tooltip";
import { SettingsPanel } from "./components/SettingsPanel/SettingsPanel";

interface SidePanelProps {
    setHoveredPos: Dispatch<SetStateAction<string | undefined>>
}

const MOVE_ANIMATION_TIME_MS = 500;
const FULL_OPACITY = 1;

export const SidePanel = memo(function SidePanel({ setHoveredPos }: SidePanelProps) {
    const invisibleMode = useSettingsStore(state => state.invisibleMode);
    const [openSettings, setOpenSettings] = useState(false);
    const { solved, fen } = usePuzzleStore();
    const { boardOrientation } = usePuzzle();
    const [selected, setSelected] = useState<number>();

    // fen is reactive, game is not
    // eslint-disable-next-line 
    const history = useMemo(() => game.history({ verbose: true }), [fen]);

    useEffect(() => {
        if (!selected) return setHoveredPos(undefined);

        setHoveredPos(history[selected].before);
        setTimeout(() => setHoveredPos(history[selected].after), MOVE_ANIMATION_TIME_MS);
    }, [selected, history, setHoveredPos]);

    const backgroundColor = useMemo(() => `rgba(255, 255, 255, ${invisibleMode ?? FULL_OPACITY})`, [invisibleMode]);

    return (
        <Tooltip placement="leftBottom" visible={openSettings} overlay={<SettingsPanel />} >
            <div
                className={clsx(cn.panel, solved && cn.solved)}
                style={{ backgroundColor }}
            >
                <h2>{boardOrientation} to move</h2>
                <MoveHistory history={history} selected={selected} setSelected={setSelected} />
                <div className={cn.actions}>
                    <SettingsButton openSettings={openSettings} setOpenSettings={setOpenSettings} />
                    <NextPuzzleButton />
                </div>
            </div>
        </Tooltip>
    );
});