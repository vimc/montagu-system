import * as React from "react";
import {
    ModellingGroup, Responsibility, ResponsibilitySetStatus,
    Touchstone
} from "../../../../../shared/models/Generated";
import { mainStore } from "../../../../stores/MainStore";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";

const styles = require("../../Responsibilities.css");
const messageStyles = require("../../../../../shared/styles/messages.css");
const commonStyles = require("../../../../../shared/styles/common.css");

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
        const hasUploadedEstimate = this.props.responsibility.current_estimate_set != null;
        const estimateText = hasUploadedEstimate ?
            `You last uploaded an estimate on ${this.props.responsibility.current_estimate_set.uploaded_on}.`
            : "You have not uploaded any burden estimate sets.";

        const estimates = <div className={`${commonStyles.gapAbove} ${commonStyles.mr10} ${messageStyles.info}`}>
            {estimateText}</div>;

        return <li className={styles.scenario}>
            <div className={styles.header}>
                <span className={styles.name}>{item.scenario.description}</span>
                &nbsp;
                (ID: {item.scenario.id})
                <span className={styles.status}>{item.status}</span>
            </div>
            <div>
                <div className={styles.content}>
                    <div className={styles.metadata}>
                        Disease: {mainStore.getDiseaseById(item.scenario.disease).name}
                    </div>
                    <div className={styles.actions}>
                        <ButtonLink href={downloadUrl}>Download coverage data</ButtonLink>
                        <ButtonLink href={uploadUrl} disabled="disabled">Upload burden estimates</ButtonLink>
                        {estimates}
                    </div>
                </div>
            </div>
        </li>
    }
}