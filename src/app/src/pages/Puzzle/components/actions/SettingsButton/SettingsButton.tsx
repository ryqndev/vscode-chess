import clsx from "clsx";
import Tooltip from "rc-tooltip";
import { memo, useCallback } from "react";
import cn from '../Actions.module.scss';

import SettingsIcon from './settings.svg?react';

export const SettingsButton = memo(function SettingsButton() {
    const onClick = useCallback(() => { }, []);

    return (
        <Tooltip placement="top" overlay={<span>Settings</span>}>
            <button className={clsx(cn.settings)} onClick={onClick}>
                <SettingsIcon />
            </button>
        </Tooltip>
    );
});