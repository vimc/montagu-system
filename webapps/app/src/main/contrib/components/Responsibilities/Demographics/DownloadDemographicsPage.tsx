import * as React from "react";

import {ResponsibilitiesPageTitle} from "../PageTitle";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {downloadDemographicsContribPageActionCreators} from "../../../actions/pages/downloadDemographicsContribPageActionCreators";
import {ContribPage} from "../../../ContribPage";
import {DownloadDemographicsContent} from "../../../../shared/components/Demographics/DownloadDemographicsContent";

export interface DownloadDemographicsPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export class DownloadDemographicsPageComponent extends React.Component<PageProperties<DownloadDemographicsPageLocationProps>> {

    title(): JSX.Element {
        return <ResponsibilitiesPageTitle
            title="Download demographic data sets"
        />;
    }

    render(): JSX.Element {
        return <PageArticle title={this.title()}>
            <DownloadDemographicsContent/>
        </PageArticle>;
    }

}

export const DownloadDemographicsPage =
    ContribPage(downloadDemographicsContribPageActionCreators)(DownloadDemographicsPageComponent);
