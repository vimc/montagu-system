import {expect} from "chai";
import {Dispatch} from "redux";
import {AbstractPageActionCreators} from "../../../main/shared/actions/AbstractPageActionCreators";
import {PageBreadcrumb} from "../../../main/shared/components/PageWithHeader/PageProperties";
import {createMockAdminStore} from "../../mocks/mockStore";
import {mockAdminState} from "../../mocks/mockStates";
import {Sandbox} from "../../Sandbox";
import {BreadcrumbsReceived, BreadcrumbsTypes} from "../../../main/shared/actionTypes/BreadrumbsTypes";
import {Breadcrumb} from "../../../main/shared/models/Breadcrumb";

let fakeGlobalState = 0;
const dummyAction = {type: "test", data: "testdata"};
const dummyParentAction = {type: "testparent", data: "testdataparent"};
const dummyGrandparentAction = {type: "testgrandparent", data: "testdatagrandparent"};

class DummyGrandparentPageActionCreators extends AbstractPageActionCreators<any, any> {
    parent: AbstractPageActionCreators<any, any> = null;

    createBreadcrumb(state: any): PageBreadcrumb {
        return {
            name: "grandparent" + fakeGlobalState.toString(),
            urlFragment: "grandparent/"
        };
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return (dispatch: Dispatch<any>) => {
            dispatch(dummyGrandparentAction);
            fakeGlobalState += 1;
        }
    }
}

class DummyParentPageActionCreators extends AbstractPageActionCreators<any, any> {

    parent = new DummyGrandparentPageActionCreators();

    createBreadcrumb(state: any): PageBreadcrumb {
        return {
            name: "parent" + fakeGlobalState.toString(),
            urlFragment: "parent/"
        };
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return (dispatch: Dispatch<any>) => {
            dispatch(dummyParentAction);
            fakeGlobalState += 1;
        }
    }

}

class DummyPageActionCreators extends AbstractPageActionCreators<any, any> {

    parent = new DummyParentPageActionCreators();

    createBreadcrumb(state: any): PageBreadcrumb {
        return {
            name: "child" + fakeGlobalState.toString(),
            urlFragment: "child/"
        };
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return (dispatch: Dispatch<any>) => {
            dispatch(dummyAction);
            fakeGlobalState += 1;
        }
    }

}

describe("Abstract page action creators", () => {

    const dummyPage = new DummyPageActionCreators();
    const store = createMockAdminStore(mockAdminState());

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test(
        "loads data, parent data, and creates breadcrumbs on onLoad",
        (done: DoneCallback) => {

            store.dispatch(dummyPage.onLoad());

            const expectedBreadcrumbs: Breadcrumb[] = [
                {
                    name: "grandparent3",
                    url: "grandparent/"
                },
                {
                    name: "parent3",
                    url: "grandparent/parent/"
                }, {
                    name: "child3",
                    url: "grandparent/parent/child/"
                }
            ];

            const expectedBreadcrumbAction: BreadcrumbsReceived = {
                type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED,
                data: expectedBreadcrumbs
            };

            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = [
                    dummyGrandparentAction, dummyParentAction, dummyAction, expectedBreadcrumbAction
                ];

                expect(actions).to.eql(expectedPayload);
                done();
            })

        }
    );
});