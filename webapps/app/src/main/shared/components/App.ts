import {CommonState} from "../reducers/CommonState";
import {History} from "history";

export interface AppProps {
    loggedIn: boolean;
    permissions: string[];
    history?: History;
}

export const mapStateToAppProps = (state: CommonState, props: Partial<AppProps>): AppProps => {
    return {
        loggedIn: state.auth.loggedIn,
        permissions: state.auth.permissions,
        history: props.history
    }
};
