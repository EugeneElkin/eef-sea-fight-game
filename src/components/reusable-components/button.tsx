import React = require("react");
import { Observable, Subscription } from "rxjs";
import "./button.css";

interface IButtonComponentProps {
    isDisabled?: boolean;
    deploymentNotification: () => Observable<boolean>;
}

interface IButtonComponentState {
    isDisabled?: boolean;
}

export class ButtonComponent extends React.Component<IButtonComponentProps, IButtonComponentState> {

    private subscription?: Subscription;

    constructor(props: any) {
        super(props);

        this.state = {
            isDisabled: true,
        };
    }

    public componentDidMount() {
        this.subscription = this.props.deploymentNotification().subscribe((isFilled) => {
            this.setState({ isDisabled: !isFilled });
        });
    }

    public componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public render() {
        return (
            <button disabled={this.state.isDisabled}>{this.props.children}</button>
        );
    }
}
