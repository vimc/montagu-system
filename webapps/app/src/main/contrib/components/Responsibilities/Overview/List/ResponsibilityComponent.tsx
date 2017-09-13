import * as React from "react";
import {
    ModellingGroup, Responsibility, ResponsibilitySetStatus,
    Touchstone
} from "../../../../../shared/models/Generated";
import { mainStore } from "../../../../stores/MainStore";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";

const styles = require("../../Responsibilities.css");

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

        const canUploadBurdenEstimate = this.props.responsibilitySetStatus == "incomplete";
        const uploadText = canUploadBurdenEstimate ? "Upload a new burden estimate set" : "No more burden estimates can be uploaded";
        return <li className={ styles.scenario }>
            <div className={ styles.header }>
                <span className={ styles.name }>{ item.scenario.description }</span>
                &nbsp;
                (ID: { item.scenario.id })
                <span className={ styles.status }>{ item.status }</span>
            </div>
            <div>
                <div className={ styles.content }>
                    <div className={ styles.metadata }>
                        Disease: { mainStore.getDiseaseById(item.scenario.disease).name }
                    </div>
                    <div className={ styles.actions }>
                        <ButtonLink href={ downloadUrl }>Download coverage data</ButtonLink>
                        <button disabled={ this.props.responsibilitySetStatus != "incomplete" }>{uploadText}</button>
                    </div>
                    <div className={ styles.estimates }>
                        You have not uploaded any burden estimate sets.
                    </div>
                </div>
            </div>
        </li>
    }
}