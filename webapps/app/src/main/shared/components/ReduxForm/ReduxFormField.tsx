import * as React from "react";
import {InputFieldProps} from "./types";

export const ReduxFormField = (data: InputFieldProps) => {
    const {input, type, label, meta: {touched, error}} = data;
    const errorAlert = touched && error ? <div className="error">{label + error}</div> : null;
    return <div>
        <input {...input} type={type}/>
        {errorAlert}
    </div>;
};