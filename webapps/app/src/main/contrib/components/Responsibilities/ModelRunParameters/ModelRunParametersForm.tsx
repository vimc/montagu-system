import * as React from "react";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";

import {Form} from "../../../../shared/components/Form";
import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {runParametersActionCreators} from "../../../actions/runParametersActionCreators";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {ModellingGroup, Touchstone} from "../../../../shared/models/Generated";

export interface ModelRunParametersFormProps {
    url: string;
    disease: string;
    getParameterSets: (groupId: string, touchstoneId: string) => void;
    group: ModellingGroup;
    touchstone: Touchstone;
}

export interface ModelRunParametersFormState {
    fileInputKey: Date;
}

export class ModelRunParametersFormComponent extends React.Component<ModelRunParametersFormProps, ModelRunParametersFormState> {

    constructor() {
        super();
        this.state = {
            fileInputKey: new Date()
        }
        this.onSuccess = this.onSuccess.bind(this);
    }

    onSuccess() {
        this.setState({
            // this is to trick React into re-rendering the file input when the form has been successfully submitted
            // see https://github.com/erikras/redux-form/issues/769
            fileInputKey: new Date()
        });

        this.props.getParameterSets(this.props.group.id, this.props.touchstone.id);
    }

    render(): JSX.Element {
        return <div>
            <h4>Upload a new set of parameters:</h4>
            <Form url={this.props.url} submitText={"Upload"}
                  successMessage={"Success! You have uploaded a new parameter set"}
                  successCallback={this.onSuccess}
                  data={null}>
                <input type={"hidden"} name={"disease"} value={this.props.disease}/>
                <CustomFileInput required={true} key={this.state.fileInputKey.toISOString()}>Choose
                    file</CustomFileInput>
            </Form>
        </div>
    }
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ModelRunParametersFormProps>): Partial<ModelRunParametersFormProps> => {
    return {
        url: props.url,
        disease: props.disease,
        group: state.groups.currentUserGroup,
        touchstone: state.touchstones.currentTouchstone
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ModelRunParametersFormProps> => {
    return {
        getParameterSets: (groupId: string, touchstoneId: string) => {
            console.log('will reload set on upl', groupId, touchstoneId)
            dispatch(runParametersActionCreators.clearCacheForGetParameterSets(groupId, touchstoneId))
            dispatch(runParametersActionCreators.getParameterSets(groupId, touchstoneId))
        }
    }
};

export const ModelRunParametersForm = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModelRunParametersFormComponent) as React.ComponentClass<Partial<ModelRunParametersFormProps>>;
