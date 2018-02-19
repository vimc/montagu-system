import { connect } from 'react-redux';
import * as React from "react";

import '../../../shared/components/PageWithHeader/PageWithHeader.scss';
import {ReportAppState} from "../../reducers/reportAppReducers";

export interface ReportPageTitleProps {
    name: string;
    displayName: string;
    version: string;
}

export const ReportPageTitleComponent =  (props: ReportPageTitleProps) => {
    const title = props.displayName || props.name;
    return <span>
        <div>{title}</div>
        <div className="titleAddition">
            Version: { props.version }
        </div>
    </span>;
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportPageTitleProps> => {
    return {
        name: state.reports.currentReport,
        version: state.reports.currentVersion,
        displayName: state.reports.versionDetails ? state.reports.versionDetails.displayname : ""
    }
};

export const ReportPageTitle = connect(mapStateToProps)(ReportPageTitleComponent);