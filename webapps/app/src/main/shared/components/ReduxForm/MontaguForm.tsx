import * as React from "react";
import {change} from "redux-form";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {ReduxFormProps} from "./types";
import {ErrorInfo} from "../../models/APITypes";

interface FormConfig<TState, TProps> {
    form: string,
    mapErrorsFromState: (state: TState) => ErrorInfo[],
    submit: (props: TProps) => any
}

export function montaguForm<TState, TProps> (config: FormConfig<TState, TProps>){

    function mapStateToProps(state: TState): Partial<ReduxFormProps<TProps>> {
        return {
            errors: config.mapErrorsFromState(state)
        }
    }

    function mapDispatchToProps(dispatch: Dispatch<any>): Partial<ReduxFormProps<TProps>> {
        return {
            submit: (newObject: TProps) => dispatch(config.submit(newObject)),
            changeFieldValue: (field: string, value: string) => {
                dispatch(change(config.form, field, value))
            }
        }
    }
    return connect(mapStateToProps, mapDispatchToProps);
}