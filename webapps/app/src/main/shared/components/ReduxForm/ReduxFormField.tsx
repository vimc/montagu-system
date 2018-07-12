import * as React from "react";
import {InputFieldProps, TextAreaFieldProps} from "./types";

export const ReduxFormInput = (data: InputFieldProps) => {
    const {input, type, label, meta: {touched, error}} = data;
    const errorAlert = touched && error ? <div className="error">{label + error}</div> : null;
    return <div>
        <input {...input} type={type}/>
        {errorAlert}
    </div>;
};

export const ReduxFormTextArea = (data: TextAreaFieldProps) => {
    const {cols, rows, input, label, meta: {touched, error}} = data;
    const errorAlert = touched && error ? <div className="error">{label + error}</div> : null;
    return <div>
        <textarea cols={cols} rows={rows} {...input}/>
        {errorAlert}
    </div>;
};