import * as React from "react"

import {AbstractPageActionCreators} from "../shared/actions/AbstractPageActionCreators";
import {Page} from "../shared/components/Page";
import {ReportAppState} from "./reducers/reportAppReducers";

export function ReportPage<TLocationProps>(pageActionCreators: AbstractPageActionCreators<ReportAppState, TLocationProps>) {
    return Page<ReportAppState, TLocationProps>(pageActionCreators)
}
