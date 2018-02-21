import {encodeFilename} from "../shared/Helpers";

export function buildArtefactUrl(report: string, version: string, filename: string, inline: boolean): string {
    let url = `/reports/${report}/versions/${version}/artefacts/${encodeFilename(filename)}/`;
    if (inline) {
        url += "?inline=true";
    }
    return url;
}