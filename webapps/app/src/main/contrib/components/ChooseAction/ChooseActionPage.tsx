import * as React from "react";

import { ChooseActionContent } from "./ChooseActionContent";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {chooseActionPageActionCreators} from "../../actions/pages/chooseActionPageActionCreators";
import {ContribPage} from "../../ContribPage";

export interface ChooseActionPageLocationProps {
    groupId: string;
}

export class ChooseActionPageComponent extends React.Component<PageProperties<ChooseActionPageLocationProps>> {

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <PageArticle title="What do you want to do?">
            <ChooseActionContent/>
        </PageArticle>;
    }
}

export const ChooseActionPage = ContribPage(chooseActionPageActionCreators)(ChooseActionPageComponent);

