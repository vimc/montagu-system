import * as React from "react";

import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {settings} from "../../../../../shared/Settings";
import {mapStateToGuidanceContentProps, ResponsibilityGuidanceContentProps} from "./ResponsibilityGuidanceContentProps";
import {connect} from "react-redux";


export class ResponsibilityGuidanceModelOutputsContent2021Component extends React.Component<ResponsibilityGuidanceContentProps> {

    render(): JSX.Element {
        const centralEstimatesColumns = require("./2018-central-estimates-columns.png");

        return <PageArticle title="Guidance on model outputs: how to generate and upload central estimates">

            <div className="alert alert-primary">Guidance for
                touchstone {this.props.touchstoneVersion.description}</div>

            <div className="largeSectionTitle">Overview</div>
            <p>The 2021 practice runs are not a requirement, but we encourage modellers to provide them to ensure their
                model will work on Montagu for the full 2021 runs. For the practice runs, we expect only central
                estimates, not stochastic estimates.</p>
            <p>(For the full model runs, we will require both central and stochastic estimates.)</p>

            <div className="largeSectionTitle">Countries</div>
            <ul>
                <li>JE groups: China, Pakistan, India</li>
                <li>Men A & YF groups: Ethiopia, Nigeria</li>
                <li>Typhoid and cholera groups: Pakistan, India, Nigeria, Ethiopia</li>
                <li>All other groups: China, Pakistan, India, Nigeria, Ethiopia</li>
            </ul>

            <div className="largeSectionTitle">State of your model</div>
            <p>We encourage you to keep track of the model version used for the practice runs, and any changes
                implemented between the 2021 practice runs and 2021 full model runs.</p>

            <div className="largeSectionTitle">Central estimates</div>
            <p>First, download your central burden estimate template from the Responsibilities page (listed under
                ‘Scenarios’). These templates are customised for each model.</p>
            <p>You will need to use this template to create one file for each scenario, ensuring that you fill in all
                rows and columns. Montagu will now only accept your central estimate files if these contain the same
                number of rows and columns as your template. Therefore, if your template differs from what you are
                expecting, please <a href={`mailto:${settings.supportContact}`}>contact us</a>.</p>
            <p>Please refer to ‘Guidance on Model Inputs’ for more information about the scenarios.</p>
            <p>Once you have completed one output file for each scenario, you should upload each file to Montagu, using
                the <b>‘Upload central burden estimates’</b> buttons on the Responsibilities page.</p>
            <p>There is no specific filename format to use. This is because when you upload through Montagu, the URL of
                the page you are on will determine the scenario.</p>
            <p>Montagu will confirm whether each central burden estimate file uploads successfully and show you some
                quick diagnostic graphs.</p>

            <div className="mb-3 mt-4 sectionTitle">Registering how your central estimates have been calculated</div>
            <p>When uploading your central estimates, Montagu will ask you to register how these have been calculated.
                As these are only practice runs, you may enter n/a.</p>

            <div className="mb-3 mt-4 sectionTitle">Age groups</div>
            <p>The age groups in your burden estimate templates must be 1-year age groups. If your model uses larger age
                groups, you will need to disaggregate these.</p>

            <div className="mb-3 mt-4 sectionTitle">DALYs guidance</div>
            <p><a
                href="https://montagu.vaccineimpact.org/reports/report/VIMC-model-run-DALYs-guidance/20190917-121647-d5d6ef09/"
                target="_blank">Download report with detailed guidance on DALYs</a>.</p>

            <div className="mb-3 mt-4 sectionTitle">Main output columns</div>
            <p>For most groups, the main output columns in the burden estimate template are cases, DALYs and deaths. In
                the example row below, in cells G2/H2/I2, you should enter the number of yellow fever cases/DALYs/deaths
                that occurred in the year 2000 among 0-year-olds in Angola, for the scenario in question.</p>
            <img src={centralEstimatesColumns}></img>

            <div className="mb-3 mt-4 sectionTitle">Cohort size</div>
            <p>The cohort size is the number of people alive in a given birth cohort specified by the calendar year and
                age during that year – so it will be the same across all scenarios. Taking the above row as an example,
                in cell F2 you should enter the number of 0-year-olds in Angola in the year 2000. You must include the
                actual cohort size for each row; Montagu will not accept ‘NA’ as a value.</p>
            <p>We will then be able to calculate the number of FVPs (fully vaccinated persons) by multiplying this with
                the relevant coverage. The cohort size should be comparable to the interpolated population provided on
                Montagu. The cohort size should reflect the age range, time range and gender (female, male or both) for
                which your model is tracking the population.</p>

            <div className="mb-3 mt-4 sectionTitle">Checklist for avoiding errors when uploading to Montagu</div>
            <ul>
                <li>Your file must not contain any empty cells or ‘NA’ values</li>
                <li>Your file must contain the exact same rows and columns as your burden estimate template</li>
                <li>Values should not contain commas (e.g. 1395 not 1,395)</li>
                <li>The demographic/coverage data may include years that are outside the scope we are asking you to
                    provide estimates for. Therefore, you should go by the years that appear in your template.
                </li>
                <li>If your model doesn't provide something that the template requires, please <a
                    href={`mailto:${settings.supportContact}`}>contact us</a>.
                </li>
            </ul>

            <div className="largeSectionTitle">Contact us</div>
            <p>To contact us, please email <a href={`mailto:${settings.supportContact}`}>{settings.supportContact}</a>.
            </p>

        </PageArticle>
    }

}

export const ResponsibilityGuidanceModelOutputsContent2021 = connect(mapStateToGuidanceContentProps)(ResponsibilityGuidanceModelOutputsContent2021Component);