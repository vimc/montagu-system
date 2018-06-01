import * as React from "react";
import {ErrorInfo} from "../../models/Generated";
import {Alert} from "reactstrap";

export interface ReduxFormValidationErrorProps {
    errors: ErrorInfo[];
}

export const ReduxFormValidationErrors: React.SFC<ReduxFormValidationErrorProps> = (props: ReduxFormValidationErrorProps) => {
    if (props.errors.length > 0) {
        const messages = props.errors.map(e => e.message).join(", ");
        return <Alert color="danger">{messages}</Alert>;
    } else {
        return null;
    }
};
