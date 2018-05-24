import * as React from "react";

import {InputFieldProps} from "../../types";
import {ReduxFormValidationError} from "./ReduxFormValidationError";

export const ReduxFormField = (data: InputFieldProps) => {
    const { input, type, meta: { touched,  error } } = data;
    return <div>
        <input {...input} type={type} />
        <ReduxFormValidationError message={ touched && error ? error : null } />
    </div>;
};