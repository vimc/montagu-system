import * as React from "react";

export class CheckboxProps{
    label: string;
    isChecked: boolean;
}
class CheckboxState{
    isChecked: boolean;
}

export class Checkbox extends React.Component<CheckboxProps, CheckboxState> {

    componentWillMount() {
        this.setState({
            isChecked: this.props.isChecked
        });
    }

    toggleCheckbox(){
        this.setState({isChecked : !this.state.isChecked})
    }

    render() {

        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        value={this.props.label}
                        checked={this.state.isChecked}
                        onChange={this.toggleCheckbox.bind(this)}
                    />

                    {this.props.label}
                </label>
            </div>
        );
    }
}

