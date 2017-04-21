import { Source } from './Source';

export interface NoParameters { };

export const TouchstoneSource = new Source<NoParameters>(_ => '/touchstones/');

export interface ResponsibilityFetchParameters {
    groupId: string;
    touchstoneId: string;
}
export const ResponsibilitySource = new Source<ResponsibilityFetchParameters>(p => 
    `/modelling-groups/${p.groupId}/responsibilities/${p.touchstoneId}/`);