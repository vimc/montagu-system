import {Dispatch} from "redux";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";

export abstract class AbstractPageActionCreators<TState, TPageProps> {

    private breadcrumbCreator: (state?: TState) => PageBreadcrumb;

    constructor(breadcrumbCreator: (state?: TState) => PageBreadcrumb) {
        this.breadcrumbCreator = breadcrumbCreator;
    }

    onLoad(params?: TPageProps) {
        return async (dispatch: Dispatch<TState>, getState: () => TState) => {
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators
                .createBreadcrumbs(this.breadcrumbCreator(getState())));
        }
    }

    abstract loadData(params?: TPageProps): (dispatch: Dispatch<TState>, getState: () => TState) => void;
}