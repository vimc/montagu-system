import * as React from "react";
import { connect } from 'react-redux';
// import { Dispatch } from "redux";

import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
// import {reportStore} from "../../stores/ReportStore";
// import {connectToStores} from "../../../shared/alt";
import {ReportListItem} from "./ReportListItem";
import { Report } from "../../../shared/models/Generated";
// import {modellingGroupsActions} from "../../../contrib/actions/modellingGroupsActions";
// import {
//     ChooseGroupContentComponent,
//     ChooseGroupProps
// } from "../../../contrib/components/ChooseGroup/ChooseGroupContent";
// import {ContribAppState} from "../../../contrib/reducers/contribReducers";
import {ReportAppState} from "../../reducers/reportReducers";

interface ReportProps extends RemoteContent {
    reports: Report[]
}

export class ReportListComponent extends RemoteContentComponent<ReportProps, undefined> {
    // static getStores() {
    //     return [reportStore];
    // }
    //
    // static getPropsFromStores(): ReportProps {
    //     const s = reportStore.getState();
    //     return {
    //         reports: s.reports,
    //         ready: s.ready
    //     };
    // }

    renderContent(props: ReportProps) {
        const items = props.reports
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((report) => <ReportListItem key={ report.name } {...report} />);

        return <ul>
            {items}
        </ul>;
    }
}

// export const ReportList = connectToStores(ReportListComponent);

export const mapStateToProps = (state: ReportAppState): ReportProps => {
    return {
        reports: state.reports.items,
    }
};

export const ReportList = connect(mapStateToProps)(ReportListComponent);