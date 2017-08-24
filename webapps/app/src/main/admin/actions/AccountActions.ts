import { alt } from "../../shared/alt";
import { AbstractActions } from "../../shared/actions/AbstractActions";

interface Actions {
    setPasswordResetToken(token: string): string;
    passwordResetTokenExpired(): boolean;
}

class AccountActions extends AbstractActions implements Actions {

    setPasswordResetToken(token: string): string {
        return token;
    }

    passwordResetTokenExpired(): boolean {
        return true;
    }

}

export const accountActions =
    alt.createActions<Actions>(AccountActions);
