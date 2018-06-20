import {Dispatch} from "redux";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";

export abstract class AbstractPageActionCreators<TState, TPageProps> {

    onLoad(params?: TPageProps) {
        return async (dispatch: Dispatch<TState>, getState: () => TState) => {
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators
                .createBreadcrumbs(this.createBreadcrumb(getState())));
        }
    }

    abstract createBreadcrumb(state?: TState): PageBreadcrumb

    abstract loadData(params?: TPageProps): (dispatch: Dispatch<TState>, getState: () => TState) => void;
}