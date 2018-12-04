import * as React from "react";

import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import { ResponsibilityGuidanceContentProps, mapStateToGuidanceContentProps} from "./ResponsibilityGuidanceContentProps";
import {connect} from "react-redux";


export class ResponsibilityGuidanceTouchstoneNotOpenContentComponent extends React.Component<ResponsibilityGuidanceContentProps> {


    render() :JSX.Element {

        return <PageArticle title="Touchstone is not open">
            <div className="alert alert-danger">This touchstone, {this.props.touchstoneVersion.description}, is not
                open. You can find guidance for current touchstones via the Responsibilities overview page,
                which you can access by returning to the portal <InternalLink href="/">homepage</InternalLink> and following the links.</div>
        </PageArticle>
    }
}

export const ResponsibilityGuidanceTouchstoneNotOpenContent = connect(mapStateToGuidanceContentProps)(ResponsibilityGuidanceTouchstoneNotOpenContentComponent);