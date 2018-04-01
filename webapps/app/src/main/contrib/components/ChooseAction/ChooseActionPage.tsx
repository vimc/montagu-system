import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose } from "recompose";
import { connect } from 'react-redux';

import { ChooseActionContent } from "./ChooseActionContent";
import {ChooseGroupPageComponent} from "../ChooseGroup/ChooseGroupPage";
import {ModellingGroup, Touchstone} from "../../../shared/models/Generated";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {chooseActionPageActionCreators} from "../../actions/chooseActionPageActionCreators";

export interface ChooseActionPageLocationProps {
    groupId: string;
}

export interface ChooseActionPageProps extends PageProperties<ChooseActionPageLocationProps> {
    touchstones: Touchstone[];
    group: ModellingGroup;
}

export class ChooseActionPageComponent extends React.Component<ChooseActionPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: state.groups.currentUserGroup.description,
            urlFragment: `${state.groups.currentUserGroup.id}/`,
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title="What do you want to do?">
            <ChooseActionContent
                touchstones={this.props.touchstones}
                group={this.props.group}
            />
        </PageArticle>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ChooseActionPageProps> => {
    console.log(222, state)
    return {
        touchstones: state.touchstones.touchstones,
        group: state.groups.currentUserGroup

    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ChooseActionPageProps> => {
    return {
        onLoad: (params: ChooseActionPageLocationProps) => dispatch(chooseActionPageActionCreators.onLoad(params))
    }
};

export const ChooseActionPage = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(ChooseActionPageComponent) as React.ComponentClass<Partial<ChooseActionPageProps>>;
