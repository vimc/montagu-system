import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {TouchstoneDetails} from "./TouchstoneDetails";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {AdminPage} from "../../../AdminPage";
import {touchstoneDetailsPageActionCreators} from "../../../actions/pages/touchstoneDetailsPageActionCreators";

export interface TouchstoneDetailsPageLocationProps {
    touchstoneId: string;
}

export class TouchstoneDetailsPageComponent extends React.Component<PageProperties<TouchstoneDetailsPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            <TouchstoneDetails/>
        </PageArticle>;
    }
}

export const TouchstoneDetailsPage = AdminPage(touchstoneDetailsPageActionCreators)(TouchstoneDetailsPageComponent);