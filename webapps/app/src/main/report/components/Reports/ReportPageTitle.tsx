import { connect } from 'react-redux';
import * as React from "react";

import {ReportAppState} from "../../reducers/reportAppReducers";

export interface ReportPageTitleProps {
    displayName: string;
    version: string;
}

export const ReportPageTitleComponent =  (props: ReportPageTitleProps) => {
    return <span>
        <div>{props.displayName}</div>
        <div className="titleAddition">
            Version: { props.version }
        </div>
    </span>;
}

export const mapStateToProps = (state: ReportAppState): ReportPageTitleProps => {
    return {
        version: state.reports.versionDetails.id,
        displayName: state.reports.versionDetails && state.reports.versionDetails.displayname ? state.reports.versionDetails.displayname : state.reports.currentReport
    }
};

export const ReportPageTitle = connect(mapStateToProps)(ReportPageTitleComponent);