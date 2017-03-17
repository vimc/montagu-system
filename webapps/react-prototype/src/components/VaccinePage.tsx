import * as React from "react";
import * as VaccineStore from '../stores/VaccineStore'
import VaccineActions from '../actions/VaccineActions'
import { connectToStores } from '../alt'

class VaccineList extends React.Component<VaccineStore.State, undefined> {
    static getStores(props: VaccineStore.State) {
        VaccineActions.fetchVaccines();
        return [ VaccineStore.Store ];
    }
    static getPropsFromStores(props: VaccineStore.State): VaccineStore.State {
        return VaccineStore.Store.getState();
    }

    render() { 
        if (this.props.errorMessage) {
            return <div>Something is wrong</div>
        }
        if (!this.props.vaccines.length) {
            return <div><img src="/spinner.gif" /></div>
        }

        let vaccines = this.props.vaccines.map((vaccine, i) => {
            return <li key={ vaccine.id }>{ vaccine.name } ({ vaccine.id })</li>
        });
        return <ul>{vaccines}</ul>
    }
}
const VaccineListWithStores = connectToStores(VaccineList);

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
        this.setState({ id: "", name: "" })
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
            <VaccineListWithStores />
            <NewVaccine />
        </div>
    }
}