import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {touchstoneResponsibilitiesPageActionCreators} from "../../../actions/pages/TouchstoneResponsibilityPageActionCreators";
import {ResponsibilityList} from "./ResponsibilityList";
import {ResponsibilitySetWithExpectations} from "../../../../shared/models/Generated";
import {compose} from "recompose";
import {TouchstoneVersionPageLocationProps} from "./TouchstoneVersionPage";

export interface ResponsibilitiesPageProps extends PageProperties<TouchstoneVersionPageLocationProps> {
    currentTouchstoneVersionId: string;
    responsibilitySets: ResponsibilitySetWithExpectations[]
}

export class ResponsibilitiesPageComponent extends React.Component<ResponsibilitiesPageProps> {

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <PageArticle title={`Responsibility sets in ${this.props.currentTouchstoneVersionId}`}>
            {this.props.responsibilitySets.map(s => <div key={s.modelling_group_id}>
                <h4>{s.modelling_group_id} (<span>{s.status}</span>)</h4>
                <ResponsibilityList responsibilities={s.responsibilities}/>
            </div>)}
        </PageArticle>;
    }
}


const mapStateToProps = (state: AdminAppState): Partial<ResponsibilitiesPageProps> => {
    return {
        currentTouchstoneVersionId: state.touchstones.currentTouchstoneVersion ?
            state.touchstones.currentTouchstoneVersion.id : '',
        responsibilitySets: state.touchstones.currentResponsibilitySets

    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ResponsibilitiesPageProps> => {
    return {
        onLoad: (params: TouchstoneVersionPageLocationProps) =>
            dispatch(touchstoneResponsibilitiesPageActionCreators.onLoad(params))
    }
};

export const ResponsibilitiesPage =
    compose<{}, PageProperties<TouchstoneVersionPageLocationProps>>(connect(mapStateToProps, mapDispatchToProps))
    (ResponsibilitiesPageComponent);