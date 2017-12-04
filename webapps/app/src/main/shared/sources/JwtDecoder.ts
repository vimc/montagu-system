const jwt_decode = require('jwt-decode');


export const jwtDecoder = {
    jwtDecode (token: string): any {
        return jwt_decode(token)
    }
}