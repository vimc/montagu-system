import alt from "../alt";
import { AbstractActions } from "./AbstractActions";

interface Actions {
    error(error: string): string;
}

class ErrorActions extends AbstractActions implements Actions {
    error(error: string): string {
        return error;
    }
}

export const errorActions = alt.createActions<Actions>(ErrorActions);