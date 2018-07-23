import * as React from "react";
import {ExpectationsDescription} from "./ExpectationsDescription";

interface Props {

}

class ExpectationsListComponent extends React.PureComponent<Props> {
    render(): JSX.Element {
        return <span>{[1,2,3].map(i => <ExpectationsDescription key={i} />)}</span>
    }
}

export const ExpectationsList = ExpectationsListComponent;
