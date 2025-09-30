import * as React from "react";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import { TouchstoneVersion } from "../../../../shared/models/APITypes";
import {ContribAppState} from "../../../reducers/contribAppReducers";

export interface ResponsibilityGuidancePageLocationProps {
    touchstoneId: string;
}

export interface ResponsibilityGuidancePageProps extends PageProperties<ResponsibilityGuidancePageLocationProps> {
    touchstoneVersion: TouchstoneVersion;
}