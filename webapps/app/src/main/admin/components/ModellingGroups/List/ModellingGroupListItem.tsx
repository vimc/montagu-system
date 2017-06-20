import * as React from "react";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { InternalLink } from "../../../../shared/components/InternalLink";

export class ModellingGroupListItem extends React.Component<ModellingGroup, undefined> {
    render() {
        const url = `/modelling-groups/${ this.props.id }/`
        return <InternalLink href={ url }>{ this.props.description }</InternalLink>;
    }
}