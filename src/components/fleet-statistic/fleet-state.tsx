import "./fleet-state.css";
import React = require("react");

export class FleetStateComponent extends React.Component<{}> {
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