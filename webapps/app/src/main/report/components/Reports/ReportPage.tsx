import * as React from "react";
import { Dispatch, Action } from "redux";
import { connect } from 'react-redux';
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportDetails} from "./ReportDetails";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {appSettings} from "../../../shared/Settings";
import {MainMenu} from "../MainMenu/MainMenu";
import {ReportPageTitle} from "./ReportPageTitle";
import {reportPageActions} from "../../actions/reportPageActions";
import {Sidebar} from "./Sidebar";
import {PageHeader} from "../../../shared/components/PageWithHeader/PageHeader";

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
        this.redirectToVersion(version);
        setTimeout(()=> {
            this.loadVersion();
        });
    }

    loadVersion() {
        this.props.onLoad({
            report: this.getLocationParams().report,
            version: this.getLocationParams().version
        });
        this.createBreadcrumb();
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
        return <ReportPageTitle/>;
    }

    name() {
        const params = this.getLocationParams();
        return `${params.report} (${params.version})`;
    }

    urlFragment() {
        const params = this.getLocationParams();
        return `${params.report}/${params.version}/`;
    }

    render(): JSX.Element {
        return <div>
            <PageHeader siteTitle={this.siteTitle()}/>
            <div className={"container-fluid pt-4 sm-pt-5"}>
                <div className="row flex-xl-nowrap">
                    <div className="col-12 col-md-4 col-xl-2">
                        <Sidebar/>
                    </div>
                    <div className={"col-12 col-sm-10 col-md-8 pt-4 pt-md-1"}>
                        <ReportDetails onChangeVersion={this.changeVersion}/>
                    </div>
                </div>
            </div>
        </div>
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<PageProperties<ReportPageProps>> => {
    return {
        onLoad: (props: ReportPageProps) => dispatch(reportPageActions.onLoad(props))
    }
};

export const ReportPage = connect((props: PageProperties<ReportPageProps>) => props, mapDispatchToProps)(ReportPageComponent);