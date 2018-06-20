import {Dispatch} from "redux";
import {breadcrumbsActionCreators} from "./breadcrumbsActionsCreators";
import {PageBreadcrumb} from "../components/PageWithHeader/PageWithHeader";

export abstract class AbstractPageActionCreators<TState, TPageProps> {

    abstract parent: AbstractPageActionCreators<TState, any>;

    onLoad(params?: TPageProps) {
        return async (dispatch: Dispatch<TState>, getState: () => TState) => {

            const state = getState();
            const breadcrumb = this.createBreadcrumb(state);
            if (this.parent) {
                await dispatch(this.parent.loadData(params));
                breadcrumb.parent = this.parent.createBreadcrumb(state);
            }

            await dispatch(this.loadData(params));

            dispatch(breadcrumbsActionCreators
                .createBreadcrumbs(breadcrumb));
        }
    }

    abstract createBreadcrumb(state: TState): PageBreadcrumb

    // Note: this must return an async method
    abstract loadData(params: TPageProps): (dispatch: Dispatch<TState>, getState: () => TState) => void;
}