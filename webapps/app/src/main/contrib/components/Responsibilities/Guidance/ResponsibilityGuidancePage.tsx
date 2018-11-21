import * as React from "react";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import { TouchstoneVersion, Touchstone } from "../../../../shared/models/Generated";

export interface ResponsibilityGuidancePageLocationProps {
    touchstoneId: string;
}

export interface ResponsibilityGuidancePageProps extends PageProperties<ResponsibilityGuidancePageLocationProps>
{
    touchstoneVersion: TouchstoneVersion;
}

export class ResponsibilityGuidancePageComponent extends React.Component<ResponsibilityGuidancePageProps> {

    //componentDidMount(){
    //    this.props.onLoad(this.props.match.params)
    //}

    currentTouchstoneIs2017() : boolean {
        return this.props.touchstoneVersion.id.includes("2017")
    }

}