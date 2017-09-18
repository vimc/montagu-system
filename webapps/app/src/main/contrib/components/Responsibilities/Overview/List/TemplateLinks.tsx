import * as React from "react";
import { mainStore } from "../../../../stores/MainStore";
import { ExtendedResponsibility } from "../../../../models/ResponsibilitySet";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";
import { Link } from "simple-react-router";

export interface TemplateLinksProps {
    responsibilities: ExtendedResponsibility[];
    groupId: string
}

export interface TemplateLinkProps{
    diseaseId: string;
    groupId: string;
}

const buttonStyles = require("../../../../../shared/styles/buttons.css");

export class TemplateLink extends React.Component<TemplateLinkProps, undefined> {
    render(): JSX.Element {

        const disease = mainStore.getDiseaseById(this.props.diseaseId);
        const href = `/templates/${this.props.groupId}-${disease.id}.csv`;

        return <Link key={disease.id}
                           href={href}>{disease.name}</Link>;
    }
}

export class TemplateButtonLink extends React.Component<TemplateLinkProps, undefined> {
    render(): JSX.Element {

        const disease = mainStore.getDiseaseById(this.props.diseaseId);
        const href = `/templates/${this.props.groupId}-${disease.id}.csv`;

        return <ButtonLink key={disease.id}
                           className={buttonStyles.submit}
                           href={href}>{disease.name}</ButtonLink>;
    }
}

export class TemplateLinks extends React.Component<TemplateLinksProps, undefined> {
    render(): JSX.Element {

        const diseaseIds = [ ...new Set(this.props.responsibilities.map(x => x.scenario.disease)) ];

        if (diseaseIds.length > 0) {
            const links = diseaseIds
                .map(id => <TemplateButtonLink diseaseId={id} groupId={this.props.groupId}/>);

            return <div>
                Download burden estimate templates:<br/>
                {links}
            </div>;
        } else {
            return <span/>;
        }
    }

}