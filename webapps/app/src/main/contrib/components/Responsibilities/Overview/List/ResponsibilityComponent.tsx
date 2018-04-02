import * as React from "react";

import {
    ModellingGroup, Responsibility, ResponsibilitySetStatus,
    Touchstone
} from "../../../../../shared/models/Generated";
import { mainStore } from "../../../../stores/MainStore";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";
import {CurrentEstimateSetSummary} from "./CurrentEstimateSetSummary";

interface Props {
    responsibility: Responsibility;
    modellingGroup: ModellingGroup;
    touchstone: Touchstone;
    responsibilitySetStatus: ResponsibilitySetStatus;
}

export class ResponsibilityComponent extends React.Component<Props, undefined> {
    render() {
        const item = this.props.responsibility;
        const downloadUrl = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/coverage/${item.scenario.id}/`;
        const uploadUrl = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/burdens/${item.scenario.id}/`;
        const canUpload = this.props.responsibilitySetStatus == "incomplete";

        return <li className="scenario">
            <div className="header">
                <span className="name">{item.scenario.description}</span>
                &nbsp;
                (ID: {item.scenario.id})
                <span className="status">{item.status}</span>
                <span className="clearfix"></span>
            </div>
            <div>
                <div className="content">
                    <div className="metadata">
                        Disease: {mainStore.getDiseaseById(item.scenario.disease).name}
                    </div>
                    <div className="actions">
                        <ButtonLink href={downloadUrl}>Download coverage data</ButtonLink>
                        <ButtonLink href={uploadUrl}>Upload burden estimates</ButtonLink>
                        <CurrentEstimateSetSummary
                            estimateSet={this.props.responsibility.current_estimate_set}
                            canUpload={canUpload}
                        />
                    </div>
                </div>
            </div>
        </li>
    }
}