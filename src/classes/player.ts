import { IDesk } from "./desk";
import { IShip } from "./ship";

export interface IPlayer {
    name: string;
    fleet: IShip[];
    desk: IDesk;
}
