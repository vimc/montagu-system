import * as React from "react";

export interface ReduxFormValidationErrorProps {
    message: string;
}

export const ReduxFormValidationError: React.SFC<ReduxFormValidationErrorProps> = (props: ReduxFormValidationErrorProps) => {
    if (typeof props.message === "string") {
        return <div className="alert alert-danger">{ props.message }</div>;
    } else {
        return null;
    }
}
