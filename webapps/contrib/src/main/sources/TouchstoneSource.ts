import { Touchstone } from '../stores/TouchstoneStore';

export interface TouchstoneSourceInterface {
    fetch(): Promise<Response>;
}

export const TouchstoneSource: TouchstoneSourceInterface = {
    fetch(): Promise<Response> {
        return fetch(`http://localhost:8080/v1/touchstones/`);
    }
}