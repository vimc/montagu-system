import {Artefact} from "./Artefact";
import {ILookup} from "../Lookup";

export interface Version { //This really corresponds to the raw JsonObject coming out of Orderly table
    name: string;
    displayname: string;
    id: string;
    date: string;
    hash_data : ILookup<string>;
    data: ILookup<string>;
    parameters: ILookup<string>,
    resources: string[];
    artefacts: ILookup<Artefact>[];
    published: boolean;
}