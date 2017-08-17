export function doNothing() {

}

export function encodeFilename(filename: String) {
    return filename.replace("/", ":");
}