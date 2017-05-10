import { Reform, ReformProps } from "alt-reform";

type ErrorMap = { [index: string]: string };

function blankErrorMap<T>(fields: any) {
    const errors: ErrorMap = {};
    Object.keys(fields).forEach((f: string) => errors[ f ] = null);
    return errors;
}

// This is just replicating a part of the behaviour of alt-reform's FormConnector
export function mockFormProperties<T>(form: Reform<T>, errors?: ErrorMap): ReformProps {
    const fields: any = form.fields();
    errors = Object.assign(blankErrorMap(fields), errors);

    return {
        store: form.store,

        submit: form.submit,
        cancel: form.cancel,
        validate: form.validate,
        normalize: form.normalize,
        change: form.change,

        fields: fields,
        errors: errors,
        touched: [],
        loading: false
    };
}

export const numberOfSubmissionActions = 6;