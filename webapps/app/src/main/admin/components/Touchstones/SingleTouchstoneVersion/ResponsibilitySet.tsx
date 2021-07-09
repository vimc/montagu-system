import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {ResponsibilityList} from "./ResponsibilityList";
import {AnnotatedResponsibilitySet} from "../../../models/AnnotatedResponsibility";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";
import {compose} from "recompose";

interface ResponsibilitySetProps {
    responsibilitySet: AnnotatedResponsibilitySet;
    canReviewResponsibilities: boolean;
    setCurrentTouchstoneResponsibilitySet: (responsibilitySet: AnnotatedResponsibilitySet) => void;
}

class ResponsibilitySetComponent extends React.Component<ResponsibilitySetProps> {

    handleClick() {
        this.props.setCurrentTouchstoneResponsibilitySet(this.props.responsibilitySet);
    }

    render(): JSX.Element {
        const responsibilitySet = this.props.responsibilitySet;
        return <div>
            <h4>{responsibilitySet.modelling_group_id} (<span>{responsibilitySet.status}</span>)</h4>
            {this.props.canReviewResponsibilities &&
            <div style={{marginBottom: "0.5em", display: "flex"}}>
                <span className="font-weight-bold">Comment:</span>
                <span style={{marginLeft: "0.5em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                      title={responsibilitySet.comment && responsibilitySet.comment.comment}>
                            {responsibilitySet.comment && responsibilitySet.comment.comment}
                </span>
                <span className="small" style={{marginLeft: "0.5em"}}>
                    <a href="#" style={{marginLeft: "0.5em"}} onClick={this.handleClick.bind(this)}>Edit</a>
                </span>
            </div>
            }
            <ResponsibilityList responsibilities={responsibilitySet.responsibilities}/>
        </div>
    }

}

const mapStateToProps = (state: AdminAppState): Partial<ResponsibilitySetProps> => {
    return {
        canReviewResponsibilities: state.auth.canReviewResponsibilities
    }
};

const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ResponsibilitySetProps> => {
    return {
        setCurrentTouchstoneResponsibilitySet: (responsibilitySet: AnnotatedResponsibilitySet) =>
            dispatch(adminTouchstoneActionCreators.setCurrentTouchstoneResponsibilitySet(responsibilitySet))
    };
};

export const ResponsibilitySet = compose<{}, Partial<ResponsibilitySetProps>>(
    connect(mapStateToProps, mapDispatchToProps)
)(ResponsibilitySetComponent);
