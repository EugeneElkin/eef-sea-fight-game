import { combineReducers, Reducer } from "redux";
import { IPlayer } from "../classes/player";
import { DataWorkShopService } from "../services/data-workshop-service";
import { AppActionType, IAppAction } from "./actions";

interface IAppReduxState {
    player1: IPlayer;
    player2: IPlayer;
    fieldSize: number;
}

export interface ICombinedReducersEntries {
    appReducer: IAppReduxState;
}

const initialAppReducerState: IAppReduxState = {
    fieldSize: 10,
    player1: {
        desk: {
            coordinates: DataWorkShopService.createPureCoordinates(10),
            owner: "Player 1",
        },
        fleet: [],
        name: "Player 1",
    },
    player2: {
        desk: {
            coordinates: DataWorkShopService.createPureCoordinates(10),
            owner: "Player 2",
        },
        fleet: [],
        name: "Player 2",
    },
};

const appReducer: Reducer = (state: IAppReduxState = initialAppReducerState, action: IAppAction): IAppReduxState => {
    switch (action.type) {
        case AppActionType.CLICK_TO_OCCUPY_CELL:
            const newState: IAppReduxState = JSON.parse(JSON.stringify(state));
            const player: IPlayer = newState[action.value.player];
            DataWorkShopService.occupyCell(action.value.x, action.value.y, player, newState.fieldSize);
            return newState;
        default:
            return state;
    }
};

export const rootReducer: Reducer<ICombinedReducersEntries> = combineReducers({
    appReducer,
});
