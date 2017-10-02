import * as React from "react";

interface Props
{
    clickHandler: (e: any) => void,
    text: string;
}

export class RemoveLink extends React.Component<Props, undefined> {

    render() {

        return <a href="#" className="text-danger float-right" onClick={this.props.clickHandler}>
            {this.props.text}</a>;
    }
}