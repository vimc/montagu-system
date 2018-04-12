import * as React from "react";
import { compose, branch, renderNothing} from "recompose";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";

import { Option, OptionSelector } from "../../../OptionSelector/OptionSelector";
import {ContribAppState} from "../../../../reducers/contribAppReducers";
import {Disease, Responsibility} from "../../../../../shared/models/Generated";
import {diseasesActionCreators} from "../../../../actions/diseasesActionCreators";

export interface DiseaseFilterProps {
    options: Option[];
    setCurrentDiseaseId: (diseaseId: string) => void;
}

export const DiseaseFilterComponent: React.SFC<DiseaseFilterProps> = (props: DiseaseFilterProps) => {
    return <div className="control">
        Filter by disease:&nbsp;
        <OptionSelector
            options={ props.options }
            onChange={ (id) => props.setCurrentDiseaseId(id) }
            name={"disease"}
            defaultOption="All"
            required={false}
        />
    </div>;
 }

export const mapDiseaseOptions = (diseases: Disease[], responsibilities: Responsibility[]): Option[] => {
    if (!responsibilities) return null;
    const diseaseIds = [ ...new Set(responsibilities.map(x => x.scenario.disease)) ]
    return  diseaseIds
        .map(id => diseases.find(item => id === item.id))
        .map(disease => ({ value: disease.id, text: disease.name }));
}

export const mapStateToProps = (state: ContribAppState, props: Partial<DiseaseFilterProps>): Partial<DiseaseFilterProps> => {
    return {
        options: mapDiseaseOptions(state.diseases.diseases, state.responsibilities.responsibilitiesSet.responsibilities)
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<DiseaseFilterProps> => {
    return {
        setCurrentDiseaseId: (diseaseId: string) => dispatch(diseasesActionCreators.setCurrentDiseaseId(diseaseId))
    }
};

export const DiseaseFilter = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: DiseaseFilterProps) => (!props.options || props.options.length < 2), renderNothing)
)(DiseaseFilterComponent) as React.ComponentClass<Partial<DiseaseFilterProps>>;
