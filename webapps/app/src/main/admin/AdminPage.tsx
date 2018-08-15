import * as React from "react"

import {AbstractPageActionCreators} from "../shared/actions/AbstractPageActionCreators";
import {Page} from "../shared/components/Page";
import {AdminAppState} from "./reducers/adminAppReducers";

export function AdminPage<TLocationProps>(pageActionCreators: AbstractPageActionCreators<AdminAppState, TLocationProps>) {
    return Page<AdminAppState, TLocationProps>(pageActionCreators)
}
