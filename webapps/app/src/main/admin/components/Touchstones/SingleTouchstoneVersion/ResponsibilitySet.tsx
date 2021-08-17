import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {ResponsibilityList} from "./ResponsibilityList";
import {AnnotatedResponsibilitySet} from "../../../models/AnnotatedResponsibility";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";
import {compose} from "recompose";
import {ResponsibilitySetWithComments, ResponsibilitySetWithExpectations} from "../../../../shared/models/Generated";

interface ResponsibilitySetProps {
    responsibilitySet: ResponsibilitySetWithExpectations;
    canReviewResponsibilities: boolean;
    responsibilityComments: ResponsibilitySetWithComments[];
    setCurrentTouchstoneResponsibilitySet: (responsibilitySet: AnnotatedResponsibilitySet) => void;
}

interface ResponsibilitySetState {
    annotatedResponsibilitySet: AnnotatedResponsibilitySet;
}

class ResponsibilitySetComponent extends React.Component<ResponsibilitySetProps, ResponsibilitySetState> {

    constructor(props: ResponsibilitySetProps) {
        super(props);
        this.state = {
            annotatedResponsibilitySet: toAnnotatedResponsibilitySet(props.responsibilitySet, props.responsibilityComments)
        };
    }

    handleClick() {
        this.props.setCurrentTouchstoneResponsibilitySet(this.state.annotatedResponsibilitySet);
    }

    componentWillReceiveProps(nextProps: Readonly<ResponsibilitySetProps>) {
        this.setState({
            annotatedResponsibilitySet: toAnnotatedResponsibilitySet(nextProps.responsibilitySet, nextProps.responsibilityComments)
        });
    }

    render(): JSX.Element {
        const responsibilitySet = this.state.annotatedResponsibilitySet;
        return <div>
            <h4>{responsibilitySet.modelling_group_id} (<span>{responsibilitySet.status}</span>)</h4>
            {this.props.canReviewResponsibilities &&
            <div className="mb-2" style={{display: "flex", alignItems: "center"}}>
                <span className="font-weight-bold">Comment:</span>
                <span className="ml-1" style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                      title={responsibilitySet.comment && responsibilitySet.comment.comment}>
                            {responsibilitySet.comment && responsibilitySet.comment.comment}
                </span>
                <span className="small ml-2">
                    <a href="#" onClick={this.handleClick.bind(this)}>Edit</a>
                </span>
            </div>
            }
            <ResponsibilityList responsibilities={responsibilitySet.responsibilities}/>
        </div>
    }

}

function toAnnotatedResponsibilitySet(
    responsibilitySet: ResponsibilitySetWithExpectations,
    responsibilityComments: ResponsibilitySetWithComments[]
): AnnotatedResponsibilitySet {
    const responsibilitySetWithComments = responsibilityComments
        .find(e => e.modelling_group_id === responsibilitySet.modelling_group_id)
    return {
        comment: responsibilitySetWithComments && responsibilitySetWithComments.comment,
        ...responsibilitySet,
        responsibilities: responsibilitySet.responsibilities.map(r => (
            {
                modellingGroup: responsibilitySet.modelling_group_id,
                comment: responsibilitySetWithComments && responsibilitySetWithComments.responsibilities
                    .find(e => e.scenario_id === r.scenario.id).comment,
                ...r
            }
        ))
    };
}

const mapStateToProps = (state: AdminAppState): Partial<ResponsibilitySetProps> => {
    return {
        canReviewResponsibilities: state.auth.canReviewResponsibilities,
        responsibilityComments: state.touchstones.currentResponsibilityComments
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
