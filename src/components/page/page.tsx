import "./page.css";

import * as React from "react";
import { PlayerDeskComponent } from "../player-desk/player-desk";

export class PageComponent extends React.Component<{}> {
    public render() {
        return (
            <React.Fragment>
                <div className="grid-container">
                    <PlayerDeskComponent name="Player 1" />
                    <PlayerDeskComponent name="Player 2" />
                </div>
            </React.Fragment>
        );
    }
}
