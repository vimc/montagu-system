import {SetCurrentTouchstoneVersion, TouchstoneTypes} from "../actionTypes/TouchstonesTypes";
import {flatMap} from "../ArrayHelpers";
import {Touchstone} from "../models/Generated";

export const touchstonesActionCreators = {

    setCurrentTouchstoneVersion(touchstoneVersionId: string, touchstones: Touchstone[]) {

        const versions = flatMap(touchstones, x => x.versions);
        const currentTouchstoneVersion = versions.find(v => v.id === touchstoneVersionId);
        return {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: currentTouchstoneVersion
        } as SetCurrentTouchstoneVersion

    }
};
