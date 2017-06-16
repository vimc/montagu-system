import alt from "../../shared/alt";
import { Disease } from "../../shared/models/Generated";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";

export const diseaseActions = alt.createActions<FetchActionsInterface<Disease[]>>(class extends FetchActions<Disease[]> {});