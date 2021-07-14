import * as React from "react";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";
import {Dispatch} from "redux";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";
import {compose} from "recompose";
import {connect} from "react-redux";

export interface ResponsibilityListItemProps {
    responsibility: AnnotatedResponsibility;
    canReviewResponsibilities: boolean;
    setCurrentTouchstoneResponsibility: (responsibility: AnnotatedResponsibility) => void;
}

export class ResponsibilityListItemComponent extends React.Component<ResponsibilityListItemProps> {

    handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.props.setCurrentTouchstoneResponsibility(this.props.responsibility);
    }

    render() {
        return <tr>
            <td>{this.props.responsibility.scenario.description}</td>
            <td>{this.props.responsibility.scenario.disease}</td>
            <td>{this.props.responsibility.status}</td>
            <td>{this.props.responsibility.current_estimate_set ? this.props.responsibility.current_estimate_set.uploaded_on : "None"}</td>
            {this.props.canReviewResponsibilities &&
            <td>
                <div style={{
                    display: "table-cell",
                    width: "100%",
                    maxWidth: "20em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }} title={this.props.responsibility.comment && this.props.responsibility.comment.comment}>
                    {this.props.responsibility.comment && this.props.responsibility.comment.comment}
                </div>
                <div style={{display: "table-cell", textAlign: "right"}}>
                    <a href="#" className="small ml-2" onClick={this.handleClick.bind(this)}>Edit</a>
                </div>
            </td>
            }
        </tr>;
    }
}

const mapStateToProps = (state: AdminAppState): Partial<ResponsibilityListItemProps> => {
    return {
        canReviewResponsibilities: state.auth.canReviewResponsibilities,
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ResponsibilityListItemProps> => {
    return {
        setCurrentTouchstoneResponsibility: (responsibility: AnnotatedResponsibility) =>
            dispatch(adminTouchstoneActionCreators.setCurrentTouchstoneResponsibility(responsibility))
    };
};

export const ResponsibilityListItem = compose(
    connect(mapStateToProps, mapDispatchToProps))
(ResponsibilityListItemComponent) as React.ComponentClass<Partial<ResponsibilityListItemProps>>;
