import * as React from "react";
import {settings} from "../../../../shared/Settings";

export class ConfidentialityAgreement extends React.Component<string, undefined> {
    render(): JSX.Element {
        if (settings.isApplicantTouchstone(this.props)) {
            return <div className={"row"}>
                <div className={"col-12 col-md-6 offset-md-3"}>
                    <div className={"border p-3 border-dark"}>
                        I have read and understood the RfP applicants' confidentiality agreement in full. This explains
                        in
                        details that vaccine coverage data for future years which is provided via Montagu is
                        confidential
                        and
                        must not be shared outside RfP applicants' specific modelling group.
                        <input type={"checkbox"}/>
                    </div>
                </div>
            </div>
        }
    }
}