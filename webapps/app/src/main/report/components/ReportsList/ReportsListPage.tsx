import * as React from "react";

import {ReportsList} from "./ReportsList";
import {PinnedReports} from "./PinnedReports";
import {ReportPage} from "../../ReportPage";
import {reportListPageActionCreators} from "../../actionCreators/pages/ReportListPageActionCreators";

export const ReportsListPageComponent = () => {

    return <div className={"container-fluid pt-5"}>
        <div className={"row"}>
            <div className={"col-12 col-lg-10 offset-lg-1"}>
                <PinnedReports/>
                <ReportsList/>
            </div>
        </div>
    </div>;
};

export const ReportsListPage = ReportPage(reportListPageActionCreators)(ReportsListPageComponent);
