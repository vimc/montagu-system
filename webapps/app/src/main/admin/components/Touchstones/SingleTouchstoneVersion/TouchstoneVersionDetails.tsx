import * as React from "react";
import {connect} from "react-redux";

import {Touchstone, TouchstoneVersion} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {InternalLink} from "../../../../shared/components/InternalLink";

interface TouchstoneVersionDetailsProps {
    touchstoneVersion: TouchstoneVersion
    touchstone: Touchstone
    canUploadCoverage: Boolean
}

export class TouchstoneVersionDetailsComponent extends React.Component<TouchstoneVersionDetailsProps> {

    render(): JSX.Element {
        const version = this.props.touchstoneVersion;
        const baseUrl = `/touchstones/${this.props.touchstone.id}/${version.id}/`;
        return <div>
            <h3>Status: {version.status}</h3>
            <div className="list-group">
                <InternalLink href={`${baseUrl}scenarios/`} className="list-group-item">
                    View scenarios
                </InternalLink>
                <InternalLink href={`${baseUrl}responsibilities/`} className="list-group-item">
                    View responsibilities
                </InternalLink>
                <InternalLink href={`${baseUrl}demographics/`} className="list-group-item">
                    Download demographic data
                </InternalLink>
                { this.props.canUploadCoverage &&
                    <InternalLink href={`${baseUrl}coverage/`} className="list-group-item">
                        Upload coverage
                    </InternalLink>
                }
            </div>
        </div>;
    }
}

const mapStateToProps = (state: AdminAppState): TouchstoneVersionDetailsProps => {
    return {
        touchstone: state.touchstones.currentTouchstone,
        touchstoneVersion: state.touchstones.currentTouchstoneVersion,
        canUploadCoverage: state.auth.canUploadCoverage
    }
};

const enhance = compose(
    connect(mapStateToProps),
    branch((props: TouchstoneVersionDetailsProps) => !props.touchstone || !props.touchstoneVersion, renderComponent(LoadingElement))
);

export const TouchstoneVersionDetails = enhance(TouchstoneVersionDetailsComponent);
