import * as React from "react";
import {PageProperties} from "../../../../../shared/components/PageWithHeader/PageProperties";
import { TouchstoneVersion } from "../../../../../shared/models/Generated";
import {ContribAppState} from "../../../../reducers/contribAppReducers";


export interface ResponsibilityGuidanceContentProps
{
    touchstoneVersion: TouchstoneVersion;
}

export const mapStateToGuidanceContentProps = (state: ContribAppState, props: Partial<ResponsibilityGuidanceContentProps>):
    Partial<ResponsibilityGuidanceContentProps> => {
    return {
        touchstoneVersion: state.touchstones.currentTouchstoneVersion,
    }
};