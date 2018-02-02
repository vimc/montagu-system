import { localApiRequest } from "./LocalApiRequest"
// import { AxiosResponse, AxiosError } from "axios";

export function authService(dispatch?: any, getState?: any) {
    return {

        logIn(email: string, password: string) {
            return localApiRequest(dispatch, {
                Authorization: 'Basic ' + btoa(`${email}:${password}`)
            })
                .postNoProcess("/authenticate/", "grant_type=client_credentials")
        },

        authToShiny() {
            return localApiRequest(dispatch,{
                Authorization: 'Bearer ' + getState().auth.bearerToken,
                withCredentials: true

            })
                .get("/set-shiny-cookie/")
        },

        unauthFromShiny() {
            return localApiRequest(dispatch,{
                Authorization: 'Bearer ' + getState().auth.bearerToken,
                withCredentials: true

            })
                .get("/clear-shiny-cookie/")
        }
    }
}
