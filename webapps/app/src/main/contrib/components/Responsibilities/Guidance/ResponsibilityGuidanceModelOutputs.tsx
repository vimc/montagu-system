import * as React from "react";
import { ContribPageWithHeader } from "../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../shared/Settings";

const commonStyles = require("../../../../shared/styles/common.css");

export class ResponsibilityGuidanceModelOutputs extends ContribPageWithHeader<undefined> {
    name() {
        return "Model outputs";
    }

    urlFragment() {
        return "help/model-outputs/";
    }

    title() {
        return <span>Guidance on model outputs: how to generate and upload
            central and stochastic estimates</span>;
    }

    parent() {
        return new ChooseGroupPage();
    }

    renderPageContent() {
        return <div>
            <div className={ commonStyles.largeSectionTitle }>
                Required model outputs
            </div>
            <p>
                In this round of model runs we require:
            </p>
            <ul>
                <li>
                    central estimates from each model – due by 8 December
                    (extended from 30 November)
                </li>
                <li>
                    stochastic estimates from each model – due by 8 January
                    (extended from 31 December)
                </li>
                <li>
                    parameters file – due by 8 January (see below)
                </li>
            </ul>
            <p>
                <b>Central estimates</b> (previously known as deterministic
                estimates)
            </p>
            <p>
                First, download your central burden estimate template from this
                page (listed under ‘Scenarios’). These templates are customised
                for each model following the discussions after the test runs.
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
                Your scenarios are shown in the grey headings on Responsibility page.
                Most modelling groups have three scenarios (routine, no
                vaccination, campaign) but others have more or less. The
                coverage data for each scenario may contain more than one
                coverage set. For instance, depending on the disease the
                campaign scenario may contain both routine and campaign
                coverage to enable us to evaluate the incremental impact
                of campaigns on top of routine vaccination. Details of the
                coverage sets are shown after you click the ‘Download
                coverage data’ buttons.
            </p>
            <p>
                Once you have completed one output file for each scenario,
                you should upload each file to Montagu, using the ‘Upload
                burden estimates’ buttons on Responsibility page.
            </p>
            <p>
                There is no specific filename format to use. This is because
                when you upload through Montagu, the URL of the page you are
                on will determine the scenario.
            </p>
            <p>
                If your central burden estimate uploads successfully, you
                will be directed to a page with a message ending
                “status”:”success”. If not, you will be directed to a page
                with a message explaining the errors, and ending
                “status”:”failure”.
            </p>
            <p>
                <b>Stochastic estimates</b> (also known as probabilistic estimates)
            </p>
            <p>
                We require multiple model runs for each scenario, each of which
                is based on a random sample from the joint uncertainty
                distribution (e.g. posterior distribution) of the input
                parameters. As we want to compare the runs across scenarios
                to calculate the impact, the same parameter samples should
                be used across all scenarios, and the runs labelled to ensure
                we can identify them.
            </p>
            <p>
                First, download your stochastic burden estimate template from
                Responsibility page
                (listed under ‘Scenarios’). This template is customised
                for each model following the discussions after the test runs.
            </p>
            <p>
                The format is almost identical to the central burden estimate
                template, but there is one additional column ‘run_id’. This
                column labels the particular run, and should link the run to
                the parameter value detailed in the parameters file.
                Importantly, the runs across all scenarios with the same run
                id should be based on the same parameter values.
            </p>
            <p>
                We require 200 independent realisations in the stochastic
                estimates. (We originally asked for 1000 realisations, but
                we have now decreased this to 200.) The template file only
                contains all rows for a single realisations, so you will
                need to generate 200 times as many rows.
            </p>
            <p>
                You will need to use the stochastic burden estimate template
                to create one or more files for each scenario, ensuring that
                you fill in all required rows and columns. If you choose to
                break the data up into multiple files it does not matter how
                you distribute the rows among files (e.g. by country, by
                run_id, by year or even randomly), as long as the data are
                complete, and scenarios are kept separate. The scenarios are
                the same as for your central estimates. Please contact us (
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                ) or use the #montagu-help channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>
                &nbsp;if there are any problems with this.
            </p>
            <p>
                The filename format for your stochastic burden files should
                be, for example,
                stochastic_burden_est_YF-IC-Garske_yf-routine-gavi_1.csv.
                The first part is from the template filename, the second part
                is the scenario ID (as it appears in Montagu), the final
                numberlast part is an arbitrary way to distinguish between
                different files for the same scenario if you choose to split
                the estimates across several files.
            </p>
            <p>
                Once you have completed all files for each scenario, you
                should upload each one to Dropbox, to the specific folder
                that we will email you. We will then use scripts to
                automatically process the uploaded files and import them
                into Montagu.
            </p>
            <p>
                If your model changes between uploading your central
                estimates and your stochastic estimates, please let us know
                by emailing&nbsp;
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                &nbsp;or using the #montagu-help channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>.
            </p>
            <p>
                <b>Parameters file</b>
            </p>
            <p>
                We would like to see the parameter values underlying your
                stochastic runs. To create this parameters file, please use
                the ‘parameters template’ available on Responsibility page
                (listed under ‘Scenarios’).
            </p>
            <p>
                It is essential that the runs across all scenarios with the
                same ‘run id’ are based on the same parameter values.
            </p>
            <p>
                Your parameters file should contain 200 rows (i.e. in
                addition to the row showing the column headings).
            </p>
            <p>
                The column headings in the template are labelled &lt;param_1&gt;
                and &lt;param_2&gt; but you should rename these to the actual
                parameters you are using, and add extra columns if necessary.
            </p>
            <p>
                If the model uses country-specific parameters, each
                country-specific parameter should be given in a separate
                column, using the naming convention &lt;parameter_name&gt;:&lt;ISO&gt;,
                where ISO is the 3-letter country code.
            </p>
            <p>
                Once you have completed your parameters file, you should
                upload this via Montagu.
            </p>
            <p>
                We will also be asking you to clarify how your central
                estimates relate to your stochastic estimates, i.e. whether
                they are an average of the stochastic estimates. If your
                model changes between uploading your central estimates
                and your stochastic estimates, please let us know by
                emailing montagu-help@imperial.ac.uk or using the
                #montagu-help channel on Slack.
            </p>
            <p>
                <b>Age groups</b>
            </p>
            <p>
                The age groups in your burden estimate templates must be
                1-year age groups. If your model uses larger age groups,
                you will need to disaggregate these.
            </p>
            <p>
                <b>DALYs guidance</b>
            </p>
            <p>
                Download report with detailed guidance on DALYs.
            </p>
            <p>
                <b>Cohort size</b>
            </p>
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
            <p>
                <b>Checklist for avoiding errors when uploading to Montagu:</b>
            </p>
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
        </div>;
    }
}