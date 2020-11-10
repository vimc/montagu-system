import {AdminPage} from "../../../AdminPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {coverageVariablesPageActionCreators} from "../../../actions/pages/CoverageVariablesPageActionCreators";

class CoverageVariablesPageComponent extends React.Component<PageProperties<TouchstoneVersionPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={this.props.title}>
            <ul>
                <li>
                    vaccine: one of the following recognised vaccine codes:
                    Cholera,
                    DTP3,
                    HepB,
                    HepB_BD,
                    HepB_BD_home,
                    Hib3,
                    HPV,
                    JE,
                    MCV1,
                    MCV2,
                    Measles,
                    MenA,
                    MR1,
                    MR2,
                    Pentavalent,
                    PCV3,
                    RCV2,
                    Rota,
                    Rubella,
                    Typhoid,
                    YF
                </li>
                <li>country: the ISO code for this country</li>
                <li>activity_type: "campaign" or "routine"</li>
                <li>gavi_support: true or false - whether or not GAVI funded this program</li>
                <li>year: one of {new Date().getFullYear()} - 2030</li>
                <li>age_first: the lowest age that received this vaccine</li>
                <li>age_last: the highest age that received this vaccine</li>
                <li>gender: "female", "male", or "both"</li>
                <li>target: the number of people in the target population</li>
                <li>coverage: the fraction of the target population covered</li>
                <li>subnational: true or false - was this distributed at a subnational level?</li>
            </ul>
        </PageArticle>
    }

}

export const CoverageVariablesPage = AdminPage(coverageVariablesPageActionCreators)(CoverageVariablesPageComponent);
