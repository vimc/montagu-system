import * as React from "react";
import {ExpectationsDescription} from "./ExpectationsDescription";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {connect} from "react-redux";
import {branch, compose, renderComponent} from "recompose";
import {IExtendedResponsibilitySet} from "../../../models/ResponsibilitySet";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";

interface Props {
    responsibilitySet: IExtendedResponsibilitySet
}

class ExpectationsListComponent extends React.PureComponent<Props> {
    render(): JSX.Element {
        const {responsibilitySet} = this.props;
        const items = responsibilitySet.expectations.map(em =>
            <ExpectationsDescription key={em.expectation.id} {...em} />
        );
        return <span>{items}</span>;
    }
}

const mapStateToProps = (state: ContribAppState): Props => ({
    responsibilitySet: state.responsibilities.responsibilitiesSet
});

export const ExpectationsList = compose(
    connect(mapStateToProps),
    branch((props: Props) => !props.responsibilitySet, renderComponent(LoadingElement))
)(ExpectationsListComponent);
