import * as React from "react";
import { Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import { ResponsibilityOverviewDescription } from "./ResponsibilityOverviewDescription";
import { ResponsibilityOverviewContent } from "./ResponsibilityOverviewContent";
import {ChooseActionPageComponent} from "../../ChooseAction/ChooseActionPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {TouchstoneVersion} from "../../../../shared/models/Generated";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {responsibilityOverviewPageActionCreators} from "../../../actions/pages/responsibilityOverviewPageActionCreators";
import {PageBreadcrumb} from "../../../../shared/components/PageWithHeader/PageProperties";

export interface ResponsibilityOverviewPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export interface ResponsibilityOverviewPageProps extends PageProperties<ResponsibilityOverviewPageLocationProps> {
    touchstone: TouchstoneVersion;
}

export class ResponsibilityOverviewPageComponent extends React.Component<ResponsibilityOverviewPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstoneVersion.description,
            urlFragment: `responsibilities/${state.touchstones.currentTouchstoneVersion.id}/`,
            parent: ChooseActionPageComponent.breadcrumb(state)
        }
    }

    render(): JSX.Element {
        if (this.props.touchstone) {
            return <PageArticle title={`Responsibilities in ${this.props.touchstone.description }`}>
                <ResponsibilityOverviewContent/>
            </PageArticle>;
        } else {
            return <LoadingElement/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ResponsibilityOverviewPageProps> => {
    return {
        touchstone: state.touchstones.currentTouchstoneVersion
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ResponsibilityOverviewPageProps> => {
    return {
        onLoad: (params: ResponsibilityOverviewPageLocationProps) => dispatch(responsibilityOverviewPageActionCreators.onLoad(params))
    }
};

export const ResponsibilityOverviewPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ResponsibilityOverviewPageComponent) as React.ComponentClass<Partial<ResponsibilityOverviewPageProps>>;
