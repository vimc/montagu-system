import * as React from "react";
import ScrollableAnchor from 'react-scrollable-anchor';

import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../shared/Settings";
import { InternalLink } from "../../../../shared/components/InternalLink";

const commonStyles = require("../../../../shared/styles/common.css");

export class ResponsibilityGuidanceModelInputs extends ContribPageWithHeader<undefined> {
    name() {
        return "Model inputs";
    }

    urlFragment() {
        return "help/model-inputs/";
    }

    title() {
        return <span>Guidance on model inputs: coverage and demographic data</span>;
    }

    parent() {
        return new ChooseGroupPage();
    }

    renderPageContent() {
        return <div>
            <div className={ commonStyles.largeSectionTitle }>
                Input data sources
            </div>
            <p>
                Both coverage and demographic datasets to be used in the full
                model runs are available for download through Montagu. Please
                download and use these datasets, rather than your own datasets
                to ensure consistency of estimates across the Consortium.
            </p>
            <div className={ commonStyles.largeSectionTitle }>
                Coverage
            </div>
            <p>
                The first set of full model runs generated within the VIMC will
                assume vaccination coverage as detailed in Gavi’s Operational
                Forecast v15 (OP15, released October 2017), which gives coverage
                for both routine and campaign vaccination in the Gavi 73 countries
                from 2017 to 2030. This is combined with coverage data from various
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
                            Up to 2016
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
                            Up to 2016
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
                            2017-2030
                        </td>
                        <td>
                            Routine
                        </td>
                        <td>
                            Gavi OP15
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Gavi 73
                        </td>
                        <td>
                            2017-2030
                        </td>
                        <td>
                            Campaign
                        </td>
                        <td>
                            Gavi OP15
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
                            Extrapolated from Gavi OP15
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
                            Up to 2016
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
                            Up to 2016
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
                            Other 25 countries
                        </td>
                        <td>
                            2017 onwards
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
                            2017 onwards
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
                Each scenario is based on vaccination coverage from up to 3
                different coverage sets (e.g. routine and campaign). The
                datasets to download contain data on all coverage sets to be
                included in a particular scenario. Note that there are no
                coverage sets included in the no vaccination scenario, and
                therefore the coverage file does not contain any data apart
                from the header row.
            </p>
            <ScrollableAnchor id={'demography'}>
                <div className={ commonStyles.largeSectionTitle }>
                    Demography
                </div>
            </ScrollableAnchor>
            <p>
                <b>Q. What is the source of the demographic data provided via Montagu
                    for the October 2017 touchstone?</b>
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
        </div>;
    }
}