import * as React from "react";
import {expect} from "chai";
import "../../helper";
import {
    PageProperties,
} from "../../../main/shared/components/PageWithHeader/PageProperties";
import {Sandbox} from "../../Sandbox";
import {checkAsync} from "../../testHelpers";
import {Page} from "../../../main/shared/components/Page";
import {AbstractPageActionCreators} from "../../../main/shared/actions/AbstractPageActionCreators";
import {Dispatch} from "redux";
import {shallow} from "enzyme";
import {createMockAdminStore} from "../../mocks/mockStore";
import {mockMatch} from "../../mocks/mocks";
import {BreadcrumbsTypes} from "../../../main/shared/actionTypes/BreadrumbsTypes";
import {mockPageBreadcrumb} from "../../mocks/mockModels";
import {PageBreadcrumb} from "../../../main/shared/components/PageWithHeader/PageProperties";
import {AdminAppState} from "../../../main/admin/reducers/adminAppReducers";

class DummyPageComponent extends React.Component<PageProperties<undefined>> {
    render(): JSX.Element {
        return <div>{this.props.title}</div>
    }
}

const fakeAction = {type: "fake-action", data: "fake-data"};
const fakeBreadcrumbs = mockPageBreadcrumb();

class DummyPageActionCreators extends AbstractPageActionCreators<any, any> {

    parent: AbstractPageActionCreators<any, any> = null;

    title(state: AdminAppState) {
        return state.auth.username
    }

    createBreadcrumb(state: any): PageBreadcrumb {
        return fakeBreadcrumbs
    }

    loadData(params: any): (dispatch: Dispatch<any>, getState: () => any) => void {
        return (dispatch: Dispatch<any>) => {
            dispatch(fakeAction)
        }
    }
}

const dummyPageActionCreators = new DummyPageActionCreators();
const DummyPage = Page(dummyPageActionCreators)(DummyPageComponent);

describe('Page HOC', () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("loads on mount", (done: DoneCallback) => {
        const store = createMockAdminStore({auth: {receivedBearerToken: true}});
        shallow(<DummyPage match={mockMatch()}/>, {context: {store}})
            .dive().dive();

        checkAsync(done, () => {
            const actions = store.getActions();

            const expectedActionTypes = [BreadcrumbsTypes.BREADCRUMBS_RECEIVED, fakeAction.type];
            expect(actions.map(a => a.type)).to.have.members(expectedActionTypes);
        });
    });

    it("populates title from state", () => {
        const store = createMockAdminStore({auth: {receivedBearerToken: true, username: "test"}});
        const rendered = shallow(<DummyPage match={mockMatch()}/>, {context: {store}})
            .dive().dive();

        expect(rendered.find("div").text()).to.eq("test")

    });

});
