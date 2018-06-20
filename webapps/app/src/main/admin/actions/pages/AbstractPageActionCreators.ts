import {Dispatch} from "redux";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";

export abstract class AbstractPageActionCreators<TState, TPageProps> {

    private parent: AbstractPageActionCreators<TState, any>;

    constructor(parent?: AbstractPageActionCreators<TState, any>){
        this.parent = parent;
    }

    onLoad(params?: TPageProps) {
        return async (dispatch: Dispatch<TState>, getState: () => TState) => {
            if (this.parent) {
                await dispatch(this.parent.loadData(params));
            }
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators
                .createBreadcrumbs(this.createBreadcrumb(getState())));
        }
    }

    abstract createBreadcrumb(state?: TState): PageBreadcrumb

    abstract loadData(params?: TPageProps): (dispatch: Dispatch<TState>, getState: () => TState) => void;
}