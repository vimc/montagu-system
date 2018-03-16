import * as React from "react";
import {Card, CardHeader, CardBody} from "reactstrap"

interface Props {
    title: string;
}

export class ReportDownloadSection extends React.Component<Props> {

    render() {
        return <Card className="mb-2">
            <CardHeader>{this.props.title}</CardHeader>
            <CardBody>{this.props.children}</CardBody>
        </Card>
    }
}