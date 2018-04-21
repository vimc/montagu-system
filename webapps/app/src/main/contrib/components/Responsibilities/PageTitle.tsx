import * as React from "react";
import { connect } from 'react-redux';

import { InternalLink } from "../../../shared/components/InternalLink";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import {ContribAppState} from "../../reducers/contribAppReducers";

interface ResponsibilitiesPageTitleProps {
    title: string;
    touchstone: Touchstone;
    group: ModellingGroup;
}

export class ResponsibilitiesPageTitleComponent extends React.Component<ResponsibilitiesPageTitleProps> {
    renderReturnLink() {
        if (this.props.touchstone && this.props.group) {
            const url = `/${this.props.group.id}/responsibilities/${this.props.touchstone.id}/`;
            return <div className="titleAddition d-inline-block">
                <InternalLink href={ url }>Return to responsibilities list</InternalLink>
            </div>;
        } else {
            return null;
        }
    }

    render() {
        return <div>
            <div className="mr-3 d-inline-block">
            { this.props.title }
            </div>
            { this.renderReturnLink() }
        </div>;
    }
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ResponsibilitiesPageTitleProps>): Partial<ResponsibilitiesPageTitleProps> => {
    return {
        touchstone: state.touchstones.currentTouchstone,
        group: state.groups.currentUserGroup,
        title: props.title
    }
};

export const ResponsibilitiesPageTitle = connect(mapStateToProps)(ResponsibilitiesPageTitleComponent);