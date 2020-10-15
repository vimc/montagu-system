import {AdminPage} from "../../../AdminPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import * as React from "react";
import {coveragePageActionCreators} from "../../../actions/pages/CoveragePageActionCreators";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";

class CoveragePageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {
    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            Coverage for touchstone
        </PageArticle>;
    }
}

export const CoveragePage = AdminPage(coveragePageActionCreators)(CoveragePageComponent);
