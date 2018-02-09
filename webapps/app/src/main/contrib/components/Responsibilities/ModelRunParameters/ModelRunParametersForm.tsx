import * as React from "react";
import {doNothing} from "../../../../shared/Helpers";
import {Form} from "../../../../shared/components/Form";
import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {runParametersStore} from "../../../stores/RunParametersStore";

interface Props {
    url: string;
    disease: string;
}

interface State {
    fileInputKey: Date;
}

export class ModelRunParametersForm extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            fileInputKey: new Date()
        }
    }

    onSuccess() {
        this.setState({
            // this is to trick React into re-rendering the file input when the form has been successfully submitted
            // see https://github.com/erikras/redux-form/issues/769
            fileInputKey: new Date()
        });

        runParametersStore.fetchParameterSets(true).catch(doNothing);
    }

    render(): JSX.Element {

        return <div>
            <h4>Upload a new set of parameters:</h4>
            <Form url={this.props.url} submitText={"Upload"}
                  successMessage={"Success! You have uploaded a new parameter set"}
                  successCallback={this.onSuccess.bind(this)}
                  data={null}>
                <input type={"hidden"} name={"disease"} value={this.props.disease}/>
                <CustomFileInput required={true} key={this.state.fileInputKey.toISOString()}>Choose
                    file</CustomFileInput>
            </Form>
        </div>
    }
}