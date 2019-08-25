import * as React from "react";
import { createStore } from "redux";
import { rootReducer } from "../../state/reducers";
import { ConnectedPlayerDeskComponent } from "../player-desk/player-desk";
import "./page.css";

export const store = createStore(rootReducer);

export class PageComponent extends React.Component<{}> {
    public render() {
        return (
            <React.Fragment>
                <div className="grid-container">
                    <ConnectedPlayerDeskComponent player="player1" store={store} />
                    <ConnectedPlayerDeskComponent player="player2" store={store} />
                </div>
            </React.Fragment>
        );
    }
}
