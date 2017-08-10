import * as React from "react";
import { PageWithHeaderAndNav } from "../../PageWithHeader/PageWithHeaderAndNav";
import { DownloadDataTitle } from "../DownloadDataTitle";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class DownloadDemographicsPage extends PageWithHeaderAndNav<LocationProps> {
    title(): JSX.Element {
        return <DownloadDataTitle title="Download demographic data sets" />
    }

    renderPageContent(): JSX.Element {
        return <span> </span>;
    }

}