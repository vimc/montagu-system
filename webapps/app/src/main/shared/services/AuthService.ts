import { localApiRequest } from "./LocalApiRequest"
import {authenticated, authenticationError} from "../actions/_AuthActions";
import { AxiosResponse, AxiosError } from "axios";

export const authService = (store :any) => (next:any) => (action:any) => {
    next(action)
    switch (action.type) {
        case 'AUTH_API':
            localApiRequest({Authorization: 'Basic ' + btoa(`${action.data.email}:${action.data.password}`)})
                .post("/authenticate/", "grant_type=client_credentials")
                .then((response: AxiosResponse) => {
                    store.dispatch(authenticated(response.data.access_token));
                })
                .catch((error: AxiosError) => {
                    store.dispatch(authenticationError(error))
                })
    }

}
