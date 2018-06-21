import {expect} from "chai";
import {Dispatch} from "redux";
import {AbstractPageActionCreators} from "../../../main/shared/actions/AbstractPageActionCreators";
import {PageBreadcrumb} from "../../../main/shared/components/PageWithHeader/PageWithHeader";
import {createMockAdminStore} from "../../mocks/mockStore";
import {mockAdminState} from "../../mocks/mockStates";
import {Sandbox} from "../../Sandbox";
import {BreadcrumbsReceived, BreadcrumbsTypes} from "../../../main/shared/actionTypes/BreadrumbsTypes";
import {Breadcrumb} from "../../../main/shared/models/Breadcrumb";

const dummyAction = {type: "test", data: "testdata"};
const dummyParentAction = {type: "testparent", data: "testdataparent"};

class DummyParentPageActionCreators extends AbstractPageActionCreators<any, any> {

    parent: AbstractPageActionCreators<any, any> = null;

    createBreadcrumb(state: any): PageBreadcrumb {
        return {
            name: "parent",
            urlFragment: "parent/"
        };
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return (dispatch: Dispatch<any>) => dispatch(dummyParentAction);
    }

}

class DummyPageActionCreators extends AbstractPageActionCreators<any, any> {

    parent = new DummyParentPageActionCreators();

    createBreadcrumb(state: any): PageBreadcrumb {
        return {
            name: "child",
            urlFragment: "child/"
        };
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return (dispatch: Dispatch<any>) => dispatch(dummyAction);
    }

}

describe("Abstract page action creators", () => {

    const dummyPage = new DummyPageActionCreators();
    const store = createMockAdminStore(mockAdminState());

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("loads data, parent data, and creates breadcrumbs on onLoad", (done: DoneCallback) => {

        store.dispatch(dummyPage.onLoad());

        const expectedBreadcrumbs: Breadcrumb[] = [{
            name: "parent",
            url: "parent/"
        }, {
            name: "child",
            url: "parent/child/"
        }];

        const expectedBreadcrumbAction: BreadcrumbsReceived = {
            type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED,
            data: expectedBreadcrumbs
        };

        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                dummyParentAction, dummyAction, expectedBreadcrumbAction
            ];

            expect(actions).to.eql(expectedPayload);
            done();
        })

    });
});