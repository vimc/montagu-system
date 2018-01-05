import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import { Base64 } from 'js-base64';

interface Props {
    set: ModelRunParameterSet;
}

export class ModelRunParameterDownloadCertificate extends React.Component<Props, undefined> {


    makeSignatureContent(set: ModelRunParameterSet): Array<any> {
        const setData = {
            id: set.id,
            disease: set.disease,
            uploaded_by: set.uploaded_by,
            uploaded_on: set.uploaded_on
        };
        const signature = Base64.encode(JSON.stringify(setData));
        return [setData, { signature }];
    }


    private makeDownloadableSignatureLinkContent(set: ModelRunParameterSet) {
        const signatureData = this.makeSignatureContent(set);
        return "data: text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signatureData, null, 2));
    }

    render(){
        return <a className="float-right submit button"
            href={this.makeDownloadableSignatureLinkContent(this.props.set)}
            download={`cert${this.props.set.id}`}
        >Download parameter certificate</a>
    }

}

