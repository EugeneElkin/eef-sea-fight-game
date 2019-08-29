import "./cell.css";

import React = require("react");

interface ICellState {
    isOccupied: boolean;
    isNotAllowed: boolean;
}

interface ICellComponentProps {
    clickHandler?: (x: number, y: number) => void;
    status: ICellState;
    x: number;
    y: number;
}

export class CellComponent extends React.Component<ICellComponentProps>  {
    public render() {
        const cellClasses: string[] = ["clickable"];

        if (this.props.status.isOccupied) {
            cellClasses.push("is-occupied");
        }

        if (this.props.status.isNotAllowed) {
            cellClasses.push("is-not-available");
        }

        if (this.props.clickHandler) {
            const handler: (x: number, y: number) => void = this.props.clickHandler;
            return (
                <div className={cellClasses.join(" ")} onClick={() => handler(this.props.x, this.props.y)}></div>
            );
        }

        return (
            <div className={cellClasses.join(" ")}></div>
        );
    }
}
