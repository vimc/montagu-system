import { Source } from './Source';

export interface NoParameters { };

const touchstoneSource = new Source<NoParameters>(_ => '/touchstones/');
const diseaseSource = new Source<NoParameters>(_ => '/diseases/');

export interface ResponsibilityFetchParameters {
    groupId: string;
    touchstoneId: string;
}
const responsibilitySource = new Source<ResponsibilityFetchParameters>(p => 
    `/modelling-groups/${p.groupId}/responsibilities/${p.touchstoneId}/`);

export const sources = {
    diseases: diseaseSource,
    touchstones: touchstoneSource,
    responsibilities: responsibilitySource
};

