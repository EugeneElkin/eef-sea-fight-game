import { ICellCoordinate } from "../classes/cell-coordinate";
import { IPlayer } from "../classes/player";
import { IShip } from "../classes/ship";
import { BattleFieldMode } from "../enums/battle-field-mode";

enum AttachmentToShipResult {
    SUCCESSFULLY,
    INCONSISTENT,
    FAILED,
}

export class DataWorkShopService {
    public static createPureCoordinates(fieldSize: number): ICellCoordinate[][] {
        const coordinates: ICellCoordinate[][] = new Array(fieldSize);

        for (let x = 0; x < fieldSize; x++) {
            coordinates[x] = [];
            for (let y = 0; y < fieldSize; y++) {
                coordinates[x][y] = {
                    isAvailable: true,
                    isBurried: false,
                    isFired: false,
                    isOccupied: false,
                    x,
                    y,
                };
            }
        }

        return coordinates;
    }

    public static fireCell(x: number, y: number, player: IPlayer, enemy: IPlayer, fieldSize: number) {
        if (player.desk.coordinates[x][y].isFired) {
            return;
        }
        player.desk.coordinates[x][y].isFired = true;
        const targetShip: IShip | undefined = player.fleet.find((sh) => sh.coordinates.find((cord) => cord.x === x && cord.y === y));
        if (targetShip && targetShip.coordinates) {
            const hits: boolean[] = [];
            for (const cord of targetShip.coordinates) {
                if (player.desk.coordinates[cord.x][cord.y].isFired) {
                    hits.push(true);
                }
            }

            if (hits.length === targetShip.coordinates.length) {
                for (const cord of targetShip.coordinates) {
                    player.desk.coordinates[cord.x][cord.y].isBurried = true;
                }
                targetShip.isDrown = true;
                this.markNearestShipCellsAsFired(targetShip, player.desk.coordinates, fieldSize);
            }

            if (!player.fleet.find((sh) => !sh.isDrown)) {
                player.desk.state = BattleFieldMode.LOST;
                enemy.desk.state = BattleFieldMode.WON;
            }
        } else {
            // Give a turn to other player
            player.desk.state = BattleFieldMode.MIST_OF_WAR;
            enemy.desk.state = BattleFieldMode.READY_TO_FIGHT;
        }
    }

    public static occupyCell(x: number, y: number, player: IPlayer, fieldSize: number): void {
        const coordinates: ICellCoordinate[][] = player.desk.coordinates;
        if (!coordinates[x][y].isAvailable || coordinates[x][y].isOccupied) {
            return;
        }

        const attachedCells: ICellCoordinate[] = this.findAttachedCells(x, y, coordinates, fieldSize, player.fleet);
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

    private static markNearestShipCellsAsFired(ship: IShip, coordinates: ICellCoordinate[][], fieldSize: number) {
        for (const cord of ship.coordinates) {
            // top
            let cornerX: number = cord.x;
            let cornerY: number = cord.y - 1;
            if (cord.y > 0) {
                coordinates[cornerX][cornerY].isFired = true;
            }
            // left top
            cornerX = cord.x - 1;
            cornerY = cord.y - 1;
            if (cord.x > 0 && cord.y > 0) {
                coordinates[cornerX][cornerY].isFired = true;
            }

            // left
            cornerX = cord.x - 1;
            cornerY = cord.y;
            if (cord.x > 0) {
                coordinates[cornerX][cornerY].isFired = true;
            }

            // left bottom
            cornerX = cord.x - 1;
            cornerY = cord.y + 1;
            if (cord.x > 0 && cord.y < fieldSize - 1) {
                coordinates[cornerX][cornerY].isFired = true;
            }

            // bottom
            cornerX = cord.x;
            cornerY = cord.y + 1;
            if (cord.y < fieldSize - 1) {
                coordinates[cornerX][cornerY].isFired = true;
            }

            // right bottom
            cornerX = cord.x + 1;
            cornerY = cord.y + 1;
            if (cord.x < fieldSize - 1 && cord.y < fieldSize - 1) {
                coordinates[cornerX][cornerY].isFired = true;
            }

            // right
            cornerX = cord.x + 1;
            cornerY = cord.y;
            if (cord.x < fieldSize - 1) {
                coordinates[cornerX][cornerY].isFired = true;
            }

            // rigth top
            cornerX = cord.x + 1;
            cornerY = cord.y - 1;
            if (cord.x < fieldSize - 1 && cord.y > 0) {
                coordinates[cornerX][cornerY].isFired = true;
            }
        }
    }

    private static markRestCellsAsNotAllowed(coordinates: ICellCoordinate[][]): void {
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

    private static AddNewShip(x: number, y: number, coordinates: ICellCoordinate[][], fieldSize: number, fleet: IShip[]): void {
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

    private static markUnavailableCells(x: number, y: number, coordinates: ICellCoordinate[][], fieldSize: number): void {
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
        coordinates: ICellCoordinate[][],
        nearCells: ICellCoordinate[],
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

    private static findAttachedCells(x: number, y: number, coordinates: ICellCoordinate[][], fieldSize: number, fleet: IShip[]): ICellCoordinate[] {
        let nearX: number = x;
        let nearY: number = y - 1;
        const nearCells: ICellCoordinate[] = [];
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

    private static willBeFleetConsistent(fleet: IShip[], nextCoordinate: ICellCoordinate, shipIndex: number): boolean {
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
