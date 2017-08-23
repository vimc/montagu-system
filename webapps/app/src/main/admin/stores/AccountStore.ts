import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { RemoteContent } from "../../shared/models/RemoteContent";
import StoreModel = AltJS.StoreModel;
import { accountActions } from "../actions/AccountActions";
import { authActions } from "../../shared/actions/AuthActions";

export interface AccountStoreState extends RemoteContent {
    passwordResetToken: string;
    tokenExpired: boolean;
}

export interface AccountStoreInterface extends AltJS.AltStore<AccountStoreState> {

}

class AccountStore
    extends AbstractStore<AccountStoreState, AccountStoreInterface> {
    passwordResetToken: string;
    tokenExpired: boolean;
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleSetPasswordResetToken: accountActions.setPasswordResetToken,
            handlePasswordResetTokenExpired: accountActions.passwordResetTokenExpired,
            handleLogin: authActions.logIn
        });
    }

    initialState(): AccountStoreState {
        return {
            ready: false,
            passwordResetToken: null,
            tokenExpired: false
        };
    }

    handleSetPasswordResetToken(token: string) {
        this.passwordResetToken = token;
    }

    handlePasswordResetTokenExpired(){
        this.tokenExpired = true;
    }

    handleLogin(){
        this.tokenExpired = false;
        this.passwordResetToken = null;
    }
}

export const accountStore = alt.createStore<AccountStoreState>(AccountStore as StoreModel<AccountStoreState>) as AccountStoreInterface;