import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {AdminPage} from "../../../AdminPage";
import {touchstoneVersionPageActionCreators} from "../../../actions/pages/touchstoneVersionPageActionCreators";
import {TouchstoneVersionDetails} from "./TouchstoneVersionDetails";

export interface TouchstoneVersionPageLocationProps {
    touchstoneVersionId: string;
    touchstoneId: string;
}

export class TouchstoneVersionPageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            <TouchstoneVersionDetails/>
        </PageArticle>;
    }
}

export const TouchstoneVersionPage = AdminPage(touchstoneVersionPageActionCreators)(TouchstoneVersionPageComponent);