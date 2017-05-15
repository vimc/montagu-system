import alt from "../alt";
import { Disease } from "../Models";
import { FetchActions, FetchActionsInterface } from "./FetchActions";

export const diseaseActions = alt.createActions<FetchActionsInterface<Disease[]>>(class extends FetchActions<Disease[]> {});