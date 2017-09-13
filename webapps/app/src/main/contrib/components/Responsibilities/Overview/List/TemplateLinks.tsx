import * as React from "react";
import { mainStore } from "../../../../stores/MainStore";
import { ExtendedResponsibility, IExtendedResponsibilitySet } from "../../../../models/ResponsibilitySet";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";

interface TemplateLinksProps {
    responsibilities: ExtendedResponsibility[];
    groupId: String
}

export class TemplateLinks extends React.Component<TemplateLinksProps, undefined> {
    render(): JSX.Element {

        const diseaseIds = [ ...new Set(this.props.responsibilities.map(x => x.scenario.disease)) ];

        if (diseaseIds.length > 0) {
            const links = diseaseIds
                .map(id => mainStore.getDiseaseById(id))
                .map(disease => <ButtonLink key={disease.id}
                                            href={`/templates/${this.props.groupId}-${disease.id}.csv`}>{disease.name}</ButtonLink>);

            return <div>
                Download burden estimate templates:<br/>
                {links}
            </div>;
        } else {
            return <span/>;
        }
    }

}