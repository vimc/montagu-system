import {AdminPage} from "../../../AdminPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import * as React from "react";
import {coveragePageActionCreators} from "../../../actions/pages/CoveragePageActionCreators";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {UploadCoverage} from "./UploadCoverage";
import {Alert} from "reactstrap";
import {SelectedFile} from "../../../../contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {ModelRunParametersFormProps} from "../../../../contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";

class CoveragePageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
           <UploadCoverage></UploadCoverage>
        </PageArticle>;
    }

}

export const CoveragePage = AdminPage(coveragePageActionCreators)(CoveragePageComponent);
