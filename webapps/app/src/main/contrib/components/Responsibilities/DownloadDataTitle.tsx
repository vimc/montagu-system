import * as React from "react";

import { InternalLink } from "../../../shared/components/InternalLink";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";

interface DownloadDataTitleProps {
    title: string;
    touchstone: Touchstone;
    group: ModellingGroup;
}

export class DownloadDataTitle extends React.Component<DownloadDataTitleProps, undefined> {
    renderReturnLink() {
        if (this.props.touchstone && this.props.group) {
            const url = `/${this.props.group.id}/responsibilities/${this.props.touchstone.id}/`;
            return <div className="titleAddition d-inline-block">
                <InternalLink href={ url }>Return to responsibilities list</InternalLink>
            </div>;
        } else {
            return null;
        }
    }

    render() {
        return <div>
            <div className="mr-3 d-inline-block">
            { this.props.title }
            </div>
            { this.renderReturnLink() }
        </div>;
    }
}
