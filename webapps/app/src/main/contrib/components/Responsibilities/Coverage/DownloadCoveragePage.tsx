import * as React from "react";

import {DownloadCoverageContent} from "./DownloadCoverageContent";
import {ResponsibilitiesPageTitle} from "../PageTitle";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {downloadCoveragePageActionCreators} from "../../../actions/pages/downloadCoveragePageActionCreators";
import {ContribPage} from "../../../ContribPage";

export interface DownloadCoveragePageLocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePageComponent extends React.Component<PageProperties<DownloadCoveragePageLocationProps>> {

    static title(): JSX.Element {
        return <ResponsibilitiesPageTitle title="Download coverage data"/>;
    }

    render(): JSX.Element {
        return <PageArticle title={DownloadCoveragePageComponent.title()}>
            <DownloadCoverageContent/>
        </PageArticle>;
    }
}

export const DownloadCoveragePage = ContribPage(downloadCoveragePageActionCreators)(DownloadCoveragePageComponent);