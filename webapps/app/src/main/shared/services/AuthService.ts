import { localApiRequest } from "./LocalApiRequest"

export function authService() {

    return {
        logIn: (email: string, password: string) => {
            return localApiRequest({Authorization: 'Basic ' + btoa(`${email}:${password}`)})
                .post("/authenticate/", "grant_type=client_credentials")
        }
    }
}
