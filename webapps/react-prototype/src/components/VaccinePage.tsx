import * as React from "react";
import { State, Vaccine, Store } from '../stores/VaccineStore'
import VaccineActions from '../actions/VaccineActions'
import { connectToStores } from '../alt'

interface VaccineListProps {
    vaccines: Array<Vaccine>;
    errorMessage: String;
}

class VaccineList extends React.Component<VaccineListProps, undefined> {
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

interface NewVaccineProps {
    vaccine: Vaccine;
}

class NewVaccine extends React.Component<NewVaccineProps, undefined> {
    handleIdChange = (event: React.FormEvent<HTMLInputElement>) => {
        VaccineActions.modifyNewVaccine({ id: event.currentTarget.value });
    }
    handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        VaccineActions.modifyNewVaccine({ name: event.currentTarget.value });
    }
    createVaccine = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        VaccineActions.addNewVaccine();
    }

    render() {
        return <form onSubmit={ this.createVaccine }>
            <input name="id" value={ this.props.vaccine.id } onChange={ this.handleIdChange } />
            <input name="name" value={ this.props.vaccine.name } onChange={ this.handleNameChange } />
            <button type="submit">Add</button>
        </form>
    }
}

class VaccineEditor extends React.Component<State, undefined> {
    static getStores(props: State) {
        VaccineActions.fetchVaccines();
        return [ Store ];
    }
    static getPropsFromStores(props: State): State {
        return Store.getState();
    }

    render() {       
        return <div>
            <h1>Vaccines</h1>
            <VaccineList vaccines={ this.props.vaccines } errorMessage={ this.props.errorMessage } />
            <NewVaccine vaccine={ this.props.newVaccine } />
        </div>
    }
}
const VaccineEditor_Connected = connectToStores(VaccineEditor);

export default class VaccinePage extends React.Component<undefined, undefined> {
    render() {
        return <VaccineEditor_Connected />;
    }
}