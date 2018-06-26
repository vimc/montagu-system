import * as jwt from "jsonwebtoken";
import * as pako from "pako";

export function signAndCompress(token: string | Buffer | object, secret: string = "secret"): string {
    const signed = jwt.sign(token, secret);
    return compress(signed);
}

export function compress(token: string, secret: string = "secret"): string {
    const compressed = pako.deflate(token, {to: "string"});
    return btoa(compressed)
        .replace(/\//g, '_')
        .replace(/\+/g, '-');
}