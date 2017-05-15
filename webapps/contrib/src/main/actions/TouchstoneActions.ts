import alt from "../alt";
import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { Touchstone } from "../Models";

export const touchstoneActions = alt.createActions<FetchActionsInterface<Touchstone[]>>(class extends FetchActions<Touchstone[]> {});

