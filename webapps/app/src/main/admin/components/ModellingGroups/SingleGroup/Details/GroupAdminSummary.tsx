import * as React from "react";
import { ModellingGroupDetails } from "../../../../../shared/models/Generated";
import { InternalLink } from "../../../../../shared/components/InternalLink";

export class GroupAdminSummary extends React.Component<ModellingGroupDetails, undefined> {
    render() {
        const url = `/modelling-groups/${this.props.id}/admin/`;
        const admins = this.props.admins;
        if (admins.length == 0) {
            return <span>
                This group does not have an admin.
                Please click <InternalLink href={ url }>here</InternalLink> to choose one.
            </span>;
        } else {
            const items = admins.join(", ");
            return <span>
                { items } (<InternalLink href={ url }>change</InternalLink>)
            </span>
        }
    }
}