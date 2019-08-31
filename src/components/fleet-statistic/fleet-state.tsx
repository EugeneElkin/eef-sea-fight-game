import React = require("react");
import { IShip } from "../../classes/ship";
import "./fleet-state.css";

interface IFleetStateComponentProps {
    fleet: IShip[];
    notifyAboutDeployment: () => void;
}

export class FleetStateComponent extends React.Component<IFleetStateComponentProps> {
    public render() {
        let numOfBattleships: number = 0;
        let numOfCruisers: number = 0;
        let numOfDestroyers: number = 0;
        let numOfTorpedoBoats: number = 0;
        const activeFleet: IShip[] = this.props.fleet.filter((x) => !x.isDrown);
        for (const ship of activeFleet) {
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
                this.props.notifyAboutDeployment();
        }

        return (
            <div className="fleet-state-container">
                <div className="ship-pic"><div></div><div></div><div></div><div></div></div><div> x [{numOfBattleships}/1]</div>
                <div className="ship-pic"><div></div><div></div><div></div></div><div> x [{numOfCruisers}/2]</div>
                <div className="ship-pic"><div></div><div></div></div><div> x [{numOfDestroyers}/3]</div>
                <div className="ship-pic"><div></div></div><div> x [{numOfTorpedoBoats}/4]</div>
            </div>
        );
    }
}
