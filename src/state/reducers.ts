import { combineReducers, Reducer } from "redux";
import { IPlayer } from "../classes/player";
import { BattleFieldMode } from "../enums/battle-field-mode";
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
            state: BattleFieldMode.DEPLOYMENT,
        },
        fleet: [],
        name: "Player 1",
    },
    player2: {
        desk: {
            coordinates: DataWorkShopService.createPureCoordinates(10),
            owner: "Player 2",
            state: BattleFieldMode.DEPLOYMENT,
        },
        fleet: [],
        name: "Player 2",
    },
};

const appReducer: Reducer = (currentState: IAppReduxState = initialAppReducerState, action: IAppAction): IAppReduxState => {

    const reducers = {
        [AppActionType.FIRE_CELL]: (state: IAppReduxState) => {
            const player: IPlayer = state[action.value.player];
            const enemy: IPlayer = state[action.value.enemy];
            DataWorkShopService.fireCell(action.value.x, action.value.y, player, enemy, state.fieldSize);
            return state;
        },
        [AppActionType.OCCUPY_CELL]: (state: IAppReduxState) => {
            const player: IPlayer = state[action.value.player];
            DataWorkShopService.occupyCell(action.value.x, action.value.y, player, state.fieldSize);
            return state;
        },
        [AppActionType.SET_BATTLEFIELD_READY]: (state: IAppReduxState) => {
            const player: IPlayer = state[action.value.player];
            const enemy: IPlayer = state[action.value.enemy];
            player.desk.state = BattleFieldMode.READY_TO_FIGHT;
            if (player.desk.state === BattleFieldMode.READY_TO_FIGHT
                && enemy.desk.state === BattleFieldMode.READY_TO_FIGHT) {
                player.desk.state = BattleFieldMode.MIST_OF_WAR;
            }
            return state;
        },
        [AppActionType.SET_OPPONENT_FIELD_UNDER_FIRE]: (state: IAppReduxState) => {
            const player: IPlayer = state[action.value.player];
            const enemy: IPlayer = state[action.value.enemy];
            player.desk.state = BattleFieldMode.MONITORING;
            enemy.desk.state = BattleFieldMode.UNDER_FIRE;
            return state;
        },
    };

    const clonnedState: IAppReduxState = JSON.parse(JSON.stringify(currentState));
    const reducer = reducers[action.type];

    if (reducer) {
        return reducer(clonnedState);
    }

    return clonnedState;
};

export const rootReducer: Reducer<ICombinedReducersEntries> = combineReducers({
    appReducer,
});
