import {AdminPage} from "../../../AdminPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import * as React from "react";
import {coveragePageActionCreators} from "../../../actions/pages/CoveragePageActionCreators";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {UploadCoverage} from "./UploadCoverage";

class CoveragePageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
           <UploadCoverage></UploadCoverage>
        </PageArticle>;
    }

}

export const CoveragePage = AdminPage(coveragePageActionCreators)(CoveragePageComponent);
