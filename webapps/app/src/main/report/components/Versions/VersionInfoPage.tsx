import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {VersionDetails} from "./VersionDetails";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";

export interface VersionInfoPageProps {
    report: string;
    version: string;
}

export class VersionInfoPage extends ReportingPageWithHeader<VersionInfoPageProps> {
    constructor(props: PageProperties<VersionInfoPageProps>) {
        super(props);
        this.changeVersion = this.changeVersion.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            const p = this.props.location.params;
            this.load(p.report, p.version);
        });
    }

    load(report: string, version: string) {
        reportActions.setCurrentReport(report);
        reportStore.fetchVersions().catch(doNothing).then(() => {
            reportActions.setCurrentVersion(version);
            reportStore.fetchVersionDetails().catch(doNothing);
        });
    }

    changeVersion(version: string) {
        const report = this.props.location.params.report;
        this.props.router.redirectTo(`/${report}/${version}/`, false);
        this.load(report, version);
    }

    title() {
        return <span>{this.props.location.params.report}</span>;
    }

    renderPageContent() {
        return <VersionDetails onChangeVersion={this.changeVersion} />;
    }
}