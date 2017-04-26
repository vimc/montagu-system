import * as React from 'react';

import { Store } from '../../stores/MainStore';

interface OptionList {
    options: string[];
    onChange: (id: string) => void;
}

export class DiseaseFilter extends React.Component<OptionList, undefined> {
    render() {
        const options = this.props.options.map(x => <option key={ x } value={ x }>{ Store.getDiseaseById(x).name }</option>);
        return <select onChange={ this.onChange }>
            <option key={ null } value="">All</option>
            { options }
        </select>;
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault();
        this.props.onChange(event.currentTarget.value);
    }
}