import * as React from "react"

import {ContribAppState} from "./reducers/contribAppReducers";
import {AbstractPageActionCreators} from "../shared/actions/AbstractPageActionCreators";
import {Page} from "../shared/components/Page";


export function ContribPage<TLocationProps>(pageActionCreators: AbstractPageActionCreators<ContribAppState, TLocationProps>) {
    return Page<ContribAppState, TLocationProps>(pageActionCreators)
}
