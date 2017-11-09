import * as React from "react";

interface ArtefactRowProps {
    description: string;
}

export class ArtefactRow extends React.Component<ArtefactRowProps, undefined> {
    render() {
        return <div className="row">
            <div className="col-12 col-md-3">
                {this.props.description}
            </div>
            <div className="col-12 col-md-9">
                <ul>{this.props.children}</ul>
            </div>
        </div>;
    }
}