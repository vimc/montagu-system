import * as React from "react";
import {shallow} from "enzyme";


import {ErrorLog, ErrorLogComponent, mapStateToProps} from "../../../main/shared/components/ErrorLog/ErrorLog";
import {Sandbox} from "../../Sandbox";
import {createMockAdminStore} from "../../mocks/mockStore";
import {mockAdminState} from "../../mocks/mockStates";
import {NotificationState} from "../../../main/shared/reducers/notificationReducer";
import {notificationActionCreators} from "../../../main/shared/actions/notificationActionCreators";

describe("ErrorLog", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    function clear() {
    }

    it("is hidden when there are no errors", () => {
        const rendered = shallow(<ErrorLogComponent errors={[]} clear={clear}/>);
        expect(rendered.text()).toBe("");
    });

    it("it renders each error", () => {
        const errors = ["a", "b"];
        const rendered = shallow(<ErrorLogComponent errors={errors} clear={clear}/>);
        const items = rendered.find("li");
        expect(items).toHaveLength(2);
        expect(items.at(0).text()).toEqual("a");
        expect(items.at(1).text()).toEqual("b");
    });

    it("clicking clear button emits clear event", () => {
        const stub = sandbox.setStubReduxAction(notificationActionCreators, "clear");
        const notificationState: Partial<NotificationState> = {errors: ["a", "b"]};
        const store = createMockAdminStore(mockAdminState({notifications: notificationState}));
        const rendered = shallow(<ErrorLog/>, {context: {store}}).dive();
        rendered.find("button").simulate("click");
        expect(stub.mock.calls[0]).toEqual(["error"]);
    });

    it("maps state to props", () => {
        const notificationState: Partial<NotificationState> = {errors: ["a", "b"]};
        const props = mapStateToProps(mockAdminState({notifications: notificationState}));
        expect(props).toEqual({errors: ["a", "b"]});
    });
});
