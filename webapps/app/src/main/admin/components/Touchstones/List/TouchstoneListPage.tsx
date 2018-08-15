import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {TouchstoneList} from "./TouchstoneList";
import {touchstoneListPageActionCreators} from "../../../actions/pages/TouchstoneListPageActionCreators";
import {CreateTouchstoneForm} from "../Create/CreateTouchstoneForm";
import {settings} from "../../../../shared/Settings";
import {AdminPage} from "../../../AdminPage";

export class TouchstoneListPageComponent extends React.Component<PageProperties<undefined>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            {settings.showTouchstoneCreation &&
            <CreateTouchstoneForm/>}
            <TouchstoneList/>
        </PageArticle>;
    }
}

export const TouchstoneListPage = AdminPage(touchstoneListPageActionCreators)(TouchstoneListPageComponent)