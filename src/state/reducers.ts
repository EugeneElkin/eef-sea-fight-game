import { Reducer, combineReducers } from "redux";
import { IAppAction, AppActionType } from "./actions";

interface IAppReduxState {
    
}

export interface ICombinedReducersEntries {
    appReducer: IAppReduxState;
}

const initialAppReducerState: IAppReduxState = {
    
};

const appReducer: Reducer = (state: IAppReduxState = initialAppReducerState, action: IAppAction): IAppReduxState => {
    switch (action.type) {       
        case AppActionType.SET_WORD_ENTIRES:
            return {
                ...state,
                wordEntries: action.value,
            }
        default:
            return state;
    }
};

export const rootReducer: Reducer<ICombinedReducersEntries> = combineReducers({
    appReducer,
});
