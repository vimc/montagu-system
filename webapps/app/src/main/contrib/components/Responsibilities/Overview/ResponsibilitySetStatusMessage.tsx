import {ResponsibilitySetStatus} from "../../../../shared/models/Generated";
import {ReviewedAndApprovedMessage} from "./List/CurrentEstimateSetSummary";
import * as React from "react";
import {settings} from "../../../../shared/Settings";

interface Props {
    status: ResponsibilitySetStatus
}

export class ResponsibilitySetStatusMessage extends React.Component<Props, undefined> {
    render(): JSX.Element {
        const {status} = this.props;
        if (status == "not-applicable") {
            const supportEmail = `mailto:${settings.supportContact}`;
            return <div className="info">
                Your modelling group has no responsibilities in this touchstone.
                If you think this is a mistake, please contact us <a href={supportEmail}>here</a>
            </div>;
        } else if (status == "approved") {
            return <div className="info"><ReviewedAndApprovedMessage/></div>;
        } else {
            return null;
        }
    }
}