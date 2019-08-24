import { ICoordinate } from "./coordinate";

export interface IShip {
    coordinates: ICoordinate[];
    isDrown: boolean;    
}