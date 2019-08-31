import { Action } from "redux";
import { IDeskContext } from "../classes/desk-context";

export interface IAppAction extends Action<number> {
    value?: any;
}

export enum AppActionType {
    OCCUPY_CELL = 1,
    FIRE_CELL,
    SET_BATTLEFIELD_READY,
    SET_OPPONENT_FIELD_UNDER_FIRE,
}

const app = {
    fireCell: (x: number, y: number, deskContext: IDeskContext) => ({
        type: AppActionType.FIRE_CELL,
        value: {x, y, ...deskContext},
    }),
    occupyCell: (x: number, y: number, deskContext: IDeskContext) => ({
        type: AppActionType.OCCUPY_CELL,
        value: {x, y, ...deskContext},
    }),
    setBattlefieldReady: (deskContext: IDeskContext) => ({
        type: AppActionType.SET_BATTLEFIELD_READY,
        value: {...deskContext},
    }),
    setOpponentFieldUnderFire: (deskContext: IDeskContext) => ({
        type: AppActionType.SET_OPPONENT_FIELD_UNDER_FIRE,
        value: {...deskContext},
    }),
};

export const Actions = {
    app,
};
