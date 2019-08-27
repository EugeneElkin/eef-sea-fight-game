import { ICoordinate } from "../classes/coordinate";
import { IPlayer } from "../classes/player";
import { IShip } from "../classes/ship";

enum AttachmentToShipResult {
    SUCCESSFULLY,
    INCONSISTENT,
    FAILED,
}

export class DataWorkShopService {
    public static createPureCoordinates(fieldSize: number): ICoordinate[][] {
        const coordinates: ICoordinate[][] = new Array(fieldSize);

        for (let x = 0; x < fieldSize; x++) {
            coordinates[x] = [];
            for (let y = 0; y < fieldSize; y++) {
                coordinates[x][y] = {
                    isAvailable: true,
                    isFired: false,
                    isOccupied: false,
                    x,
                    y,
                };
            }
        }

        return coordinates;
    }

    public static occupyCell(x: number, y: number, player: IPlayer, fieldSize: number): void {
        const coordinates: ICoordinate[][] = player.desk.coordinates;
        if (!coordinates[x][y].isAvailable || coordinates[x][y].isOccupied) {
            return;
        }

        const attachedCells: ICoordinate[] = this.findAttachedCells(x, y, coordinates, fieldSize, player.fleet);
        const attachmentToShipResult: AttachmentToShipResult = this.tryToAttachToShip(x, y, coordinates, attachedCells, player.fleet);

        if (attachmentToShipResult === AttachmentToShipResult.SUCCESSFULLY) {
            this.markUnavailableCells(x, y, coordinates, fieldSize);
        } else if (attachmentToShipResult === AttachmentToShipResult.FAILED) {
            this.AddNewShip(x, y, coordinates, fieldSize, player.fleet);
        }

        if (this.isFleetDeployed(player.fleet)) {
            this.markRestCellsAsNotAllowed(coordinates);
        }
    }

    private static markRestCellsAsNotAllowed(coordinates: ICoordinate[][]): void {
        for (const col of coordinates) {
            for (const cell of col) {
                if (!cell.isOccupied) {
                    cell.isAvailable = false;
                }
            }
        }
    }

    private static isFleetDeployed(fleet: IShip[]): boolean {
        let numOfBattleships: number = 0;
        let numOfCruisers: number = 0;
        let numOfDestroyers: number = 0;
        let numOfTorpedoBoats: number = 0;

        for (const ship of fleet) {
            if (ship.coordinates.length === 1) {
                numOfTorpedoBoats++;
            }

            if (ship.coordinates.length === 2) {
                numOfDestroyers++;
            }

            if (ship.coordinates.length === 3) {
                numOfCruisers++;
            }

            if (ship.coordinates.length === 4) {
                numOfBattleships++;
            }
        }

        if (numOfTorpedoBoats === 4
            && numOfDestroyers === 3
            && numOfCruisers === 2
            && numOfBattleships) {
            return true;
        }

        return false;
    }

    private static AddNewShip(x: number, y: number, coordinates: ICoordinate[][], fieldSize: number, fleet: IShip[]): void {
        if (fleet.length < 10) {
            coordinates[x][y].isOccupied = true;
            fleet.push(
                {
                    coordinates: [coordinates[x][y]],
                    isDrown: false,
                },
            );

            this.markUnavailableCells(x, y, coordinates, fieldSize);
        }
    }

    private static markUnavailableCells(x: number, y: number, coordinates: ICoordinate[][], fieldSize: number): void {
        // left top
        let cornerX: number = x - 1;
        let cornerY: number = y - 1;
        if (x > 0 && y > 0) {
            coordinates[cornerX][cornerY].isAvailable = false;
        }

        // left bottom
        cornerX = x - 1;
        cornerY = y + 1;
        if (x > 0 && y < fieldSize - 1) {
            coordinates[cornerX][cornerY].isAvailable = false;
        }

        // rigth top
        cornerX = x + 1;
        cornerY = y - 1;
        if (x < fieldSize - 1 && y > 0) {
            coordinates[cornerX][cornerY].isAvailable = false;
        }

        // right bottom
        cornerX = x + 1;
        cornerY = y + 1;
        if (x < fieldSize - 1 && y < fieldSize - 1) {
            coordinates[cornerX][cornerY].isAvailable = false;
        }
    }

    private static tryToAttachToShip(
        x: number,
        y: number,
        coordinates: ICoordinate[][],
        nearCells: ICoordinate[],
        fleet: IShip[],
    ): AttachmentToShipResult {
        // If there are nearly occupied cells, the algorythm will try to attach it to a ship
        let numOfNear: number = 0;
        let resultState: AttachmentToShipResult = AttachmentToShipResult.FAILED;
        let lastSuitableShip: IShip | undefined;
        for (let k = 0; k < fleet.length; k++) {
            for (const nCell of nearCells) {
                const sh: IShip = fleet[k];
                if (sh.coordinates.find((cord) => cord.x === nCell.x && cord.y === nCell.y)) {
                    numOfNear += 1;
                    if (this.willBeFleetConsistent(fleet, coordinates[x][y], k)) {
                        lastSuitableShip = sh;
                    }

                    resultState = AttachmentToShipResult.INCONSISTENT;
                }
            }
        }

        if (numOfNear > 1) {
            resultState = AttachmentToShipResult.INCONSISTENT;
        } else if (numOfNear === 1 && lastSuitableShip) {
            lastSuitableShip.coordinates.push(coordinates[x][y]);
            coordinates[x][y].isOccupied = true;
            // If the cell is successfully attached it will be necessery to mark it as occupied
            resultState = AttachmentToShipResult.SUCCESSFULLY;
        }

        return resultState;
    }

    private static findAttachedCells(x: number, y: number, coordinates: ICoordinate[][], fieldSize: number, fleet: IShip[]): ICoordinate[] {
        let nearX: number = x;
        let nearY: number = y - 1;
        const nearCells: ICoordinate[] = [];
        if (y > 0) {
            nearCells.push(coordinates[nearX][nearY]);
        }

        nearX = x;
        nearY = y + 1;
        if (y < fieldSize - 1) {
            nearCells.push(coordinates[nearX][nearY]);
        }

        nearX = x - 1;
        nearY = y;
        if (x > 0) {
            nearCells.push(coordinates[nearX][nearY]);
        }

        nearX = x + 1;
        nearY = y;
        if (x < fieldSize - 1) {
            nearCells.push(coordinates[nearX][nearY]);
        }

        return nearCells;
    }

    private static willBeFleetConsistent(fleet: IShip[], nextCoordinate: ICoordinate, shipIndex: number): boolean {
        const newFleet: IShip[] = JSON.parse(JSON.stringify(fleet));
        newFleet[shipIndex].coordinates.push(nextCoordinate);

        let numOfBattleships: number = 0;
        let numOfCruisers: number = 0;
        let numOfDestroyers: number = 0;
        for (const ship of newFleet) {
            if (ship.coordinates.length > 4) {
                return false;
            }

            if (ship.coordinates.length === 4) {
                numOfBattleships += 1;
            }

            if (ship.coordinates.length === 3) {
                numOfCruisers += 1;
            }

            if (ship.coordinates.length === 2) {
                numOfDestroyers += 1;
            }

            if (numOfBattleships > 1) {
                return false;
            }

            if (numOfCruisers > 2) {
                return false;
            }

            if (numOfDestroyers > 3) {
                return false;
            }
        }

        return true;
    }
}
