import React = require("react");
import { ICoordinate } from "../../classes/coordinate";
import { BattleFieldMode } from "../../enums/battle-field-mode";
import { CellComponent } from "../cell/cell";
import "./battle-field.css";

interface IBattleFieldComponentProps {
    coordinates: ICoordinate[][];
    mode: BattleFieldMode;
    size: number;
    clickToOccupyCell: (x: number, y: number) => void;
    clickToFireCell: (x: number, y: number) => void;
}

const charArr: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];

export class BattleFieldComponent extends React.Component<IBattleFieldComponentProps>  {
    constructor(props: any) {
        super(props);

        this.state = {
            mode: this.props.mode ? this.props.mode : BattleFieldMode.DEPLOYMENT,
        };
    }

    public render() {
        const fieldSize: number = this.props.size + 1;

        const divStyle = {
            gridTemplateColumns: `repeat(${fieldSize}, 30px)`,
        };

        let handler: ((x: number, y: number) => void) | undefined;
        if (this.props.mode === BattleFieldMode.DEPLOYMENT) {
            handler = this.props.clickToOccupyCell;
        } else if (this.props.mode === BattleFieldMode.UNDER_FIRE) {
            handler = this.props.clickToFireCell;
        }

        return (
            <div
                className="battle-field-container"
                style={divStyle}>
                {this.buildCells(this.props.size + 1, handler)}
            </div>
        );
    }

    private buildCells(fieldSize: number, handler?: (x: number, y: number) => void): JSX.Element[] {
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
                const cellStatus = {
                    isNotAllowed: this.props.mode === BattleFieldMode.DEPLOYMENT ? !this.props.coordinates[x][y].isAvailable : false,
                    isOccupied: this.props.mode === BattleFieldMode.DEPLOYMENT ? this.props.coordinates[x][y].isOccupied : false,
                };

                cells.push(<CellComponent
                    key={i}
                    status={cellStatus}
                    clickHandler={handler}
                    x={x}
                    y={y}
                />);
            }
        }

        return cells;
    }
}
