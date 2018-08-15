import * as React from "react";

import {DownloadDemographicsContent} from "../../../../shared/components/Demographics/DownloadDemographicsContent";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {AdminPage} from "../../../AdminPage";
import {downloadDemographicsAdminPageActionCreators} from "../../../actions/pages/downloadDemographicsAdminPageActionCreators";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";

class DownloadDemographicsAdminPageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            <DownloadDemographicsContent/>
        </PageArticle>;
    }

}

export const DownloadDemographicsAdminPage
    = AdminPage(downloadDemographicsAdminPageActionCreators)(DownloadDemographicsAdminPageComponent);

