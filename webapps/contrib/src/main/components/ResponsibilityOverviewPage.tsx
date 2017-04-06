import * as React from "react";
import { Link, Location } from 'simple-react-router';
import { PageWithHeader } from './PageWithHeader';
import * as Responsibilities from '../stores/ResponsibilityStore';
import * as Touchstones from '../stores/TouchstoneStore';
import { connectToStores } from '../alt';
import { responsibilityActions } from '../actions/ResponsibilityActions';

const styles = require("../styles/responsibilities.css");
const spinner = require("../resources/spinner.gif");
const headerStyles = require("../styles/header.css");

class ResponsibilityList extends React.Component<Responsibilities.State, undefined> {
	static getStores() {
		return [ Responsibilities.Store ];
	}
	static getPropsFromStores() {
		return Responsibilities.Store.getState();
	}

    render() {
    	const store = this.props;
        if (store.responsibilitySet) {
            const set: Responsibilities.ResponsibilitySet = store.responsibilitySet;
            if (set.responsibilities.length) {
                const items = set.responsibilities.map((item: Responsibilities.Responsibility) => 
                    <li className={ styles.scenario } key={ item.scenario.id }>
                        <div className={ styles.header }>
                            <span className={ styles.name }>{ item.scenario.description }</span>
                            &nbsp;
                            (ID: { item.scenario.id })
                            <span className={ styles.status }>{ item.status }</span>
                        </div>
                        <div>
                            <div className={ styles.content }>
                                <div className={ styles.actions }>
                                    <button>Download input data</button>
                                    <button>Upload a new burden estimate set</button>
                                </div>
                                <div className={ styles.estimates }>
                                    You have not uploaded any burden estimate sets.
                                </div>
                            </div>
                        </div>
                    </li>
                );

                return <div>
                    <ul className={ styles.responsibilities }>{ items }</ul>
                </div>
            } else {
                return <div className={ styles.message }>This modelling group has no responsibilities in the current touchstone</div>                
            }
        } else if (store.errorMessage) {
            return <div className={ styles.errorMessage }>An error occured: { store.errorMessage }</div>
        } else {
            return <img src={ spinner } />
        }
    }
}
const ResponsibilityList_Connected = connectToStores(ResponsibilityList);

interface ResponsibilityOverviewPageProps {
	touchstoneId: string;
}

export class ResponsibilityOverviewPage extends PageWithHeader<ResponsibilityOverviewPageProps, Touchstones.State> {
	state: Touchstones.State = Touchstones.Store.getState();

	componentDidMount() {
		Touchstones.Store.listen(this.onChange);
		responsibilityActions.setTouchstone(this.touchstone());
	}

	componentWillUnmount() {
		Touchstones.Store.unlisten(this.onChange);
	}

	onChange(state: Touchstones.State) {
		this.setState(state);		
	}

	touchstone(): Touchstones.Touchstone {
		return this.state.touchstones.find((x) => x.id == this.props.location.params.touchstoneId);
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
	        <ResponsibilityList_Connected />
	    </div>
    }
}