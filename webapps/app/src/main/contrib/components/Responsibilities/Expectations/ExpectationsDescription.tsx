import * as React from "react";

interface Props {

}

export class ExpectationsDescription extends React.PureComponent<Props> {
    render(): JSX.Element {
        return <div className="mt-3 mb-5 p-3 border">
            <div className="h3">Template for menA-no-vacc, menA-without, menA-with</div>
            <div>
                You need to do the following:
                <ul>
                    <li>These years</li>
                    <li>These ages</li>
                </ul>
            </div>
            <div>
                <button>Download template</button>
            </div>
        </div>
    }
}
