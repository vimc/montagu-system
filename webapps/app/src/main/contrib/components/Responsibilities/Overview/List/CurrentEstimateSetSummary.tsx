import * as React from "react";
import {BurdenEstimateSet} from "../../../../../shared/models/Generated";
import {settings} from "../../../../../shared/Settings";
import {longTimestamp} from "../../../../../shared/Helpers";
import {FileDownloadButton} from "../../../../../shared/components/FileDownloadLink";

export interface CurrentEstimateSetSummaryProps {
    estimateSet: BurdenEstimateSet;
    canUpload: boolean;
    groupId: string;
    touchstoneId: string;
    scenarioId: string
}

export class CurrentEstimateSetSummary extends React.Component<CurrentEstimateSetSummaryProps, undefined> {
    static getMessage(set: BurdenEstimateSet, canUpload: boolean): JSX.Element {
        if (!canUpload) {
            return <ReviewedAndApprovedMessage/>;
        } else {
            if (set == null) {
                return <span>No central burden estimate sets have been uploaded.</span>;
            } else {
                const timestamp = longTimestamp(new Date(set.uploaded_on));
                const filename = set.original_filename ? ` with filename \"${set.original_filename}\"` : "";
                if (set.status == "empty") {
                    return <span>
                        You registered how you calculated your central estimates on {timestamp}.
                    </span>;
                } else if (set.status == "complete") {
                    return <span>
                        A complete set of central estimates was uploaded on {timestamp} {filename}
                    </span>;
                } else if (set.status == "invalid") {
                    return <span>
                        You uploaded an incomplete set of central estimates on {timestamp} {filename}
                    </span>;
                } else {
                    return <span>
                        You have a central estimate set in status '{set.status}', which was created on {timestamp}
                    </span>;
                }
            }
        }
    }

    url() {
        if (this.props.estimateSet && this.props.estimateSet.status != "empty") {
            return `/modelling-groups/${this.props.groupId}/responsibilities/${this.props.touchstoneId}/${this.props.scenarioId}/estimate-sets/${this.props.estimateSet.id}/estimates/`
        } else {
            null
        }
    }

    render(): JSX.Element {
        const {estimateSet, canUpload} = this.props;
        const estimateText = CurrentEstimateSetSummary.getMessage(estimateSet, canUpload);
        const alertType = (estimateSet && estimateSet.status == "invalid") ? "danger" : "warning";
        const url = this.url();
        return <div className={`mt-3 alert alert-${alertType} text-left`}>
            {estimateText}
            {url && [
                <FileDownloadButton href={url} className={"float-right mr-0"} key={`download-${estimateSet.id}`}>
                    Download these estimates
                </FileDownloadButton>,
                <div className={"clearfix"} key={`clearfix-${estimateSet.id}`}></div>
            ]}
        </div>;
    }
}

export class ReviewedAndApprovedMessage extends React.Component<{}, undefined> {
    render(): JSX.Element {
        const supportEmail = `mailto:${settings.supportContact}`;
        return <span>
            The burden estimates uploaded by your modelling group have been reviewed and approved.
            You cannot upload any new estimates. If you need to upload new estimates (e.g. for corrections) please
            contact us <a href={supportEmail}>here</a>.
        </span>;
    }
}