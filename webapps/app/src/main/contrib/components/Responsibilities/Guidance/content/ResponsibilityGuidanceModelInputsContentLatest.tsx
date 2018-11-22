import {LoadingElement} from "../../../../../shared/partials/LoadingElement/LoadingElement";
import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import ScrollableAnchor from "react-scrollable-anchor";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import {settings} from "../../../../../shared/Settings";
import * as React from "react";
import {mapStateToGuidanceContentProps, ResponsibilityGuidanceContentProps} from "./ResponsibilityGuidanceContentProps";
import {connect} from "react-redux";

export class ResponsibilityGuidanceModelInputsContentLatestComponent extends React.Component<ResponsibilityGuidanceContentProps> {


    render() :JSX.Element {

        return <PageArticle title="Guidance on model inputs: coverage and demographic data">
            <div className="alert alert-primary">Guidance for touchstone {this.props.touchstoneVersion.description}</div>
            <div className="largeSectionTitle">
                Input data sources
            </div>
            <p>
                Both coverage and demographic datasets to be used in the full
                model runs are available for download through Montagu. Please
                download and use these datasets, rather than your own datasets
                to ensure consistency of estimates across the Consortium.
            </p>
            <div className="largeSectionTitle">
                Coverage
            </div>
            <p>
                The first set of full model runs generated within the VIMC will
                assume vaccination coverage as detailed in Gavi’s Operational
                Forecast v16 (OP16, released November 2018), which gives coverage
                for both routine and campaign vaccination in the Gavi 73 countries
                from 2018 to 2030. This is combined with coverage data from various
                other sources, some of which has been extrapolated by the VIMC
                secretariat, in order to cover all countries and time periods.
            </p>
            <table>
                <tbody>
                <tr>
                    <th>
                        Country set
                    </th>
                    <th>
                        Period
                    </th>
                    <th>
                        Type
                    </th>
                    <th>
                        Source
                    </th>
                </tr>

                <tr>
                    <td>
                        Gavi 73
                    </td>
                    <td>
                        Up to 2017
                    </td>
                    <td>
                        Routine
                    </td>
                    <td>
                        WUENIC
                    </td>
                </tr>
                <tr>
                    <td>
                        Gavi 73
                    </td>
                    <td>
                        Up to 2017
                    </td>
                    <td>
                        Campaign
                    </td>
                    <td>
                        Gavi records of past campaigns
                    </td>
                </tr>
                <tr>
                    <td>
                        Gavi 73
                    </td>
                    <td>
                        2018-2030
                    </td>
                    <td>
                        Routine
                    </td>
                    <td>
                        Gavi OP16
                    </td>
                </tr>
                <tr>
                    <td>
                        Gavi 73
                    </td>
                    <td>
                        2018-2030
                    </td>
                    <td>
                        Campaign
                    </td>
                    <td>
                        Gavi OP16
                    </td>
                </tr>
                <tr>
                    <td>
                        Gavi 73
                    </td>
                    <td>
                        2031 onwards
                    </td>
                    <td>
                        Routine
                    </td>
                    <td>
                        Extrapolated from Gavi OP16
                    </td>
                </tr>
                <tr>
                    <td>
                        Gavi 73
                    </td>
                    <td>
                        2031 onwards
                    </td>
                    <td>
                        Campaign
                    </td>
                    <td>
                        Assume no further campaigns
                    </td>
                </tr>
                <tr>
                    <td>
                        Other 25 countries
                    </td>
                    <td>
                        Up to 2017
                    </td>
                    <td>
                        Routine
                    </td>
                    <td>
                        WUENIC
                    </td>
                </tr>
                <tr>
                    <td>
                        Other 25 countries
                    </td>
                    <td>
                        Up to 2017
                    </td>
                    <td>
                        Campaign
                    </td>
                    <td>
                        Records of past campaigns from Gavi and other sources.
                    </td>
                </tr>
                <tr>
                    <td>
                        Other 25 countries
                    </td>
                    <td>
                        2018 onwards
                    </td>
                    <td>
                        Routine
                    </td>
                    <td>
                        Extrapolated from WUENIC routine coverage data by VIMC
                        secretariat, to cover future years.
                    </td>
                </tr>
                <tr>
                    <td>
                        Other 25 countries
                    </td>
                    <td>
                        2018 onwards
                    </td>
                    <td>
                        Campaign
                    </td>
                    <td>
                        Extrapolated from various sources by VIMC secretariat
                    </td>
                </tr>
                </tbody>
            </table>
            <br />
            <p>
                Each scenario is based on vaccination coverage from one or more different coverage sets (e.g. routine and campaign). The datasets to download contain data on all coverage sets to be included in a particular scenario. Note that there are no coverage sets included in the no vaccination scenario, and therefore the coverage file does not contain any data apart from the header row.
            </p>
            <p>
                <b>gavi_support</b> indicates per-year Gavi support. Where this is total, this means the coverage was Gavi-funded.
            </p>
            <p>
                <b>age_range_verbatim</b> is a description of the age range. We have used this to infer <b>age_first</b> and <b>age_last</b>.
            </p>
            <p>
                <b>coverage</b> shows the level of vaccination coverage, usually ranging from 0 (0%) to 1 (100%). In some cases, this value may be greater than 1. For example, if a campaign originally targets 1 million people but ends up vaccinating 1.1 million people, the coverage would be shown as 1.1 (equating to 110%).
            </p>
            <p>
                <b>target</b> is the number of individuals in the target population. Where target is shown as a value, this means the target population for the vaccination is different from the population shown in the demographic data downloads. For example, the vaccination may be a campaign targeting particular regions or cohorts. Where target is shown as <b>NA</b>, you should assume the target population matches the population shown in the demographic data downloads.
            </p>
            <ScrollableAnchor id={'demography'}>
                <div className="largeSectionTitle">
                    Demography
                </div>
            </ScrollableAnchor>
            <p>
                <b>Q. What is the source of the demographic data provided via Montagu
                    for the 201810 touchstone?</b>
            </p>
            <p>
                A. Most of the demographic data is based on the&nbsp;
                <a href="https://esa.un.org/unpd/wpp/" target="_blank">
                    UN World Population Prospects (UNWPP) 2017 Revision
                </a>.
                Some datasets were augmented to
                fill particular gaps; descriptions for how we created these can
                be found here:
            </p>
            <ul>
                <li>
                    <InternalLink href="/help/neonatal-mortality/">
                        Neonatal mortality
                    </InternalLink>
                </li>
                <li>
                    <InternalLink href="/help/over80/">
                        Population for over-80-year-olds before 1990
                    </InternalLink>
                </li>
                <li>
                    <InternalLink href="/help/kosovo/">
                        Kosovo
                    </InternalLink>
                </li>
                <li>
                    <InternalLink href="/help/marshall-islands/">
                        Marshall Islands
                    </InternalLink>
                </li>
                <li>
                    <InternalLink href="/help/tuvalu/">
                        Tuvalu
                    </InternalLink>
                </li>
            </ul>
            <p>
                <b>Q. Can I use a different set of demographic data, rather
                    than the set provided on Montagu?</b>
            </p>
            <p>
                A. No. In order to ensure consistency between all models, you
                must use the demographic data provided via Montagu.
            </p>
            <p>
                <b>Q. Why does male + female not equal the total population?</b>
            </p>
            <p>
                A. This is a property of the UNWPP data; they provide separate
                data for male, female, and total, and we provide the same data.
            </p>
            <p>
                <b>Q. Why is population at birth (age 0) not the same as the
                    number of births?</b>
            </p>
            <p>
                A. In UNWPP data, age '0-0' refers to all people under 1 year
                old on a particular reference day. This will differ from the
                number of births into this cohort during the year due to the
                timing, and the effects of infant mortality and migration.
            </p>
            <p>
                <b>Q. I require demographic data that isn't available on Montagu.
                    What should I do?</b>
            </p>
            <p>
                A. Please contact us at&nbsp;
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                &nbsp;or use
                the #montagu-help channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>.
            </p>
            <p>
                <b>Q. Can I download all demographic data in one download?</b>
            </p>
            <p>
                A. We are working on this functionality for future runs, but
                for the current runs you will need to download each demographic
                dataset separately.
            </p>
        </PageArticle>
    }
}

export const ResponsibilityGuidanceModelInputsContentLatest = connect(mapStateToGuidanceContentProps)(ResponsibilityGuidanceModelInputsContentLatestComponent);