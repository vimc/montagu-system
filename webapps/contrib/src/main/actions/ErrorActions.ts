import alt from "../alt";
import { AbstractActions } from "./AbstractActions";

interface Actions {
    error(error: string | Error): string | Error;
}

class ErrorActions extends AbstractActions implements Actions {
    error(error: string | Error): string | Error {
        return error;
    }
}

export const errorActions = alt.createActions<Actions>(ErrorActions);