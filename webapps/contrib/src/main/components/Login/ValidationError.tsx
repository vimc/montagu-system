import * as React from 'react';

const formStyles = require('../../styles/forms.css');

interface Props {
    message: string;
}

export class ValidationError extends React.Component<Props, undefined> {
    render() {
        return <span className={ formStyles.error }>{ this.props.message }</span>;
    }
}
