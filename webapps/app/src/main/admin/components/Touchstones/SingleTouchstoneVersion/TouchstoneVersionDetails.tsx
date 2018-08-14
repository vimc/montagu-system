import * as React from "react";
import {connect} from "react-redux";

import {ButtonLink} from "../../../../shared/components/ButtonLink";
import {Touchstone, TouchstoneVersion} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {stat} from "fs";

interface TouchstoneVersionDetailsProps {
    touchstoneVersion: TouchstoneVersion
    touchstone: Touchstone
}

export class TouchstoneVersionDetailsComponent extends React.Component<TouchstoneVersionDetailsProps> {

    render(): JSX.Element {
        const version = this.props.touchstoneVersion;
        const baseUrl = `/touchstones/${this.props.touchstone.id}/${version.id}/`;
        return <div>
            <h2>Status: {version.status}</h2>
            <div className="mt-3">
                <ButtonLink href={`${baseUrl}responsibilities`}>
                    View responsibilities</ButtonLink>
            </div>
            <div className="mt-3">
                <ButtonLink href={`${baseUrl}demographics`}>Download demographic data</ButtonLink>
            </div>
        </div>;
    }
}

const mapStateToProps = (state: AdminAppState): TouchstoneVersionDetailsProps => {
    return {
        touchstone: state.touchstones.currentTouchstone,
        touchstoneVersion: state.touchstones.currentTouchstoneVersion
    }
};

const enhance = compose(
    connect(mapStateToProps),
    branch((props: TouchstoneVersionDetailsProps) => !props.touchstone || !props.touchstoneVersion, renderComponent(LoadingElement))
);

export const TouchstoneVersionDetails = enhance(TouchstoneVersionDetailsComponent);