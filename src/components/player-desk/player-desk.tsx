import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { Observable, Subject } from "rxjs";
import { IDeskContext } from "../../classes/desk-context";
import { createDefaultPlayer, IPlayer } from "../../classes/player";
import { BattleFieldMode } from "../../enums/battle-field-mode";
import { Actions } from "../../state/actions";
import { ICombinedReducersEntries } from "../../state/reducers";
import { BattleFieldComponent } from "../battle-field/battle-field";
import { FleetStateComponent } from "../fleet-statistic/fleet-state";
import { ButtonComponent } from "../reusable-components/button/button";
import "./player-desk.css";

import React = require("react");

interface IPlayerDeskComponentProps {
    player: IPlayer;
    size: number;
}

interface IPlayerDesktopHandlers {
    clickToOccupyCell: (x: number, y: number) => void;
    clickToFireCell: (x: number, y: number) => void;
    clickToSetFieldReady: () => void;
    clickToSetOpponentFieldUnderFire: () => void;
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
                <div>MODE: {BattleFieldMode[this.props.player.desk.state]}</div>
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
                {this.props.player.desk.state === BattleFieldMode.DEPLOYMENT &&
                    <ButtonComponent
                        onClickHandler={this.props.handlers.clickToSetFieldReady}
                        enableNotification={this.observableDeploymentEnding}
                        isDisabled={true}
                    >I am ready to fight!</ButtonComponent>
                }
                {this.props.player.desk.state !== BattleFieldMode.DEPLOYMENT
                && this.props.player.desk.state !== BattleFieldMode.WON
                && this.props.player.desk.state !== BattleFieldMode.LOST &&
                    <ButtonComponent
                        onClickHandler={this.props.handlers.clickToSetOpponentFieldUnderFire}
                        isDisabled={this.props.player.desk.state !== BattleFieldMode.MIST_OF_WAR}
                    >Make a turn</ButtonComponent>
                }
            </div>
        );
    }

    private notifyAboutDeploymentEnding: () => void = () => this.deploymentEndingSubject.next(true);
    private observableDeploymentEnding: () => Observable<boolean> = () => this.deploymentEndingSubject.asObservable();
}

const mapReduxStateToComponentProps: (state: ICombinedReducersEntries, ownProps: IDeskContext) => IPlayerDeskComponentProps = (state, ownProps) => {
    const playerState: IPlayer = state ? state.appReducer[ownProps.player] : undefined;

    return {
        player: playerState ? playerState : createDefaultPlayer(),
        size: state ? state.appReducer.fieldSize : 10,
    };
};

const mapComponentEventsToReduxDispatches: (dispatch: Dispatch<Action<number>>, ownProps: IDeskContext) => IPlayerDesktopHandlersWrapper =
    (dispatch, ownProps) => {
        return {
            handlers: {
                clickToFireCell: (x, y) => {
                    dispatch(Actions.app.fireCell(x, y, ownProps));
                },
                clickToOccupyCell: (x, y) => {
                    dispatch(Actions.app.occupyCell(x, y, ownProps));
                },
                clickToSetFieldReady: () => {
                    dispatch(Actions.app.setBattlefieldReady(ownProps));
                },
                clickToSetOpponentFieldUnderFire: () => {
                    dispatch(Actions.app.setOpponentFieldUnderFire(ownProps));
                },
            },
        };
    };

export const ConnectedPlayerDeskComponent: any
    = connect<IPlayerDeskComponentProps, IPlayerDesktopHandlersWrapper, IDeskContext, ICombinedReducersEntries>(
        mapReduxStateToComponentProps,
        mapComponentEventsToReduxDispatches,
    )(PlayerDeskComponent);
