import * as React from "react";
import {UploadForm} from "../../../../shared/components/UploadForm";

interface ModelRunparametersUploadFormProps {
    groupId: string;
    touchstoneId: string;
    diseases: string[];
    token: string;
}

interface ModelRunParametersUploadFormState {

    diseaseSelected: boolean;
    descriptionSelected: boolean;
}

export class UploadModelRunParametersForm extends React.Component<ModelRunparametersUploadFormProps, ModelRunParametersUploadFormState> {

    constructor() {
        super();
        this.state = {
            diseaseSelected: false,
            descriptionSelected: false
        };
    }

    handleDiseaseChange(e: any) {
        this.setState({
            diseaseSelected: e.target.value.length > 0
        });
    }

    handleDescriptionChange(e: any) {
        this.setState({
            descriptionSelected: e.target.value.length > 1
        });
    }

    render() {

        const uploadText = "Choose a new model run parameter set";
        const diseases = this.props.diseases.map((disease) =>
            <option key={disease} value={disease}>{disease}</option>);

        return <div>
            <UploadForm token={this.props.token} uploadText={uploadText}
                        enableSubmit={this.state.descriptionSelected && this.state.diseaseSelected}>
                <div className="form-group">
                    <select name="disease" className="form-control" onChange={this.handleDiseaseChange.bind(this)}>
                        <option value="">-- Select a disease --</option>
                        {diseases}
                    </select>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="description"
                           onChange={this.handleDescriptionChange.bind(this)}/>
                </div>
            </UploadForm>

        </div>;
    }
}