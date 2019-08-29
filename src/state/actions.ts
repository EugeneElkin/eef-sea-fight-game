import { Action } from "redux";
import { IDeskContext } from "../classes/desk-context";

export interface IAppAction extends Action<number> {
    value?: any;
}

export enum AppActionType {
    CLICK_TO_OCCUPY_CELL = 1,
    CLICK_TO_FIRE_CELL,
    CLICK_TO_SET_BATTLEFIELD_READY,
}

const app = {
    clickToFireCell: (x: number, y: number, deskContext: IDeskContext) => ({
        type: AppActionType.CLICK_TO_FIRE_CELL,
        value: {x, y, player: deskContext.player},
    }),
    clickToOccupyCell: (x: number, y: number, deskContext: IDeskContext) => ({
        type: AppActionType.CLICK_TO_OCCUPY_CELL,
        value: {x, y, player: deskContext.player},
    }),
    clickToSetBattlefieldReady: (deskContext: IDeskContext) => ({
        type: AppActionType.CLICK_TO_SET_BATTLEFIELD_READY,
        value: {...deskContext},
    }),
};

export const Actions = {
    app,
};
