import * as React from "react";

interface State {
    fileName: string;
    fileSelected: boolean;
}

interface Props {
    required: boolean;
}

export class CustomFileInput extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            fileSelected: false,
            fileName: ""
        }
    }

    handleChange(e: React.MouseEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement;
        this.setState({
            fileName: target.value.replace("C:\\fakepath\\", ""),
            fileSelected: typeof target.value != "undefined"
        });
    }

    render() {

        return <div className="form-group mb-0"><label className="customFileUpload">
            <input name="file"
                   type="file" className="form-control" onChange={this.handleChange.bind(this)} required={this.props.required}/>
            <div className="button mt-2">
                {this.props.children}
            </div>
            <div className="invalid-feedback">
                You must choose a file
            </div>
            <div
                className="mr-5">{this.state.fileSelected ? "File selected: " + this.state.fileName : ""}</div>
        </label>
        </div>
    }
}