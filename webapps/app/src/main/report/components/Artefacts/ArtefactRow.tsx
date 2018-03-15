import * as React from "react";
import {Card, CardHeader, CardBody} from "reactstrap";

interface ArtefactRowProps {
    description: string;
}

export class ArtefactRow extends React.Component<ArtefactRowProps, undefined> {
    render() {
        return <Card>
            <CardHeader>
                {this.props.description}
            </CardHeader>
            <CardBody>
                {this.props.children}
            </CardBody>
        </Card>;
    }
}