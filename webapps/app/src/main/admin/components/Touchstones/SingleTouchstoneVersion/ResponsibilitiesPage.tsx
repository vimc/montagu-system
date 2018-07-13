
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import * as React from "react";
import {AdminPageHeader} from "../../AdminPageHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {touchstoneResponsibilitiesPageActionCreators} from "../../../actions/pages/TouchstoneResponsibilityPageActionCreators";
import {ResponsibilityList} from "./ResponsibilityList";
import {ResponsibilitySet} from "../../../../shared/models/Generated";
import {compose} from "recompose";

export interface ResponsibilitiesPageLocationProps {
    touchstoneVersionId: string;
    touchstoneId: string;
}

export interface ResponsibilitiesPageProps extends PageProperties<ResponsibilitiesPageLocationProps> {
    currentTouchstoneVersionId: string;
    responsibilitySets: ResponsibilitySet[]
}

export class ResponsibilitiesPageComponent extends React.Component<ResponsibilitiesPageProps> {

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={`Responsibility sets in ${this.props.currentTouchstoneVersionId}`}>
                {this.props.responsibilitySets.map(s => <div key={s.modelling_group_id}>
                    <h4>{s.modelling_group_id} (<span>{s.status}</span>)</h4>
                    <ResponsibilityList responsibilities={s.responsibilities}/>
                </div>)}
            </PageArticle>
        </div>;
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
        onLoad: (params: ResponsibilitiesPageLocationProps) =>
            dispatch(touchstoneResponsibilitiesPageActionCreators.onLoad(params))
    }
};

export const ResponsibilitiesPage =
    compose<{}, PageProperties<ResponsibilitiesPageLocationProps>>(connect(mapStateToProps, mapDispatchToProps))
    (ResponsibilitiesPageComponent);