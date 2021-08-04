import * as React from "react";

import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import {settings} from "../../../../../shared/Settings";
import {mapStateToGuidanceContentProps, ResponsibilityGuidanceContentProps} from "./ResponsibilityGuidanceContentProps";
import {connect} from "react-redux";

export class ResponsibilityGuidanceModelInputsContent2021Component extends React.Component<ResponsibilityGuidanceContentProps> {

    render(): JSX.Element {
        return <PageArticle title="Guidance on model inputs: coverage and demographic data">

            <div className="alert alert-primary">Guidance for
                touchstone {this.props.touchstoneVersion.description}</div>

            <div className="largeSectionTitle">Input data sources</div>
            <p>Both coverage and demographic datasets to be used in the 2021 practice models runs are available for
                download through Montagu. Please download and use these datasets, rather than your own datasets, to
                ensure consistency of estimates across the Consortium.
            </p>

            <div className="largeSectionTitle">Coverage</div>
            <p>Coverage for the 2021 practice runs is identical to the 201910 full model runs. However, we have only
                included one no-vaccination and one default scenario. Depending on the disease, the default scenario may
                contain both routine and campaign coverage sets, or just one of these.</p>
            <p>There are no coverage sets included in the no vaccination scenario, and therefore this coverage file does
                not contain any data apart from the header row.</p>
            <p><b>gavi_support</b> can be ignored. All column values are ‘total’; this means either Gavi-funded or not
                Gavi-funded.</p>
            <p><b>age_range_verbatim</b> is a description of the age range. We have used this to
                infer <b>age_first</b> and <b>age_last</b>. Where age_range_verbatim is ‘NA’, this indicates the default
                age_first and age_last value for that vaccine.</p>
            <p><b>coverage</b> shows the level of vaccination coverage</p>
            <p>Coverage and target population are now always specified at a national level. For example, where a
                campaign targets all ages in Region A (population 1,000,000) and achieves 90% coverage, and where the
                population of the whole country is 5,000,000, the coverage would appear on Montagu as 0.18 (18%) and the
                target population as 5,000,000. This way of specifying coverage and target population applies in both
                past and future years.</p>
            <p><b>target</b> is the number of individuals in the target population. This is always shown for campaigns,
                and is now specified at a national level. (See ‘coverage’ section above.) For routine, target is shown
                as <b>NA</b>, which means you should assume the target population matches the population shown in the
                demographic data downloads for the corresponding ages (age_first and age_last). HPV modellers should
                also filter the demographic downloads by gender=female.</p>

            <div className="largeSectionTitle">Demography</div>
            <p><b>Q. What is the source of the demographic data provided via Montagu for the 202108 practice run
                touchstone?</b></p>
            <p>A. Most of the demographic data is based on the <a href="https://esa.un.org/unpd/wpp/" target="_blank">UN
                World Population Prospects (UNWPP) 2019 Revision</a>. Some datasets were augmented to fill particular
                gaps; descriptions for how we created these can be found here:</p>
            <ul>
                <li><InternalLink href="/help/neonatal-mortality/">Neonatal Mortality</InternalLink> - using the <a
                    href="https://childmortality.org" target="_blank">IGME 2018 release (Sep 2019)</a></li>
                <li><InternalLink href="/help/kosovo/">Kosovo</InternalLink> - using most recent <a
                    href="http://ask.rks-gov.net/en/kosovo-agency-of-statistics/add-news/population-estimation-2018"
                    target="_blank">population estimate</a> from Kosovo Agency of Statistics
                </li>
                <li><InternalLink href="/help/marshall-islands/">Marshall Islands</InternalLink></li>
                <li><InternalLink href="/help/tuvalu/">Tuvalu</InternalLink></li>
                <li><a
                    href="https://montagu.vaccineimpact.org/reports/report/internal-2018-demography-pre1950/20180524-142831-4228995a"
                    target="_blank">Back-projection to birth for cohorts alive in 1950</a></li>
            </ul>
            <p><b>Q. Can I use a different set of demographic data, rather than the set provided on Montagu?</b></p>
            <p>A. No. In order to ensure consistency between all models, you must use the demographic data provided via
                Montagu.</p>
            <p><b>Q. Why does male + female not equal the total population?</b></p>
            <p>A. This is a property of the UNWPP data; they provide separate data for male, female, and total, and we
                provide the same data.</p>
            <p><b>Q. Why is population at birth (age 0) not the same as the number of births?</b></p>
            <p>A. In UNWPP data, age ‘0-0‘ refers to all people under 1 year old on a particular reference day. This
                will differ from the number of births into this cohort during the year due to the timing, and the
                effects of infant mortality and migration.</p>
            <p><b>Q. I require demographic data that isn‘t available on Montagu. What should I do?</b></p>
            <p>A. Please contact us at <a href={`mailto:${settings.supportContact}`}>{settings.supportContact}</a>.</p>
            <p><b>Q. Can I download all demographic data in one download?</b></p>
            <p>A. We are still working on this functionality. For now, you will need to download each demographic
                dataset separately.</p>

        </PageArticle>
    }

}

export const ResponsibilityGuidanceModelInputsContent2021 = connect(mapStateToGuidanceContentProps)(ResponsibilityGuidanceModelInputsContent2021Component);