import { BattleFieldMode } from "../enums/battle-field-mode";
import { ICellCoordinate } from "./cell-coordinate";

export interface IDesk {
    coordinates: ICellCoordinate[][];
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
