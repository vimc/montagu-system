import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminPage} from "../../../AdminPage";
import {modelMetaPageActionCreators} from "../../../actions/pages/ModelMetaPageActionCreators";
import {ModelMetaTable} from "./ModelMetaTable";

export class ModelMetaPageComponent extends React.Component<PageProperties<undefined>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title} isFluid={true}>
            <ModelMetaTable obsoleteModels={false}/>
            <ModelMetaTable obsoleteModels={true}/>
        </PageArticle>;
    }
}

export const ModelMetaPage = AdminPage(modelMetaPageActionCreators)(ModelMetaPageComponent);
