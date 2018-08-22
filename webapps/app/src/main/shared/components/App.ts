import {CommonState} from "../reducers/CommonState";
import {History} from "history";

export interface AppProps {
    loggedIn: boolean;
    history?: History;
}

export const mapStateToAppProps = (state: CommonState, props: Partial<AppProps>): AppProps => {
    return {
        loggedIn: state.auth.loggedIn && state.auth.hasCookies,
        history: props.history
    }
};