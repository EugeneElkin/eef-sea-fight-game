import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { Observable, Subject } from "rxjs";
import { ICoordinate } from "../../classes/coordinate";
import { IPlayer } from "../../classes/player";
import { IShip } from "../../classes/ship";
import { Actions } from "../../state/actions";
import { ICombinedReducersEntries } from "../../state/reducers";
import { BattleFieldComponent } from "../battle-field/battle-field";
import { FleetStateComponent } from "../fleet-statistic/fleet-state";
import { ButtonComponent } from "../reusable-components/button";
import "./player-desk.css";

import React = require("react");

interface IPlayerDeskComponentProps {
    playerName: string;
    size: number;
    fieldCoordinates: ICoordinate[][];
    fleet: IShip[];
}

interface IPlayerDesktopHandlers {
    clickToOccupyCell: (x: number, y: number) => void;
    clickToFireCell: (x: number, y: number) => void;
}

interface IPlayerDesktopHandlersWrapper {
    handlers: IPlayerDesktopHandlers;
}

interface IPlayerDeskComponentDescriptor extends IPlayerDeskComponentProps, IPlayerDesktopHandlersWrapper {
}

class PlayerDeskComponent extends React.Component<IPlayerDeskComponentDescriptor>  {

    private subject: Subject<{}> = new Subject();

    public render() {
        return (
            <div className="player-desk-container">
                <div>{this.props.playerName}</div>
                <br />
                <BattleFieldComponent
                    size={this.props.size}
                    clickToOccupyCell={this.props.handlers.clickToOccupyCell}
                    clickToFireCell={this.props.handlers.clickToFireCell}
                    coordinates={this.props.fieldCoordinates}
                    deploymentNotification={this.deploymentNotification}
                />
                <br />
                <FleetStateComponent
                    fleet={this.props.fleet}
                    notifyAboutDeployment={this.notifyAboutDeployment}
                />
                <br />
                <ButtonComponent
                    isDisabled={true}
                    deploymentNotification={this.deploymentNotification}
                >I am ready to fight!</ButtonComponent>
            </div>
        );
    }

    private notifyAboutDeployment: () => void = () => this.subject.next();
    private deploymentNotification: () => Observable<{}> = () => this.subject.asObservable();
}

const mapReduxStateToComponentProps: (state: ICombinedReducersEntries, ownProps: any) => IPlayerDeskComponentProps = (state, ownProps) => {
    const playerState: IPlayer = state ? state.appReducer[ownProps.player] : undefined;

    return {
        fieldCoordinates: playerState ? playerState.desk.coordinates : [],
        fleet: playerState ? playerState.fleet : [],
        playerName: playerState ? playerState.name : "Noname",
        size: state ? state.appReducer.fieldSize : 10,
    };
};

const mapComponentEventsToReduxDispatches: (dispatch: Dispatch<Action<number>>, ownProps: any) => IPlayerDesktopHandlersWrapper =
    (dispatch, ownProps) => {
        return {
            handlers: {
                clickToFireCell: (x, y) => {
                    // do nothing for a while
                },
                clickToOccupyCell: (x, y) => {
                    dispatch(Actions.app.clickToOccupyCell(x, y, ownProps.player));
                },
            },
        };
    };

export const ConnectedPlayerDeskComponent: any = connect(
    mapReduxStateToComponentProps,
    mapComponentEventsToReduxDispatches,
)(PlayerDeskComponent);
