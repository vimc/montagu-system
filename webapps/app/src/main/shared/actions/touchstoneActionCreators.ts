import {SetCurrentTouchstone, SetCurrentTouchstoneVersion, TouchstoneTypes} from "../actionTypes/TouchstonesTypes";
import {flatMap} from "../ArrayHelpers";
import {Touchstone} from "../models/APITypes";

export const touchstonesActionCreators = {
    setCurrentTouchstone(touchstoneId: string, touchstones: Touchstone[]) {
        const currentTouchstone = touchstones.find(t => t.id === touchstoneId);
        if (!currentTouchstone) {
            throw Error("Unknown touchstone: " + touchstoneId);
        }
        return {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: currentTouchstone
        } as SetCurrentTouchstone
    },

    setCurrentTouchstoneVersion(touchstoneVersionId: string, touchstones: Touchstone[]) {
        const versions = flatMap(touchstones, x => x.versions);
        const currentTouchstoneVersion = versions.find(v => v.id === touchstoneVersionId);
        return {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: currentTouchstoneVersion
        } as SetCurrentTouchstoneVersion
    }
};