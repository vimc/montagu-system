import * as React from "react";

import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageProperties";
import {ButtonLink} from "../../../shared/components/ButtonLink";

import "./MainMenu.scss"
import {AdminPage} from "../../AdminPage";
import {mainMenuPageActionCreators} from "../../actions/pages/MainMenuPageActionCreators";
import {compose} from "recompose";
import {connect} from "react-redux";
import {AdminAppState} from "../../reducers/adminAppReducers";

interface Props {
    canViewUsers: boolean;
    canViewGroups: boolean;
    canViewTouchstones: boolean;
}

export class MainMenuListComponent extends React.Component<Props> {

    render(): JSX.Element {
        return <PageArticle title={mainMenuPageActionCreators.title()}>
            Please select which area of Montagu you would like to manage:
            <ol className="admin-menu">
                {this.props.canViewGroups && <li>
                    <ButtonLink href="/modelling-groups/">Modelling groups</ButtonLink>
                </li>}

                {this.props.canViewTouchstones && <li>
                    <ButtonLink href="/touchstones/">Touchstones</ButtonLink>
                </li>}

                {this.props.canViewUsers && <li>
                    <ButtonLink href="/users/">Users and permissions</ButtonLink>
                </li>}
            </ol>
        </PageArticle>;
    }
}

export const mapStateToProps = (state: AdminAppState): Props => ({
    canViewGroups: state.auth.permissions.indexOf("*/modelling-groups.read") > -1,
    canViewTouchstones: state.auth.permissions.indexOf("*/touchstones.read") > -1,
    canViewUsers: state.auth.permissions.indexOf("*/users.read") > -1
});

export const MainMenuList = compose(
    connect(mapStateToProps)
)(MainMenuListComponent);


export class MainMenu extends React.Component<PageProperties<undefined>> {

    static title: string = "Main menu";

    render(): JSX.Element {
        return <MainMenuList />
    }
}


export const MainMenuPage = AdminPage(mainMenuPageActionCreators)(MainMenu);