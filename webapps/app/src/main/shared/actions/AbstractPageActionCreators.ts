import {Dispatch} from "redux";
import {breadcrumbsActionCreators} from "./breadcrumbsActionsCreators";
import {PageBreadcrumb} from "../components/PageWithHeader/PageWithHeader";

export abstract class AbstractPageActionCreators<TState, TPageProps> {

    abstract parent: AbstractPageActionCreators<TState, any>;

    onLoad(params?: TPageProps) {
        return async (dispatch: Dispatch<TState>, getState: () => TState) => {
            let parent = this.parent;
            while (parent) {
                await dispatch(parent.loadData(params));
                parent = parent.parent;
            }
            await dispatch(this.loadData(params));

            const myBreadcrumb = this.createBreadcrumb(getState());
            let breadcrumb = myBreadcrumb;
            parent = this.parent;
            while (parent) {
                breadcrumb.parent = parent.createBreadcrumb(getState());
                breadcrumb = breadcrumb.parent;
                parent = parent.parent
            }
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(myBreadcrumb));
        }
    }

    abstract createBreadcrumb(state: TState): PageBreadcrumb

    // Note: this must return an async method
    abstract loadData(params: TPageProps): (dispatch: Dispatch<TState>, getState: () => TState) => void;
}