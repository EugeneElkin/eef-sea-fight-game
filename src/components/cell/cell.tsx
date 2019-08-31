import "./cell.css";

import React = require("react");

export enum CellStatus {
    IS_CLEAR,
    IS_FIRED,
    IS_OCCUPIED,
    IS_NOT_ALLOWED,
    IS_INACTIVE,
    IS_HIT,
    IS_BURRIED,
}

interface ICellComponentProps {
    clickHandler?: (x: number, y: number) => void;
    status: CellStatus;
    x: number;
    y: number;
}

export class CellComponent extends React.Component<ICellComponentProps>  {
    public render() {
        let content: string | undefined;
        let cellClasses: string[] = ["clickable"];

        if (this.props.status === CellStatus.IS_OCCUPIED) {
            cellClasses.push("occupied");
        } else if (this.props.status === CellStatus.IS_NOT_ALLOWED) {
            cellClasses.push("unavailable");
        } else if (this.props.status === CellStatus.IS_INACTIVE) {
            cellClasses = ["inactive"];
        } else if (this.props.status === CellStatus.IS_FIRED) {
            cellClasses = ["fired"];
            content = "X";
        } else if (this.props.status === CellStatus.IS_HIT) {
            cellClasses = ["hit"];
            content = "X";
        } else if (this.props.status === CellStatus.IS_BURRIED) {
            cellClasses = ["burried"];
            content = "X";
        }

        if (this.props.clickHandler) {
            const handler: (x: number, y: number) => void = this.props.clickHandler;
            return (
                <div className={cellClasses.join(" ")} onClick={() => handler(this.props.x, this.props.y)}>{content}</div>
            );
        }

        return (
            <div className={cellClasses.join(" ")}>{content}</div>
        );
    }
}
