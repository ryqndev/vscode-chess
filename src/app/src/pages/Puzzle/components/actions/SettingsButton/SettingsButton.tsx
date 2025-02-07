import clsx from "clsx";
import Tooltip from "rc-tooltip";
import { Dispatch, memo, SetStateAction, useCallback } from "react";
import cn from '../Actions.module.scss';

import SettingsIcon from './settings.svg?react';

interface SettingsButtonProps {
    openSettings: boolean;
    setOpenSettings: Dispatch<SetStateAction<boolean>>;
}

export const SettingsButton = memo(function SettingsButton({ openSettings, setOpenSettings }: SettingsButtonProps) {
    const onClick = useCallback(() => setOpenSettings(prev => !prev), [setOpenSettings]);

    return (
        <Tooltip placement="top" overlay={<span>Settings</span>}>
            <button className={clsx(cn.settings, openSettings && cn.open)} onClick={onClick}>
                <SettingsIcon />
            </button>
        </Tooltip>
    );
});