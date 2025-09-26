import * as React from "react";

import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import ScrollableAnchor from "react-scrollable-anchor";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import {settings} from "../../../../../shared/Settings";
import { ResponsibilityGuidanceContentProps, mapStateToGuidanceContentProps} from "./ResponsibilityGuidanceContentProps";
import {connect} from "react-redux";


export class ResponsibilityGuidanceModelOutputsContentLatestComponent extends React.Component<ResponsibilityGuidanceContentProps> {

    render() :JSX.Element {
        const dalysPdf = require("./guidance-201710-DALYs.pdf");

        return <PageArticle title="Guidance on model outputs: how to generate and upload central estimates">
            <div className="alert alert-primary">
                Guidance for touchstone {this.props.touchstoneVersion.description}
            </div>
            <div className="largeSectionTitle">
                Required model outputs
            </div>
            <p>
                For these small-scale estimates, you will need to provide the following:
            </p>
            <table>
                <thead>
                <tr>
                    <th>Item</th>
                    <th>How to create</th>
                    <th>Where to upload complete file(s)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Central estimates for up to 5 countries (multiple files) </td>
                    <td>
                        Download central burden estimate template from Montagu, use this to create one file per scenario
                    </td>
                    <td>Montagu</td>
                </tr>
                </tbody>
            </table>
            <p>
                Please refer to the scope of work in your subcontract and any subsequent emails for the latest deadlines.
            </p>
            <div className="mb-3 mt-5 sectionTitle">Countries</div>
            <ul>
                <li>JE groups: China, Pakistan, India</li>
                <li>Men A & YF groups: Ethiopia, Nigeria</li>
                <li>All other groups: China, Pakistan, India, Nigeria, Ethiopia</li>
            </ul>
            <div className="mb-3 mt-5 sectionTitle">Keeping model frozen</div>
            <p>
                Your model must be frozen in the state used for the latest full-country central estimates that you
                uploaded to Montagu (in the 201710gavi touchstone). The only update should be coverage.
            </p>
            <div className="mb-3 mt-5">
                <span className="sectionTitle">Central estimates</span>
                &nbsp;(previously known as deterministic estimates)
            </div>
            <p>
                First, download your central burden estimate template from the Responsibilities page
                (click ‘Download burden estimate templates’). These templates are customised for each model.
            </p>
            <p>
                You will need to use this template to create one file for each
                scenario, ensuring that you fill in all rows and columns.
                Please contact us (
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                ) if there are
                any problems with this.
            </p>
            <p>
                Your scenarios are shown in the grey headings on the Responsibilities page. These generally include
                the same scenarios you had in the 201710gavi touchstone, plus some synthetic scenarios which have
                10% higher or lower coverage, or which show ‘best case coverage’.
            </p>
            <p>
                The coverage data for each scenario
                may contain more than one coverage set. For instance, depending on the disease the campaign scenario
                may contain both routine and campaign coverage to enable us to evaluate the incremental impact of
                campaigns on top of routine vaccination. Details of the
                coverage sets are shown after you click the ‘<strong>Download
                coverage data</strong>’ buttons.
            </p>
            <p>
                Once you have completed one output file for each scenario,
                you should upload each file to Montagu, using the ‘<strong>Upload
                burden estimates</strong>’ buttons on the Responsibilities page.
            </p>
            <p>
                There is no specific filename format to use. This is because
                when you upload through Montagu, the URL of the page you are
                on will determine the scenario.
            </p>
            <p>
                If your central burden estimate uploads successfully, you will
                see a ‘Success’ message. If not, you will see a red header
                explaining the problem.
            </p>
            <p>
                Montagu will also ask you to register how these have been
                calculated, i.e. whether your central estimates are an average
                of your stochastic estimates. (If you are unsure how to answer
                the second question, you can enter ‘N/A’.)
            </p>
            <div className="mb-3 mt-5">
                <span className="sectionTitle">Stochastic estimates</span>
                &nbsp;(also known as probabilistic estimates)
            </div>
            <p>
                Stochastic estimates are not required for this touchstone. Please provide central estimates only.
            </p>

            <div className="mb-3 mt-5 sectionTitle">Age groups</div>
            <p>
                The age groups in your burden estimate templates must be
                1-year age groups. If your model uses larger age groups,
                you will need to disaggregate these.
            </p>
            <div className="mb-3 mt-5 sectionTitle">DALYs guidance</div>
            <p>
                <a href={dalysPdf} target="_blank">
                    Download report with detailed guidance on DALYs.
                </a>
            </p>
            <div className="mb-3 mt-5 sectionTitle">Cohort size</div>
            <p>
                The cohort size is the number of people alive in a given
                birth cohort specified by the calendar year and age during
                that year – so it will be the same across all scenarios.
                We will then be able to calculate the number of FVPs
                (fully vaccinated persons) by multiplying this with the
                relevant coverage. The cohort size should be comparable to
                the interpolated population provided on Montagu. The cohort
                size should reflect the age range, time range and gender
                (female, male or both) for which your model is tracking the
                population.
            </p>
            <div className="mb-3 mt-5 sectionTitle">
                Checklist for avoiding errors when uploading to Montagu:
            </div>
            <ul>
                <li>
                    Your file should not contain any empty columns
                </li>
                <li>
                    Values should not contain commas (e.g. 1395 not 1,395)
                </li>
                <li>
                    The demographic/coverage data may include years that are
                    outside the scope we are asking you to provide estimates
                    for. Therefore, you should go by the years that appear
                    in the burden estimate templates.
                </li>
                <li>
                    If your model doesn't provide something that the burden
                    estimate template requires, please contact us (see below).
                </li>
            </ul>
            <p>
                If you have any questions or any problems uploading your
                burden estimates, please email&nbsp;
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                &nbsp;or use the #montagu-help channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>.
            </p>
        </PageArticle>
    }
}

export const ResponsibilityGuidanceModelOutputsContentLatest = connect(mapStateToGuidanceContentProps)(ResponsibilityGuidanceModelOutputsContentLatestComponent);