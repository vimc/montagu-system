import { AbstractStore } from "./AbstractStore";
import { errorActions } from "../actions/ErrorActions";
import { alt } from "../alt";
import { authActions, LogInProperties } from "../actions/AuthActions";
import { settings } from "../Settings";

export interface ErrorState {
    errors: string[];
}

function initialState(): ErrorState {
    return {
        errors: []
    }
}

class ErrorStore extends AbstractStore<ErrorState, AltJS.AltStore<ErrorState>> {
    errors: string[];

    constructor() {
        super();
        this.bindListeners({
            handleError: errorActions.error,
            handleLogIn: authActions.logIn
        });
    }

    initialState(): ErrorState {
        return initialState();
    }

    handleError(error: string | Error) {
        if (error instanceof Error) {
            error = error.message;
        }
        this.errors = [error, ...this.errors];
    }

    handleLogIn(props: LogInProperties) {
        if (!props.isAccountActive || !props.isModeller) {
            let reason: string;
            if (!props.isAccountActive) {
                reason = "Your account has been deactivated";
            } else {
                reason = "Only members of modelling groups can log into the contribution portal";
            }

            const support = settings.supportContact;
            this.errors = [`${reason}. Please contact ${support} for help.`, ...this.errors];
        }
    }
}

export const errorStore = alt.createStore<ErrorState>(ErrorStore) as AltJS.AltStore<ErrorState>;