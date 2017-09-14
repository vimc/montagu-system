import * as React from "react";
import {
    ModellingGroup, Responsibility, ResponsibilitySetStatus,
    Touchstone
} from "../../../../../shared/models/Generated";
import { mainStore } from "../../../../stores/MainStore";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";
import { UploadForm } from "../UploadForm";

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
                        <UploadForm canUpload={ canUploadBurdenEstimate }
                                    groupId={ this.props.modellingGroup.id }
                                    responsibility={ this.props.responsibility }/>
                    </div>
                </div>
            </div>
        </li>
    }
}