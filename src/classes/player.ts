import { createDefaultDesk, IDesk } from "./desk";
import { IShip } from "./ship";

export interface IPlayer {
    desk: IDesk;
    name: string;
    fleet: IShip[];
}

export function createDefaultPlayer(): IPlayer {
    return {
        desk: createDefaultDesk(),
        fleet: [],
        name: "Noname",
    };
}
