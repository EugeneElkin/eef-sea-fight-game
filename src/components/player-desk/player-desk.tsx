import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { Observable, Subject } from "rxjs";
import { IPlayer, createDefaultPlayer } from "../../classes/player";
import { Actions } from "../../state/actions";
import { ICombinedReducersEntries } from "../../state/reducers";
import { BattleFieldComponent } from "../battle-field/battle-field";
import { FleetStateComponent } from "../fleet-statistic/fleet-state";
import { ButtonComponent } from "../reusable-components/button";
import "./player-desk.css";

import React = require("react");
import { BattleFieldMode } from "../../enums/battle-field-mode";

interface IPlayerDeskComponentProps {
    player: IPlayer;
    size: number;
}

interface IPlayerDesktopHandlers {
    clickToOccupyCell: (x: number, y: number) => void;
    clickToFireCell: (x: number, y: number) => void;
    clickToSetFieldReady: () => void;
}

interface IPlayerDesktopHandlersWrapper {
    handlers: IPlayerDesktopHandlers;
}

interface IPlayerDeskComponentDescriptor extends IPlayerDeskComponentProps, IPlayerDesktopHandlersWrapper {
}

class PlayerDeskComponent extends React.Component<IPlayerDeskComponentDescriptor>  {

    private deploymentEndingSubject: Subject<boolean> = new Subject();

    public render() {
        return (
            <div className="player-desk-container">
                <div>{this.props.player.name}</div>
                <br />
                <BattleFieldComponent
                    clickToOccupyCell={this.props.handlers.clickToOccupyCell}
                    clickToFireCell={this.props.handlers.clickToFireCell}
                    coordinates={this.props.player.desk.coordinates}
                    mode={this.props.player.desk.state}
                    size={this.props.size}
                />
                <br />
                <FleetStateComponent
                    fleet={this.props.player.fleet}
                    notifyAboutDeployment={this.notifyAboutDeploymentEnding}
                />
                <br />
                <ButtonComponent
                    onClickHandler={this.props.handlers.clickToSetFieldReady}
                    enableNotification={this.observableDeploymentEnding}
                    isDisabled={true}
                >I am ready to fight!</ButtonComponent>
            </div>
        );
    }

    private notifyAboutDeploymentEnding: () => void = () => this.deploymentEndingSubject.next(true);
    private observableDeploymentEnding: () => Observable<boolean> = () => this.deploymentEndingSubject.asObservable();
}

const mapReduxStateToComponentProps: (state: ICombinedReducersEntries, ownProps: any) => IPlayerDeskComponentProps = (state, ownProps) => {
    const playerState: IPlayer = state ? state.appReducer[ownProps.player] : undefined;

    return {
        player: playerState ? playerState : createDefaultPlayer(),
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
                clickToSetFieldReady: () => {
                    dispatch(Actions.app.clickToSetBattlefieldReady(ownProps.player));
                }
            },
        };
    };

export const ConnectedPlayerDeskComponent: any = connect(
    mapReduxStateToComponentProps,
    mapComponentEventsToReduxDispatches,
)(PlayerDeskComponent);
