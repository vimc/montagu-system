import * as React from "react";
import {BurdenEstimateSet} from "../../../../../shared/models/Generated";
import {settings} from "../../../../../shared/Settings";
import {longDate, longTimestamp} from "../../../../../shared/Helpers";

const messageStyles = require("../../../../../shared/styles/messages.css");

interface Props {
    estimateSet: BurdenEstimateSet;
    canUpload: boolean;
}

export class CurrentEstimateSetSummary extends React.Component<Props, undefined> {
    static getMessage(set: BurdenEstimateSet, canUpload: boolean): JSX.Element {
        if (!canUpload) {
            const supportEmail = `mailto:${settings.supportContact}`;
            return <span>
                The burden estimates uploaded by your modelling group have been reviewed and approved.
                You cannot upload any new estimates. If you need to upload new estimates (e.g. for corrections) please
                contact us <a href={supportEmail}>here</a>.
            </span>;
        } else {
            if (set == null) {
                return <span>No burden estimate sets have been uploaded.</span>;
            } else {
                const timestamp = longTimestamp(new Date(set.uploaded_on));
                if (set.status == "empty") {
                    return <span>
                        An empty burden estimate set was created on {timestamp}.
                    </span>;
                } else if (set.status == "complete") {
                    return <span>
                        A complete estimate set was uploaded on {timestamp}.
                    </span>;
                } else {
                    return <span>
                        You have an estimate set in status '{set.status}', which was created on {timestamp}
                    </span>;
                }
            }
        }
    }

    render(): JSX.Element {
        const {estimateSet, canUpload} = this.props;
        const estimateText = CurrentEstimateSetSummary.getMessage(estimateSet, canUpload);

        return <div className={"mt-3 mr-3 " + messageStyles.info}>
            {estimateText}
        </div>;
    }
}