import { AdminAppState } from "../../admin/reducers/adminAppReducers";
import { ContribAppState } from "../../contrib/reducers/contribAppReducers";
import { ReportAppState } from "../../report/reducers/reportAppReducers";

export type GlobalState = ContribAppState | AdminAppState | ReportAppState;