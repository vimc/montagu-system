import {Dispatch} from "redux";
import {breadcrumbsActionCreators} from "./breadcrumbsActionsCreators";
import {PageBreadcrumb} from "../components/PageWithHeader/PageProperties";

export abstract class AbstractPageActionCreators<TState, TPageProps> {

    abstract parent: AbstractPageActionCreators<TState, any>;

    title(state: TState): string {
        return ""
    };

    onLoad(params?: TPageProps) {
        return async (dispatch: Dispatch<TState>, getState: () => TState) => {
            const ancestors = this.getAncestorsFromOldestToYoungest();
            
            for (let a of ancestors) {
                await dispatch(a.loadData(params));
            }

            let breadcrumb: PageBreadcrumb = null;
            for (let a of ancestors) {
                let parentBreadcrumb = breadcrumb;
                breadcrumb = a.createBreadcrumb(getState());
                breadcrumb.parent = parentBreadcrumb;
            }
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(breadcrumb));
        }
    }

    private getAncestorsFromOldestToYoungest(): Array<AbstractPageActionCreators<any, any>> {
        let ancestors: Array<AbstractPageActionCreators<any, any>> = [];
        let generation: AbstractPageActionCreators<any, any> = this;
        while (generation) {
            ancestors = [generation, ...ancestors];
            generation = generation.parent;
        }
        return ancestors;
    }

    abstract createBreadcrumb(state: TState): PageBreadcrumb

    // Note: this must return an async method
    abstract loadData(params: TPageProps): (dispatch: Dispatch<TState>, getState: () => TState) => void;
}