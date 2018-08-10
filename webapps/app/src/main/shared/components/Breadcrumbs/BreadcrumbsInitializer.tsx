import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import {PageProperties} from "../PageWithHeader/PageProperties";
import {breadcrumbsActionCreators} from "../../actions/breadcrumbsActionsCreators";
import {GlobalState} from "../../reducers/GlobalState";
import {PageBreadcrumb} from "../PageWithHeader/PageProperties";

export function BreadcrumbInitializer (
    BreadcrumbInitializerWrapped: ComponentConstructor<any, any>) {
    class BreadcrumbInitializerWrapper extends React.Component {
        render() {
            return <BreadcrumbInitializerWrapped {...this.props}/>;
        }
    }
    const mapDispatchToProps = (dispatch: Dispatch<GlobalState>): Partial<PageProperties<undefined>> => {
        return {
            createBreadcrumbs: (pageBreadcrumb: PageBreadcrumb) => dispatch(breadcrumbsActionCreators.createBreadcrumbs(pageBreadcrumb))
        }
    };
    return connect(state => state, mapDispatchToProps)(BreadcrumbInitializerWrapper);
}