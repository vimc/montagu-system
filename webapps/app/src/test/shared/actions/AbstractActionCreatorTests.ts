import { expect } from "chai";
import {Dispatch} from "redux";
import {AbstractPageActionCreators} from "../../../main/shared/actions/AbstractPageActionCreators";
import {PageBreadcrumb} from "../../../main/shared/components/PageWithHeader/PageWithHeader";

class DummyParentPageActionCreators extends AbstractPageActionCreators<any, any>{

    parent = null;

    createBreadcrumb(state: any): PageBreadcrumb {
        return {
            name: "parent",
            urlFragment : "parent/"
        };
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return undefined;
    }

}

class DummyPageActionCreators extends AbstractPageActionCreators<any, any>{

    parent = new DummyParentPageActionCreators();

    createBreadcrumb(state: any): PageBreadcrumb {
        return {
            name: "child",
            urlFragment: "child/"
        };
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return undefined;
    }

}

describe("Abstract page action creators", () => {

    const dummyPage = new DummyPageActionCreators();
    const dummyParent = new DummyParentPageActionCreators();

    it("loads data and creates breadcrumbs on onLoad", () => {

    });
});