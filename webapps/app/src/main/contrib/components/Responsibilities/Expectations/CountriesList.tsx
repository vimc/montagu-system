import {Country} from "../../../../shared/models/Generated";
import * as React from "react";
import {Popover, PopoverBody} from "reactstrap";

interface State {
    showCountries: boolean;
}

interface Props {
    countries: Country[]
    targetKey: string;
}

export class CountriesList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            showCountries: false
        };
    }

    toggle(e?: any) {
        e && e.preventDefault();

        this.setState({
            showCountries: !this.state.showCountries
        });
    }

    render() {
        const countriesList = this.props.countries.map(c => c.name).sort().join(", ");

        return <span><a href="" id={this.props.targetKey}
                        onClick={this.toggle}>view list</a>
            <Popover placement="right" isOpen={this.state.showCountries} target={this.props.targetKey}
                     toggle={this.toggle}>
                <PopoverBody>{countriesList}</PopoverBody>
            </Popover></span>
    }
}