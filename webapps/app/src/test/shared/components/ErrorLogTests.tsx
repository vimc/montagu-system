import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";

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
        expect(rendered.text()).to.be.empty;
    });

    it("it renders each error", () => {
        const errors = ["a", "b"];
        const rendered = shallow(<ErrorLogComponent errors={errors} clear={clear}/>);
        const items = rendered.find("li");
        expect(items).to.have.length(2);
        expect(items.at(0).text()).to.equal("a");
        expect(items.at(1).text()).to.equal("b");
    });

    it("clicking clear button emits clear event", () => {
        const stub = sandbox.setStubReduxAction(notificationActionCreators, "clear");
        const notificationState: Partial<NotificationState> = {errors: ["a", "b"]};
        const store = createMockAdminStore(mockAdminState({notifications: notificationState}));
        const rendered = shallow(<ErrorLog/>, {context: {store}}).dive();
        rendered.find("button").simulate("click");
        expect(stub.getCall(0).args).to.eql(["error"]);
    });

    it("maps state to props", () => {
        const notificationState: Partial<NotificationState> = {errors: ["a", "b"]};
        const props = mapStateToProps(mockAdminState({notifications: notificationState}));
        expect(props).to.eql({errors: ["a", "b"]});
    });
});
