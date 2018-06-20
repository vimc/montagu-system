import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import * as React from "react";
import {AdminPageHeader} from "../../AdminPageHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {compose} from "recompose";
import {connect} from "react-redux";
import {TouchstoneListPageComponent} from "../List/TouchstoneListPage";
import {touchstoneVersionPageActionCreators} from "../../../actions/pages/touchstoneVersionPageActionCreators";
import {ResponsibilityList} from "./ResponsibilityList";
import {ResponsibilitySet} from "../../../../shared/models/Generated";

export interface TouchstoneVersionPageLocationProps {
    touchstoneVersionId: string;
}

export interface TouchstoneVersionPageProps extends PageProperties<TouchstoneVersionPageLocationProps> {
    currentTouchstoneVersionId: string;
    responsibilitySets: ResponsibilitySet[]
}

export class TouchstoneVersionDetailsPageComponent extends React.Component<TouchstoneVersionPageProps> {

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={this.props.currentTouchstoneVersionId}>
                {this.props.responsibilitySets.map(s => <div key={s.modelling_group_id}>
                    <h4>{s.modelling_group_id} (<span>{s.status}</span>)</h4>
                    <ResponsibilityList responsibilities={s.responsibilities}/>
                </div>)}
            </PageArticle>
        </div>;
    }
}


const mapStateToProps = (state: AdminAppState): Partial<TouchstoneVersionPageProps> => {
    return {
        currentTouchstoneVersionId: state.touchstones.currentTouchstoneVersion ?
            state.touchstones.currentTouchstoneVersion.id : '',
        responsibilitySets: state.touchstones.currentResponsibilitySets

    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<TouchstoneVersionPageProps> => {
    return {
        onLoad: (params: TouchstoneVersionPageLocationProps) =>
            dispatch(touchstoneVersionPageActionCreators.onLoad(params))
    }
};

export const TouchstoneVersionDetailsPage = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(TouchstoneVersionDetailsPageComponent);