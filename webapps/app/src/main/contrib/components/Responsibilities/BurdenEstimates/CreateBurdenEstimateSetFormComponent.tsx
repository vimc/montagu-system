import * as React from "react";
import {FormConnector, ReformProps} from "alt-reform";
import {Alert} from "../../../../shared/components/Alert";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";

export class CreateBurdenEstimateSetFormComponent extends React.Component<ReformProps, undefined> {

    render() {

        const disabled = this.props.loading;
        const hasError = this.props.store.getState().submitError != null;

        return <form onSubmit={this.props.submit}>
            <div className="form-group">
                <select className={`form-control ${this.props.errors.type ? "has-error" : ""}`} name="type">
                    <option>
                    </option>
                </select>
            </div>
            <div className="form-group">
                <select className={`form-control ${this.props.errors.parameterSetId ? "has-error" : ""}`}
                        name="parameter-set">
                    <option>

                    </option>
                </select>
            </div>
            <Alert hasSuccess={!hasError} hasError={hasError}
                   message={hasError ? this.props.store.errorMessage : this.props.store.successMessage}/>
            <button type="submit"
                    disabled={disabled}>Create
            </button>
        </form>;
    }
}

export const WrappedCreateBurdenEstimateSetForm = FormConnector(CreateBurdenEstimateSetForm)(CreateBurdenEstimateSetFormComponent);