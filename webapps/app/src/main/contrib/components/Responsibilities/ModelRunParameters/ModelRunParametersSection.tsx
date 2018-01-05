import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import {Alert} from 'reactstrap';
import {longestTimestamp} from "../../../../shared/Helpers";
import {Form} from "../../../../shared/components/Form";
import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {ModelRunParameterDownloadCertificate} from "./ModelRunParameterDownloadCertificate";

interface Props {
    url: string;
    disease: string;
    sets: ModelRunParameterSet[];
}

interface State {
    fileInputKey: Date;
}

export class ModelRunParametersSection extends React.Component<Props, State> {

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
        })
    }

    render(): JSX.Element {

        let alertContent = <span>You have not uploaded any parameter sets for {this.props.disease}</span>;

        const hasSets = this.props.sets.length > 0;

        if (hasSets) {
            const lastUploaded = this.props.sets[0];
            const alertText = `You last uploaded a parameter set on 
            ${longestTimestamp(new Date(lastUploaded.uploaded_on))}`;

            const downloadCertificateLink = <ModelRunParameterDownloadCertificate set={lastUploaded}/>;

            // TODO add link when API endpoint implemented
            const downloadParamsLink = <a href="#">View parameter set</a>;

            alertContent = <span>{alertText} {downloadCertificateLink}
            {/*<br/> {downloadParamsLink}*/}
            </span>
        }

        return <div>
            <h2 className="largeSectionTitle mb-0">Disease: {this.props.disease}</h2>
            <hr className="mt-1"/>
            <Alert color="warning">{alertContent}</Alert>
            <h4>Upload a new set of parameters:</h4>
            <Form url={this.props.url} submitText={"Upload"}
                  successMessage={"Success! You have uploaded a new parameter set"}
                  successCallback={this.onSuccess.bind(this)}
                  data={null}>
                <input type={"hidden"} name={"description"} value={""}/>
                <input type={"hidden"} name={"disease"} value={this.props.disease}/>
                <CustomFileInput required={true} key={this.state.fileInputKey.toISOString()}>Choose
                    file</CustomFileInput>
            </Form>
        </div>
    }
}