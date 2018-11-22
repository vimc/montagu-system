import * as React from "react";

import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import { ResponsibilityGuidanceContentProps, mapStateToGuidanceContentProps} from "./ResponsibilityGuidanceContentProps";
import {connect} from "react-redux";


export class ResponsibilityGuidanceTouchstoneNotOpenContentComponent extends React.Component<ResponsibilityGuidanceContentProps> {


    render() :JSX.Element {

        return <PageArticle title="Touchstone is not open">
            <div className="alert alert-danger">This touchstone, {this.props.touchstoneVersion.description}, is not
                open. Please return to the portal <InternalLink href="/">homepage</InternalLink> and follow instructions to find guidance on using current
                touchstones.</div>
        </PageArticle>
    }
}

export const ResponsibilityGuidanceTouchstoneNotOpenContent = connect(mapStateToGuidanceContentProps)(ResponsibilityGuidanceTouchstoneNotOpenContentComponent);