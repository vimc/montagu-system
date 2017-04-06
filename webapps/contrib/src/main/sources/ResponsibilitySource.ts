import { ResponsibilitySet } from '../stores/ResponsibilityStore';

export interface ResponsibilitySourceInterface {
    fetch(groupId: string, touchstoneId: string): Promise<Response>;
}

export const ResponsibilitySource: ResponsibilitySourceInterface = {
    fetch(groupId: string, touchstoneId: string): Promise<Response> {
        return fetch(`http://localhost:8080/v1/modelling-groups/${groupId}/responsibilities/${touchstoneId}/`);
    }
}