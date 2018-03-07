import * as React from "react";
import { DownloadDataTitle } from "../DownloadDataTitle";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { demographicStore } from "../../../stores/DemographicStore";
import { DownloadDemographicsContent } from "./DownloadDemographicsContent";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import { Page } from "../../../../shared/components/PageWithHeader/Page";
import {ChooseActionPage} from "../../ChooseAction/ChooseActionPage";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class DownloadDemographicsPage extends ContribPageWithHeader<LocationProps> {
    load(props: LocationProps) {
        return new ChooseActionPage().load(props).then(() => {
            touchstoneActions.setCurrentTouchstone(props.touchstoneId);
            return demographicStore.fetchDataSets();
        });
    }

    name() {
        return "Download demographic data sets";
    }

    title(): JSX.Element {
        return <DownloadDataTitle title="Download demographic data sets" />
    }

    urlFragment(): string {
        return "demographics/";
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <DownloadDemographicsContent />
        </Page>;
    }

}