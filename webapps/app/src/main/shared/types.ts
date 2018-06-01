import {WrappedFieldProps} from "redux-form";
import {InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes} from "react";

export type InputFieldProps = WrappedFieldProps & InputHTMLAttributes<HTMLInputElement>
export type SelectFieldProps = WrappedFieldProps & SelectHTMLAttributes<HTMLSelectElement>
export type TextAreaFieldProps = WrappedFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>