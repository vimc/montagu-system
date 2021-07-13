import * as React from "react";
import {ResponsibilityListItem} from "./ResponsibilityListItem";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect} from "react-redux";

interface ResponsibilityListProps {
    responsibilities: AnnotatedResponsibility[];
    canReviewResponsibilities: boolean;
}

export class ResponsibilityListComponent extends React.Component<ResponsibilityListProps> {
    render() {
        return <table>
            <thead>
            <tr>
                <th>Scenario</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Latest estimate set</th>
                {this.props.canReviewResponsibilities &&
                <th>Comment</th>
                }
            </tr>
            </thead>
            <tbody>
            {this.props.responsibilities.map(r => <ResponsibilityListItem responsibility={r} key={r.scenario.id}/>)}
            </tbody>
        </table>;
    }
}

const mapStateToProps = (state: AdminAppState): Partial<ResponsibilityListProps> => {
    return {
        canReviewResponsibilities: state.auth.canReviewResponsibilities,
    }
};

export const ResponsibilityList = compose(connect(mapStateToProps))
(ResponsibilityListComponent) as React.ComponentClass<Partial<ResponsibilityListProps>>;
