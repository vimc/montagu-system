import {WrappedFieldProps} from "redux-form";
import {FormEvent, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes} from "react";
import {ErrorInfo} from "../../models/Generated";

export type InputFieldProps = WrappedFieldProps & InputHTMLAttributes<HTMLInputElement>
export type SelectFieldProps = WrappedFieldProps & SelectHTMLAttributes<HTMLSelectElement>
export type TextAreaFieldProps = WrappedFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export interface ReduxFormProps<TFieldProps> {
    // https://redux-form.com/7.3.0/docs/api/props.md/#-code-handlesubmit-eventorsubmit-function-code-
    // this function is added by redux form. it takes a function with the form values as arguments and
    // returns a function that can be used as an 'onSubmit' handler
    handleSubmit: (submitFunction: (values: TFieldProps) => void)
        => (event: FormEvent<HTMLFormElement>) => void,
    submit: (values: TFieldProps) => void,
    errors: ErrorInfo[]
    changeFieldValue: (field: string, value: string) => void
}