import { AdminAppState } from "../../admin/reducers/adminReducers";
import { ContribAppState } from "../../contrib/reducers/contribReducers";
import { ReportAppState } from "../../report/reducers/reportReducers";

export type GlobalState = ContribAppState | AdminAppState | ReportAppState;