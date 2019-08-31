import { ICoordinate } from "./coordinate";

export interface ICellCoordinate extends ICoordinate {
    isFired: boolean;
    isOccupied: boolean;
    isAvailable: boolean;
    isBurried: boolean;
}
