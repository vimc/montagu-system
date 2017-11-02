import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {VersionDetails} from "./VersionDetails";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {Router} from "simple-react-router";

export interface VersionInfoPageProps {
    report: string;
    version: string;
}

export class VersionInfoPage extends ReportingPageWithHeader<VersionInfoPageProps> {
    componentDidMount() {
        setTimeout(() => {
            const p = this.props.location.params;
            VersionInfoPage.load(p.report, p.version);
        });
    }

    static load(report: string, version: string) {
        reportActions.setCurrentReport(report);
        reportStore.fetchVersions().catch(doNothing).then(() => {
            reportActions.setCurrentVersion(version);
            reportStore.fetchVersionDetails().catch(doNothing);
        });
    }

    static changeVersion(report: string, version: string, router: Router<any>) {
        router.redirectTo(`/${report}/${version}`, false);
        VersionInfoPage.load(report, version);
    }

    title() {
        return <span>{this.props.location.params.report}</span>;
    }

    renderPageContent() {
        return <VersionDetails router={this.props.router} />;
    }
}