import * as React from "react";
import { Dispatch, Action } from "redux";
import { connect } from 'react-redux';
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportDetails} from "./ReportDetails";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {appSettings} from "../../../shared/Settings";
import {MainMenu} from "../MainMenu/MainMenu";
import {ReportPageTitle} from "./ReportPageTitle";
import { Page } from "../../../shared/components/PageWithHeader/Page";
import {reportPageActions} from "../../actions/reportPageActions";

export interface ReportPageProps {
    report: string;
    version: string;
}

export class ReportPageComponent extends ReportingPageWithHeader<ReportPageProps> {
    constructor(props: PageProperties<ReportPageProps>) {
        super(props);
        this.changeVersion = this.changeVersion.bind(this);
    }

    componentDidMount() {
        this.loadVersion();
    }

    changeVersion(version: string): any {
        this.loadVersion();
        this.redirectToVersion(version);
    }

    loadVersion() {
        this.props.onLoad({
            report: this.getLocationParams().report,
            version: this.getLocationParams().version
        });
        setTimeout(()=> {
            this.createBreadcrumb();
        });
    }

    getLocationParams(){
        return this.props.location.params;
    }

    redirectToVersion(version: string) {
        this.props.router.redirectTo(`${appSettings.publicPath}/${this.getLocationParams().report}/${version}/`, false);
    }

    parent() {
        return new MainMenu();
    }

    title() {
        return <ReportPageTitle />;
    }

    name() {
        const params = this.getLocationParams();
        return `${params.report} (${params.version})`;
    }

    urlFragment() {
        const params = this.getLocationParams();
        return `${params.report}/${params.version}/`;
    }

    render() :JSX.Element {
        return <Page page={this}>
            <ReportDetails onChangeVersion={this.changeVersion} />
        </Page>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<PageProperties<ReportPageProps>> => {
    return {
        onLoad: (props: ReportPageProps) => dispatch(reportPageActions.onLoad(props))
    }
};

export const ReportPage = connect((props: PageProperties<ReportPageProps>) => props, mapDispatchToProps)(ReportPageComponent);