import { ResponsibilityState } from "../stores/ResponsibilityStore";
import { Source } from "./Source";

export abstract class CoverageSource<T> extends Source<T, ResponsibilityState> {
    protected baseURL(state: ResponsibilityState): string {
        const k = {
            group: state.currentModellingGroupId,
            touchstone: state.currentTouchstone.id,
            scenario: state.currentResponsibility.scenario.id
        };
        return `/modelling-groups/${k.group}/responsibilities/${k.touchstone}/${k.scenario}`;
    }
}