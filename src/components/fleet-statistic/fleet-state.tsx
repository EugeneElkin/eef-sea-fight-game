import React = require("react");
import { IShip } from "../../classes/ship";
import "./fleet-state.css";

interface IFleetStateComponentProps {
    fleet: IShip[];
}

export class FleetStateComponent extends React.Component<IFleetStateComponentProps> {
    public render() {
        return (
            <div className="fleet-state-container">
                <div className="ship-pic"><div></div><div></div><div></div><div></div></div><div> x 1</div>
                <div className="ship-pic"><div></div><div></div><div></div></div><div> x 2</div>
                <div className="ship-pic"><div></div><div></div></div><div> x 3</div>
                <div className="ship-pic"><div></div></div><div> x 4</div>
            </div>
        );
    }
}
