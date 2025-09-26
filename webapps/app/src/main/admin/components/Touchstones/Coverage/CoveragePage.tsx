import {AdminPage} from "../../../AdminPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import * as React from "react";
import {coveragePageActionCreators} from "../../../actions/pages/CoveragePageActionCreators";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {UploadCoverage} from "./UploadCoverage";
import {FileDownloadLink} from "../../../../shared/components/FileDownloadLink";
import {CoverageProgress} from "./CoverageProgress";

class CoveragePageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            <CoverageProgress></CoverageProgress>
            <FileDownloadLink href={"/coverage/template/"}>Download template</FileDownloadLink>
            <UploadCoverage></UploadCoverage>
        </PageArticle>;
    }

}

export const CoveragePage = AdminPage(coveragePageActionCreators)(CoveragePageComponent);
