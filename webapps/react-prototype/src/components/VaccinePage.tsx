import * as React from "react";
import * as VaccineStore from '../stores/VaccineStore'
import VaccineActions from '../actions/VaccineActions'


class VaccineList extends React.Component<undefined, VaccineStore.State> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = VaccineStore.Store.getState();
    }

    componentDidMount = () => {
        VaccineStore.Store.listen(this.onChange);        
        VaccineActions.fetchVaccines();
    }

    componentWillUnmount = () => {
        VaccineStore.Store.unlisten(this.onChange);
    }

    onChange = (state: VaccineStore.State) => {
        this.setState(state);
    }

    render() { 
        if (this.state.errorMessage) {
            return <div>Something is wrong</div>
        }
        if (!this.state.vaccines.length) {
            return <div><img src="/spinner.gif" /></div>
        }

        let vaccines = this.state.vaccines.map((vaccine, i) => {
            return <li key={ vaccine.id }>{ vaccine.name }</li>
        });
        return <ul>{vaccines}</ul>
    }
}

class NewVaccine extends React.Component<undefined, VaccineStore.Vaccine> {
    constructor() {
        super();
        this.state = {
            id: "",
            name: ""
        };
    }

    handleIdChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ id: event.currentTarget.value });
    }
    handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ name: event.currentTarget.value });
    }
    createVaccine = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        VaccineActions.addVaccine(this.state);
    }

    render() {
        return <form onSubmit={ this.createVaccine }>
            <input name="id" value={ this.state.id } onChange={ this.handleIdChange } />
            <input name="name" value={ this.state.name } onChange={ this.handleNameChange } />
            <button type="submit">Add</button>
        </form>
    }
}

export default class VaccinePage extends React.Component<undefined, undefined> {
    render() {       
        return <div>
            <h1>Vaccines</h1>
            <VaccineList />
            <NewVaccine />
        </div>
    }
}