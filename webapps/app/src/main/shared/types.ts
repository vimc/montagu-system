import {BaseFieldProps, WrappedFieldProps} from "redux-form";
import {InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes} from "react";

export type InputFieldProps = WrappedFieldProps & BaseFieldProps<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>
export type SelectFieldProps = WrappedFieldProps & BaseFieldProps<HTMLSelectElement> & SelectHTMLAttributes<HTMLSelectElement>
export type TextAreaFieldProps = WrappedFieldProps & BaseFieldProps<HTMLTextAreaElement> & TextareaHTMLAttributes<HTMLTextAreaElement>