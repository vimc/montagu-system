import * as React from "react";
import {ExpectationsDescription} from "./ExpectationsDescription";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {connect} from "react-redux";
import {branch, compose, renderComponent} from "recompose";
import {IExtendedResponsibilitySet} from "../../../models/ResponsibilitySet";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ModellingGroup, TouchstoneVersion} from "../../../../shared/models/Generated";

interface Props {
    responsibilitySet: IExtendedResponsibilitySet;
    group: ModellingGroup;
    touchstoneVersion: TouchstoneVersion;
}

class ExpectationsListComponent extends React.PureComponent<Props> {
    render(): JSX.Element {
        const {responsibilitySet, group, touchstoneVersion} = this.props;
        const items = responsibilitySet.expectations.map(em =>
            <ExpectationsDescription
                key={em.expectation.id}
                expectationMapping={em}
                groupId={group.id}
                touchstoneVersionId={touchstoneVersion.id}
            />
        );
        return <span>{items}</span>;
    }
}

const mapStateToProps = (state: ContribAppState): Props => ({
    responsibilitySet: state.responsibilities.responsibilitiesSet,
    group: state.groups.currentUserGroup,
    touchstoneVersion: state.touchstones.currentTouchstoneVersion
});

export const ExpectationsList = compose(
    connect(mapStateToProps),
    branch((props: Props) => !props.responsibilitySet, renderComponent(LoadingElement))
)(ExpectationsListComponent);
