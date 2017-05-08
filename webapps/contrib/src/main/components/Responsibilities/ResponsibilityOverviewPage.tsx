import * as React from "react";
import { Link, Location } from 'simple-react-router';
import {PageProperties, PageWithHeader} from '../PageWithHeader/PageWithHeader';
import { ResponsibilityList } from './ResponsibilityList'
import * as TouchstoneStore from '../../stores/TouchstoneStore';
import { Touchstone } from '../../Models'
import { responsibilityActions } from '../../actions/ResponsibilityActions';
import {isUndefined} from "util";

const headerStyles = require("../PageWithHeader/PageWithHeader.css");

interface LocationProps {
    touchstoneId: string;
}

export class ResponsibilityOverviewPage
    extends PageWithHeader<LocationProps, PageProperties<LocationProps>, TouchstoneStore.State> {
    state: TouchstoneStore.State = TouchstoneStore.Store.getState();

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        TouchstoneStore.Store.listen(this.onChange);
    }

    componentWillUnmount() {
        TouchstoneStore.Store.unlisten(this.onChange);
    }

    onChange = (state: TouchstoneStore.State) => {
        this.setState(state);        
    };

    touchstone(): Touchstone {
        const touchstone = this.state.touchstones.find((x) => x.id == this.props.location.params.touchstoneId);
        if (isUndefined(touchstone)) {
            return {
                id: "",
                name: "",
                version: 0,
                description: "",
                status: null,
                years: null
            };
        } else {
            return touchstone;
        }
    }

    title() {
        return <span>
            Responsibilities in { this.touchstone().description }
            <span className={ headerStyles.titleAddition }>
                <Link href="/">Change touchstone</Link>
            </span>
        </span>;
    }
    renderPageContent() {
        return <div>          
            On this page you can:
            <ol>
                <li>See an overview of which scenarios your group are responsible for providing impact estimates for. If we have the wrong scenarios listed, please contact us here.</li>
                <li>Download demographic data which applies to all scenarios</li>
                <li>Download coverage data for each scenario</li>
                <li>Upload impact estimates for each scenario, and review any problems the system has detected in the uploaded data.</li>
                <li>Track progress towards providing impact estimates for all your scenarios</li>
            </ol>
            <ResponsibilityList />
        </div>
    }
}