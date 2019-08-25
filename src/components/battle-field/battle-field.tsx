import React = require("react");
import { ICoordinate } from "../../classes/coordinate";
import "./battle-field.css";

export enum BattleFieldMode {
    battle,
    preparation,
}

export interface IBattleFieldComponentProps {
    size: number;
    mode: BattleFieldMode;
    coordinates: ICoordinate[][];
    clickToOccupyCell: (x: number, y: number) => void;
    clickToFireCell: (x: number, y: number) => void;
}

const charArr: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];

export class BattleFieldComponent extends React.Component<IBattleFieldComponentProps>  {
    public render() {
        const fieldSize: number = this.props.size + 1;

        const divStyle = {
            gridTemplateColumns: `repeat(${fieldSize}, 30px)`,
        };

        const handler = (this.props.mode === BattleFieldMode.preparation)
            ? this.props.clickToOccupyCell
            : this.props.clickToFireCell;

        return (
            <div
                className="battle-field-container"
                style={divStyle}>
                {this.buildCells(this.props.size + 1, handler)}
            </div>
        );
    }

    private buildCells(fieldSize: number, handler: (x: number, y: number) => void): JSX.Element[] {
        const cells: JSX.Element[] = [];
        let charInx: number = 0;

        for (let i = 1; i <= Math.pow(fieldSize, 2); i++) {
            if ((i - 1) % fieldSize === 0) {
                cells.push(<div className="numeric-label">{i > 1 ? ((i - 1) / fieldSize) : ""}</div>);
            } else if (i > 1 && i <= fieldSize) {
                cells.push(<div className="char-label">{charArr[charInx]}</div>);
                charInx++;
            } else {
                // TOODO: Adjusted only for field 10 x 10. For other sizes must be corrected.
                const x: number = (i % fieldSize) > 0 ? (i % fieldSize) - 2 : 9;
                const y: number = Math.floor((i - 2) / fieldSize) - 1;

                const cellClasses: string[] = ["clickable"];

                if (this.props.coordinates[x][y].isOccupied) {
                    cellClasses.push("is-occupied");
                }

                if (!this.props.coordinates[x][y].isAvailable) {
                    cellClasses.push("is-not-available");
                }

                cells.push(<div className={cellClasses.join(" ")} onClick={() => handler(x, y)}></div>);
            }

        }

        return cells;
    }
}
