import * as React from "react";
import { mainStore } from "../../../../stores/MainStore";
import { Option, OptionSelector } from "../../../OptionSelector/OptionSelector";
import { responsibilityActions } from "../../../../actions/ResponsibilityActions";
import { IExtendedResponsibilitySet } from "../../../../models/ResponsibilitySet";

export class DiseaseFilter extends React.Component<IExtendedResponsibilitySet, undefined> {
    render(): JSX.Element {
        const diseaseIds = [ ...new Set(this.props.responsibilities.map(x => x.scenario.disease)) ];
        if (diseaseIds.length > 1) {
            const options: Option[] = diseaseIds
                .map(id => mainStore.getDiseaseById(id))
                .map(disease => ({ value: disease.id, text: disease.name }));

            return <div>
                Filter by disease:&nbsp;
                <OptionSelector options={ options } onChange={ this.filterByDisease } defaultOption="All" />
            </div>;
        } else {
            return <span />;
        }
    }

    filterByDisease(id: string) {
        responsibilityActions.filterByDisease(id);
    }
}