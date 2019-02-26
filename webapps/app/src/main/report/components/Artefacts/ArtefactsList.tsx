import * as React from "react";
import {ArtefactItem} from "./ArtefactItem";
import {Artefact} from "../../../shared/models/Generated";

interface ArtefactsListProps{
    artefacts:Artefact[],
    report: string,
    version: string
}

export class ArtefactsList extends React.Component<ArtefactsListProps, undefined> {

    render() {
        const artefactItems = this.props.artefacts
            .map((artefact)=> {
                return <ArtefactItem key={artefact.files[0]}
                                     report={this.props.report} version={this.props.version} artefact={artefact} />;
            });

        return <div>
            {artefactItems}
        </div>;
    }
}