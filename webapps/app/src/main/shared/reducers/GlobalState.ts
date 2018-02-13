import { AdminAppState } from "../../admin/reducers/adminReducers";
import { ContribAppState } from "../../contrib/reducers/contribReducers";
import { ReportAppState } from "../../report/reducers/reportReducers";
import {AuthState} from "./authReducer";

export type GlobalState = ContribAppState | AdminAppState | ReportAppState;