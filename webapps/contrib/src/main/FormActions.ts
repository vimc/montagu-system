import { generateActions } from 'create-actions';

export default (namespace: string) => {
    return generateActions(namespace, [
        'saved', 'canceled', 'changed',
        'validationStarted', 'validationFailed',
        'focused', 'blurred', 'normalized',
        'submitSuccess', 'submitFailed', 'startLoading',
        'endLoading'
    ])
}