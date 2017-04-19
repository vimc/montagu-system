import { Touchstone } from '../Models';

export interface TouchstoneSourceInterface {
    fetch(): Promise<Response>;
}

export const TouchstoneSource: TouchstoneSourceInterface = {
    fetch(): Promise<Response> {
        return fetch(`http://localhost:8080/v1/touchstones/`);
    }
}