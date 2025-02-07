import { ChangeEvent, memo, useCallback } from "react";

import cn from './SettingsPanel.module.scss';
import { useSettingsStore } from "../../../../../../controllers/settings.store";

export const SettingsPanel = memo(function SettingsPanel() {
    const { invisibleMode, setInvisibleMode } = useSettingsStore();

    const toggleInvisibleMode = useCallback(() => {
        setInvisibleMode(invisibleMode === undefined ? 0.8 : undefined);
    }, [invisibleMode, setInvisibleMode]);

    const onInvisibleModeChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setInvisibleMode(parseInt(evt.target.value) / 100);
    }, [setInvisibleMode]);

    return (
        <div className={cn.container}>
            <h3>Settings</h3>

            Invisible Mode:
            <input
                type="checkbox"
                checked={invisibleMode !== undefined}
                onClick={toggleInvisibleMode}
                onChange={toggleInvisibleMode}
            />

            <input
                disabled={invisibleMode === undefined}
                value={(invisibleMode ?? 0.8) * 100}
                onChange={onInvisibleModeChange}
                type="range"
                min={0}
                max={100}
            />
        </div>);
});