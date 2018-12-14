import * as React from "react";

import {ResponsibilitiesPageTitle} from "../PageTitle";
import {UploadBurdenEstimatesContent} from "./UploadBurdenEstimatesContent";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {uploadBurdenEstimatesPageActionCreators} from "../../../actions/pages/uploadBurdenEstimatesPageActionCreators";
import {ContribPage} from "../../../ContribPage";

export interface UploadBurdenEstimatesPageLocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class UploadBurdenEstimatesPageComponent extends React.Component<PageProperties<UploadBurdenEstimatesPageLocationProps>> {
    static title() {
        return <ResponsibilitiesPageTitle title="Upload central burden estimates"/>
    }

    render(): JSX.Element {
        return <PageArticle title={UploadBurdenEstimatesPageComponent.title()}>
            <UploadBurdenEstimatesContent/>
        </PageArticle>
    }
}

export const UploadBurdenEstimatesPage = ContribPage(uploadBurdenEstimatesPageActionCreators)(UploadBurdenEstimatesPageComponent);
