import "./player-desk.css";

import React = require("react");
import { BattleFieldComponent } from "../battle-field/battle-field";
import { FleetStateComponent } from "../fleet-statistic/fleet-state";

interface IPlayerDeskComponentProps {
    name: string;
}

export class PlayerDeskComponent extends React.Component<IPlayerDeskComponentProps>  {
    public render() {
        return (
            <div className="player-desk-container">
                <div>{this.props.name}</div>
                <br/>
                <BattleFieldComponent size={10} />
                <br/>
                <FleetStateComponent />
            </div>
        );
    }
}
