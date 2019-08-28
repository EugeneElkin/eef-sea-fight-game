import { IDesk, createDefaultDesk } from "./desk";
import { IShip } from "./ship";

export interface IPlayer {
    name: string;
    fleet: IShip[];
    desk: IDesk;
}

export function createDefaultPlayer(): IPlayer {
    return {
        name: "Noname",
        desk: createDefaultDesk(),
        fleet: []
    };
}
