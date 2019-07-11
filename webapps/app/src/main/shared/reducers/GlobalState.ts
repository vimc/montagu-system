import { AdminAppState } from "../../admin/reducers/adminAppReducers";
import { ContribAppState } from "../../contrib/reducers/contribAppReducers";

export type GlobalState = ContribAppState | AdminAppState;