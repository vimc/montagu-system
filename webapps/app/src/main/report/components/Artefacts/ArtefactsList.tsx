import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {settings} from "../../../shared/Settings";
import {Artefact} from "../../../shared/models/reports/Artefact";
import {ArtefactItem} from "./Artefact";

interface ArtefactsListProps{
    artefacts: ILookup<Artefact>[],
    report: string,
    version: string
}
export class ArtefactsList extends React.Component<ArtefactsListProps, undefined> {

    static buildUrl(type: string, hash: string): string {
        return settings.reportingApiUrl() + "/data/"
            + type + "/"
            + hash;
    }

    render() {

        const artefactItems = this.props.artefacts
            .map((artefact)=> {
                const key = Object.getOwnPropertyNames(artefact)[0];
                return <ArtefactItem key={key} report={this.props.report} version={this.props.version} {...artefact[key]} />;
            });

        return <ul>{artefactItems}</ul>;
    }
}