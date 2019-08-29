import React = require("react");
import { Observable, Subscription } from "rxjs";
import "./button.css";

interface IButtonComponentProps {
    isDisabled?: boolean;
    enableNotification?: () => Observable<boolean>;
    onClickHandler?: () => void;
}

interface IButtonComponentState {
    isDisabled: boolean;
}

export class ButtonComponent extends React.Component<IButtonComponentProps, IButtonComponentState> {

    private subscription?: Subscription;

    constructor(props: any) {
        super(props);

        this.state = {
            isDisabled: this.props.isDisabled ? this.props.isDisabled : false,
        };
    }

    public componentDidMount() {
        if (this.props.enableNotification) {
            this.subscription = this.props.enableNotification().subscribe((isEnabled) => {
                this.setState({ isDisabled: !isEnabled });
            });
        }
    }

    public componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public render() {
        return (
            <button
                disabled={this.state.isDisabled}
                onClick={this.props.onClickHandler}
            >{this.props.children}</button>
        );
    }
}
