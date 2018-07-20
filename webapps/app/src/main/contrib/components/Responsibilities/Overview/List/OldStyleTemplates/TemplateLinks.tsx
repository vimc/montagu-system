import * as React from "react";

import {TemplateLink} from "./TemplateLink";
import {ExtendedResponsibility} from "../../../../../models/ResponsibilitySet";

export interface TemplateLinksProps {
    responsibilities: ExtendedResponsibility[];
    groupId: string;
    touchstoneId: string;
}

export class TemplateLinks extends React.Component<TemplateLinksProps, undefined> {
    render(): JSX.Element {

        const diseaseIds = [...new Set(this.props.responsibilities.map(x => x.scenario.disease))];

        if (diseaseIds.length > 0) {
            let links: JSX.Element[] = diseaseIds
                .map(id =>
                    <TemplateLink
                        key={id}
                        diseaseId={id}
                        groupId={this.props.groupId}
                        touchstoneId={this.props.touchstoneId}
                    />);

            return <div>Download burden estimate templates:<br/>
                {links}
            </div>;
        } else {
            return <span/>;
        }
    }

}