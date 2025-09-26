import * as React from "react";
import {ErrorInfo} from "../../models/Generated";

export interface ReduxFormValidationErrorProps {
    errors: ErrorInfo[];
}

export const ReduxFormValidationErrors: React.FunctionComponent<ReduxFormValidationErrorProps> = (props: ReduxFormValidationErrorProps) => {
    if (props.errors.length > 0) {
        const messages = props.errors.map(e => e.message).join(", ");
        return <div className="error">{messages}</div>;
    } else {
        return null;
    }
};
