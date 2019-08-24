import "./battle-field.css";
import React = require("react");

export interface IBattleFieldComponentProps {
    size: number;
}

const charArr: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];

export class BattleFieldComponent extends React.Component<IBattleFieldComponentProps>  {
    public render() {
        const cells: JSX.Element[] = [];
        const fieldSize: number = this.props.size + 1;
        let charInx: number = 0;

        for (let i = 1; i <= Math.pow(fieldSize, 2); i++) {
            if ((i - 1) % fieldSize == 0) {
                cells.push(<div className="numeric-label">{i > 1 ? ((i - 1) / fieldSize) : ""}</div>);
            } else if (i > 1 && i <= fieldSize) {
                cells.push(<div className="char-label">{charArr[charInx]}</div>);
                charInx ++;
            } else {
                cells.push(<div className="clickable"></div>);
            }
            
        }

        var divStyle = {
            gridTemplateColumns: `repeat(${fieldSize}, 30px)`,
        };

        return (
            <div
                className="battle-field-container"
                style={divStyle}>
                {cells}
            </div>
        );
    }
}