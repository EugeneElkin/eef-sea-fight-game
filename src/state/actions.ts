import { Action } from "redux";

export interface IAppAction extends Action<number> {
    value?: any;
}

export enum AppActionType {
    CLICK_TO_OCCUPY_CELL = 1,
    CLICK_TO_FIRE_CELL,
}

const app = {
    clickToFireCell: (x: number, y: number, player: string) => ({
        type: AppActionType.CLICK_TO_FIRE_CELL,
        value: {x, y, player},
    }),
    clickToOccupyCell: (x: number, y: number, player: string) => ({
        type: AppActionType.CLICK_TO_OCCUPY_CELL,
        value: {x, y, player},
    }),
};

export const Actions = {
    app,
};
