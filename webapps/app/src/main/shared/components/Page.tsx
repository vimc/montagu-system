import * as React from "react"
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {compose} from "recompose";
import withLifecycle, {LifecycleMethods} from "@hocs/with-lifecycle";
import {AbstractPageActionCreators} from "../actions/AbstractPageActionCreators";
import {PageProperties} from "./PageWithHeader/PageProperties";

export function Page<TState, TLocationProps>(pageActionCreators: AbstractPageActionCreators<TState, TLocationProps>) {

    const pac = pageActionCreators;

    const mapDispatchToProps = (dispatch: Dispatch<TState>): Partial<PageProperties<TLocationProps>> => {
        return {
            onLoad: (params: TLocationProps) => dispatch(pac.onLoad(params))
        }
    };

    const mapStateToProps = (state: TState): Partial<PageProperties<TLocationProps>> => {
        return {
            title: pac.title(state)
        }
    };

    const lifecycleMethods: Partial<LifecycleMethods<PageProperties<TLocationProps>>> = {
        onWillMount(props: PageProperties<TLocationProps>) {
            props.onLoad(props.match.params)
        }
    };

    return compose<PageProperties<TLocationProps>, Partial<PageProperties<TLocationProps>>>(
        connect(mapStateToProps, mapDispatchToProps),
        withLifecycle(lifecycleMethods));
}