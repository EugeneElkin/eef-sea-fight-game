import { IShip } from "./ship";

export interface IPlayer {
    name: string;
    fleet: IShip[];
}