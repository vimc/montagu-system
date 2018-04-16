import * as React from "react";
import {ChangeEvent} from "react";
import {ResponsibilityOverviewTitle} from "./ResponsibilityOverviewTitle";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {ResponsibilityOverviewDescription} from "./ResponsibilityOverviewDescription";
import {ResponsibilityOverviewContent} from "./ResponsibilityOverviewContent";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {ChooseActionPage} from "../../ChooseAction/ChooseActionPage";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {Page} from "../../../../shared/components/PageWithHeader/Page";
import {settings} from "../../../../shared/Settings";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class ResponsibilityOverviewPage extends ContribPageWithHeader<LocationProps> {

    constructor() {
        super();
        this.state = {
            checked: false
        }

        this.toggleChecked = this.toggleChecked.bind(this);
    }

    load(props: LocationProps) {
        return this.loadParent(props).then(() => {
            touchstoneActions.setCurrentTouchstone(props.touchstoneId);
            return responsibilityStore.fetchResponsibilities();
        });
    }

    name() {
        const s = responsibilityStore.getState();
        return s.currentTouchstone.description;
    }

    title() {
        return <ResponsibilityOverviewTitle/>;
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `responsibilities/${s.currentTouchstone.id}/`;
    }

    parent(): IPageWithParent {
        return new ChooseActionPage();
    }

    toggleChecked(e: ChangeEvent<HTMLInputElement>) {
        this.setState({checked: e.target.checked});
    }

    renderConfidentiality() {
        if (settings.isApplicantTouchstone(this.props.match.params.touchstoneId)) {
            return <div className={"row mb-4"}>
                <div className={"col-12 col-md-6 offset-md-3"}>
                    <div className={"border p-3 border-dark"}>
                        I have read and understood the RfP applicants' confidentiality agreement in full. This explains
                        in
                        details that vaccine coverage data for future years which is provided via Montagu is
                        confidential
                        and
                        must not be shared outside RfP applicants' specific modelling group.
                        <input type={"checkbox"}
                               checked={this.state.checked}
                               className={"form-control mt-2"}
                               onChange={this.toggleChecked}
                               style={{
                                   width: "30px",
                                   height: "30px",
                                   borderRadius: "5px",
                                   border: "2px solid #555",
                                   verticalAlign: "top"
                               }}/>
                    </div>
                </div>
            </div>
        }
    }

    canViewDetails() {
        return !settings.isApplicantTouchstone(this.props.match.params.touchstoneId)
            || this.state.checked
    }

    render(): JSX.Element {
        return <Page page={this}>
            {this.renderConfidentiality()}
            {this.canViewDetails() && <ResponsibilityOverviewDescription
                currentTouchstoneId={this.props.match.params.touchstoneId}
            />}
            {this.canViewDetails() && <ResponsibilityOverviewContent/>}
        </Page>;
    }
}