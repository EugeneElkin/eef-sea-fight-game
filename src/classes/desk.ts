import { BattleFieldMode } from "../enums/battle-field-mode";
import { ICoordinate } from "./coordinate";

export interface IDesk {
    coordinates: ICoordinate[][];
    owner: string;
    state: BattleFieldMode;
}

export function createDefaultDesk(): IDesk {
    return {
        coordinates: [],
        owner: "Noname",
        state: BattleFieldMode.DEPLOYMENT,
    };
}
