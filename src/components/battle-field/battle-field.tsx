import React = require("react");
import { ICellCoordinate } from "../../classes/cell-coordinate";
import { BattleFieldMode } from "../../enums/battle-field-mode";
import { CellComponent, CellStatus } from "../cell/cell";
import "./battle-field.css";

interface IBattleFieldComponentProps {
    coordinates: ICellCoordinate[][];
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

                cells.push(<CellComponent
                    key={i}
                    status={this.detecCellStatus(this.props.mode, this.props.coordinates[x][y])}
                    clickHandler={handler}
                    x={x}
                    y={y}
                />);
            }
        }

        return cells;
    }

    private detecCellStatus(mode: BattleFieldMode, cellData: ICellCoordinate): CellStatus {
        const showAll: boolean = this.props.mode === BattleFieldMode.MONITORING
        || this.props.mode === BattleFieldMode.WON
        || this.props.mode === BattleFieldMode.LOST;
        if ((showAll || this.props.mode === BattleFieldMode.UNDER_FIRE)
            && cellData.isBurried) {
            return CellStatus.IS_BURRIED;
        } else if ((showAll || this.props.mode === BattleFieldMode.UNDER_FIRE)
            && cellData.isFired
            && cellData.isOccupied) {
            return CellStatus.IS_HIT;
        } else if ((showAll || this.props.mode === BattleFieldMode.UNDER_FIRE)
            && cellData.isFired) {
            return CellStatus.IS_FIRED;
        } else if (this.props.mode === BattleFieldMode.DEPLOYMENT
            && !cellData.isAvailable) {
            return CellStatus.IS_NOT_ALLOWED;
        } else if ((showAll || this.props.mode === BattleFieldMode.DEPLOYMENT)
            && cellData.isOccupied) {
            return CellStatus.IS_OCCUPIED;
        } else if (this.props.mode === BattleFieldMode.READY_TO_FIGHT
            || this.props.mode === BattleFieldMode.MIST_OF_WAR) {
            return CellStatus.IS_INACTIVE;
        } else {
            return CellStatus.IS_CLEAR;
        }
    }
}
