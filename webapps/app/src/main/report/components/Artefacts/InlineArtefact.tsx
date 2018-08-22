import * as React from "react";
import {Artefact} from "../../../shared/models/reports/Artefact";
import {buildArtefactUrl} from "../../LinkHelpers";
import {buildURL} from "../../../shared/services/AbstractLocalService";

interface Props {
    report: string;
    version: string;
    artefact: Artefact;
}

export class InlineArtefact extends React.Component<Props, undefined> {
    render(): JSX.Element {
        const {report, version, artefact} = this.props;
        const filename = artefact.filenames[0];
        const extension = filename.split('.').pop();

        if (InlineArtefact.canRenderInIFrame(extension)) {
            const urlFragment = buildArtefactUrl(report, version, filename, true);
            const fullUrl = buildURL(urlFragment, "reporting");
            return <div>
                <iframe
                    src={fullUrl}
                    width="100%"
                    height="600px"
                    className="border border-dark p-3"
                    frameBorder={0}
                />
                <div className="text-right">
                    <a href={fullUrl}>View fullscreen</a>
                </div>
            </div>;
        } else {
            // Do other things here, like rendering CSV as a table, etc.
            return null;
        }
    }

    static canRenderInIFrame(ext: string): boolean {
        // This will be replaced with checking the mimetype once we have that metadata
        const images = ["png", "jpg", "jpeg", "gif", "svg"];
        const html = ["html", "htm"];
        const all = ["pdf"].concat(html).concat(images);
        return all.indexOf(ext) > -1;
    }
}
