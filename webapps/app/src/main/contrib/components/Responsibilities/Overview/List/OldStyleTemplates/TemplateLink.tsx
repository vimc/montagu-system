import * as React from "react"
import {connect} from "react-redux";

import {ContribAppState} from "../../../../../reducers/contribAppReducers";
import {Disease} from "../../../../../../shared/models/Generated";
import {settings} from "../../../../../../shared/Settings";
import {CDARazavi, ICHallett, LI} from "./HepBTemplates";

export interface TemplateLinkProps {
    diseaseId: string;
    groupId: string;
    touchstoneId: string;
    diseases?: Disease[];
}

const templatePath = "/contribution/templates/";

const RfpTemplateLinks = (disease: Disease, touchstoneId: string) => {
    if (settings.isStochasticTouchstone(touchstoneId)) {
        return <div>
            <div>
                <a key={`central_burden_template_${disease.id}-generic.csv`}
                   href={`${templatePath}central_burden_template_${disease.id}-generic.csv`}>{disease.name}
                    - central</a>
            </div>
            <div>
                <a key={`stochastic_burden_template_${disease.id}-generic.csv`}
                   href={`${templatePath}stochastic_burden_template_${disease.id}-generic.csv`}>{disease.name}
                    - stochastic</a>
            </div>
        </div>
    }
    else {
        return <div>
            <a key={`central_burden_template_${disease.id}-generic.csv`}
               href={`${templatePath}central_burden_template_${disease.id}-generic.csv`}>{disease.name}</a>
        </div>
    }
};

export class TemplateLinkComponent extends React.Component<TemplateLinkProps, undefined> {
    render(): JSX.Element {

        const disease = this.props.diseases.find(disease => disease.id === this.props.diseaseId);

        if (this.props.groupId.toLowerCase() == "li") {
            return LI(templatePath)
        }

        if (this.props.groupId.toLowerCase() == "cda-razavi") {
            return CDARazavi(templatePath)
        }

        if (this.props.groupId.toLowerCase() == "ic-hallett") {
            return ICHallett(templatePath)
        }

        if (settings.isApplicantTouchstone(this.props.touchstoneId)) {
            return RfpTemplateLinks(disease, this.props.touchstoneId)
        }

        const href = `${templatePath}central_burden_template_${disease.id}-${this.props.groupId}.csv`;
        const hrefStochastic = `${templatePath}stochastic_burden_template_${disease.id}-${this.props.groupId}.csv`;

        return <div>
            <div>
                <a key={`${disease.id}-d`}
                   href={href}>{disease.name} - central</a>
            </div>
            <div>
                <a key={`${disease.id}-s`}
                   href={hrefStochastic}>{disease.name} - stochastic</a>
            </div>
        </div>;
    }
}

const mapStateToProps = (state: ContribAppState, props: TemplateLinkProps): Partial<TemplateLinkProps> => {
    return {
        ...props,
        diseases: state.diseases.diseases
    }
};

export const TemplateLink = connect(mapStateToProps)(TemplateLinkComponent);
