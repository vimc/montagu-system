import * as React from "react";
import {mainStore} from "../../../../stores/MainStore";
import {ExtendedResponsibility} from "../../../../models/ResponsibilitySet";
import { settings } from "../../../../../shared/Settings";

const stochasticParams = require('./stochastic_template_params.csv');

export interface TemplateLinksProps {
    responsibilities: ExtendedResponsibility[];
    groupId: string;
    touchstoneId: string;
}

export interface TemplateLinkProps {
    diseaseId: string;
    groupId: string;
    touchstoneId: string;
}

export class TemplateLink extends React.Component<TemplateLinkProps, undefined> {
    render(): JSX.Element {

        const templatePath = "/contribution/templates/";
        const disease = mainStore.getDiseaseById(this.props.diseaseId);
        const href = `${templatePath}central_burden_template_${disease.id}-${this.props.groupId}.csv`;
        const hrefStochastic = `${templatePath}stochastic_burden_template_${disease.id}-${this.props.groupId}.csv`;

        if (this.props.groupId.toLowerCase() == "li") {
            return <ul className="list-unstyled">
                <li>
                    <a href={`${templatePath}98-countries-central_burden_template_HepB-Li.csv`}>98 countries central
                        estimates</a>
                </li>
                <li>
                    <a href={`${templatePath}98-countries-stochastic_burden_template_HepB-Li.csv`}>98 countries stochastic
                        estimates</a>
                </li>
            </ul>
        }

        if (this.props.groupId.toLowerCase() == "cda-razavi"){
            return <ul className="list-unstyled">
                <li>
                    <a href={`${templatePath}98-countries-central_burden_template_HepB-CDA-Razavi.csv`}>all 98 countries - central</a>
                </li>
                <li>
                    <a href={`${templatePath}98-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>all 98 countries - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}19-countries-central_burden_template_HepB-CDA-Razavi.csv`}>non-gavi with current BD_facility - central</a>
                </li>
                <li>
                    <a href={`${templatePath}19-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>non-gavi with current BD_facility - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}79-countries-central_burden_template_HepB-CDA-Razavi.csv`}>gavi + non-gavi without BD_facility - central</a>
                </li>
                <li>
                    <a href={`${templatePath}79-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>gavi + non-gavi without BD_facility - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}92-countries-central_burden_template_HepB-CDA-Razavi.csv`}>gavi + non-gavi with current BD_facility - central</a>
                </li>
                <li>
                    <a href={`${templatePath}92-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>gavi + non-gavi with current BD_facility - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}73-countries-central_burden_template_HepB-CDA-Razavi.csv`}>gavi countries - central</a>
                </li>
                <li>
                    <a href={`${templatePath}73-countries-stochastic_burden_template_HepB-CDA-Razavi.csv`}>gavi countries - stochastic</a>
                </li>
            </ul>
        }

        if (this.props.groupId.toLowerCase() == "ic-hallett"){
            return <ul className="list-unstyled">
                <li>
                    <a href={`${templatePath}98-countries-central_burden_template_HepB-IC-Hallett.csv`}>all 98 countries - central</a>
                </li>
                <li>
                    <a href={`${templatePath}98-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>all 98 countries - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}19-countries-central_burden_template_HepB-IC-Hallett.csv`}>non-gavi with current BD_facility - central</a>
                </li>
                <li>
                    <a href={`${templatePath}19-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>non-gavi with current BD_facility - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}79-countries-central_burden_template_HepB-IC-Hallett.csv`}>gavi + non-gavi without BD_facility - central</a>
                </li>
                <li>
                    <a href={`${templatePath}79-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>gavi + non-gavi without BD_facility - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}92-countries-central_burden_template_HepB-IC-Hallett.csv`}>gavi + non-gavi with current BD_facility - central</a>
                </li>
                <li>
                    <a href={`${templatePath}92-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>gavi + non-gavi with current BD_facility - stochastic</a>
                </li>
                <li>
                    <a href={`${templatePath}73-countries-central_burden_template_HepB-IC-Hallett.csv`}>gavi countries - central</a>
                </li>
                <li>
                    <a href={`${templatePath}73-countries-stochastic_burden_template_HepB-IC-Hallett.csv`}>gavi countries - stochastic</a>
                </li>
            </ul>
        }

        return <div>
            <div>
                <a key={`${disease.id}-d`}
                    href={href}>{disease.name} - central</a>
            </div>
            {this.props.touchstoneId != settings.modellerApplicantsTouchstoneId &&
                <div>
                    <a key={`${disease.id}-s`}
                       href={hrefStochastic}>{disease.name} - stochastic</a>
                </div>
            }
        </div>;
    }
}

export class TemplateLinks extends React.Component<TemplateLinksProps, undefined> {
    render(): JSX.Element {

        const diseaseIds = [...new Set(this.props.responsibilities.map(x => x.scenario.disease))];

        if (diseaseIds.length > 0) {
            const links = diseaseIds
                .map(id =>
                    <TemplateLink
                        key={id}
                        diseaseId={id}
                        groupId={this.props.groupId}
                        touchstoneId={this.props.touchstoneId}
                    />);

            return <div>Download burden estimate templates:<br/>
                {links}
                {this.props.touchstoneId != settings.modellerApplicantsTouchstoneId &&
                    <div>
                        <a key={"params"}
                           href={stochasticParams}>Stochastic parameters template</a>
                    </div>
                }
            </div>;
        } else {
            return <span/>;
        }
    }

}