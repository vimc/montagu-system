import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import {PageBreadcrumb, PageProperties} from "../PageWithHeader/PageWithHeader";
import {breadcrumbsActions} from "../../actions/breadcrumbsActions";
import {GlobalState} from "../../reducers/GlobalState";

export function BreadcrumbInitializer (
    BreadcrumbInitializerWrapped: ComponentConstructor<any, any>) {
    class BreadcrumbInitializerWrapper extends React.Component {
        render() {
            return <BreadcrumbInitializerWrapped {...this.props}/>;
        }
    }
    const mapDispatchToProps = (dispatch: Dispatch<GlobalState>): Partial<PageProperties<undefined>> => {
        return {
            createBreadcrumbs: (pageBreadcrumb: PageBreadcrumb) => dispatch(breadcrumbsActions.createBreadcrumbs(pageBreadcrumb))
        }
    };
    return connect(state => state, mapDispatchToProps)(BreadcrumbInitializerWrapper);
};