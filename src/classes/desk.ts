import { ICoordinate } from "./coordinate";
import { BattleFieldMode } from "../enums/battle-field-mode";

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
