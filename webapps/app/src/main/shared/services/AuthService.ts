import { localApiRequest } from "./LocalApiRequest"
import { AuthActions } from "../actions/AuthActions";
import { AxiosResponse, AxiosError } from "axios";

export const authService = (store :any) => (next:any) => (action:any) => {
    next(action)
    switch (action.type) {
        case 'DO_AUTH_TO_API':
            return localApiRequest({
                Authorization: 'Basic ' + btoa(`${action.data.email}:${action.data.password}`)
            })
                .post("/authenticate/", "grant_type=client_credentials")
                .then((response: AxiosResponse) => {
                    store.dispatch(AuthActions.authenticated(response.data.access_token));
                })
                .catch((error: AxiosError) => {
                    console.log('ae',error)
                    store.dispatch(AuthActions.authenticationError(error))
                })
        case 'DO_AUTH_TO_SHINY_API':
            return localApiRequest({
                Authorization: 'Bearer ' + store.getState().auth.bearerToken,
                withCredentials: true

            })
                .get("/set-shiny-cookie/")
        case 'DO_UNAUTH_FROM_SHINY_API':
            return localApiRequest({
                Authorization: 'Bearer ' + store.getState().auth.bearerToken,
                withCredentials: true

            })
                .get("/clear-shiny-cookie/")
    }
}
