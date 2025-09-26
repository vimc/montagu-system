import * as React from "react";

import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {expectationsPageActionCreators} from "../../../actions/pages/expectationsPageActionCreators";
import {ExpectationsList} from "./ExpectationsList";
import {ContribPage} from "../../../ContribPage";

export interface ExpectationsPageLocationProps {
    groupId: string;
    touchstoneId: string;
}


export class ExpectationsPageComponent extends React.Component<PageProperties<ExpectationsPageLocationProps>> {

    static title = "Download burden estimate templates";

    render(): JSX.Element {
        return <PageArticle title={ExpectationsPageComponent.title}>
            <ExpectationsList/>
        </PageArticle>;
    }
}


export const ExpectationsPage = ContribPage(expectationsPageActionCreators)(ExpectationsPageComponent);