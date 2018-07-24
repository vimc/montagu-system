import * as React from "react"
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {compose} from "recompose";
import withLifecycle, {LifecycleMethods} from "@hocs/with-lifecycle";
import {AbstractPageActionCreators} from "../actions/AbstractPageActionCreators";
import {PageProperties} from "./PageWithHeader/PageWithHeader";

export function Page<TState, TLocationProps>(pageActionCreators: AbstractPageActionCreators<TState, TLocationProps>) {

    const mapDispatchToProps = (dispatch: Dispatch<TState>): Partial<PageProperties<TLocationProps>> => {
        return {
            onLoad: (params: TLocationProps) => dispatch(pageActionCreators.onLoad(params))
        }
    };

    const lifecycleMethods: Partial<LifecycleMethods<PageProperties<TLocationProps>>> = {
        onWillMount(props: PageProperties<TLocationProps>) {
            props.onLoad(props.match.params)
        }
    };

    return compose<PageProperties<TLocationProps>, Partial<PageProperties<TLocationProps>>>(
        connect((state: TState, props: TLocationProps) => props, mapDispatchToProps),
        withLifecycle(lifecycleMethods));
}