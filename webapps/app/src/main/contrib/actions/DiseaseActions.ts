import alt from "../../alt";
import { Disease } from "../models/Generated";
import { FetchActions, FetchActionsInterface } from "./FetchActions";

export const diseaseActions = alt.createActions<FetchActionsInterface<Disease[]>>(class extends FetchActions<Disease[]> {});