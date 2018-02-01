import { localApiRequest } from "./LocalApiRequest"
// import { AxiosResponse, AxiosError } from "axios";

export function authService(getState?: any) {
    return {

        logIn(email: string, password: string) {
            return localApiRequest({
                Authorization: 'Basic ' + btoa(`${email}:${password}`)
            })
                .post("/authenticate/", "grant_type=client_credentials")
        },

        authToShiny() {
            return localApiRequest({
                Authorization: 'Bearer ' + getState().auth.bearerToken,
                withCredentials: true

            })
                .get("/set-shiny-cookie/")
        },

        unauthFromShiny() {
            return localApiRequest({
                Authorization: 'Bearer ' + getState().auth.bearerToken,
                withCredentials: true

            })
                .get("/clear-shiny-cookie/")
        }
    }
}
