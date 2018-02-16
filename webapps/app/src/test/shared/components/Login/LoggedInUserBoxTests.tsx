import * as React from "react";
import { Sandbox } from "../../../Sandbox";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";

import { initialAuthState } from "../../../../main/shared/reducers/authReducer";
import { InternalLink } from "../../../../main/shared/components/InternalLink";
import { LoggedInUserBoxComponent, LoggedInUserBox } from "../../../../main/shared/components/Login/LoggedInUserBox";
import { mockGlobalState } from "../../../mocks/mockStates";
import { mapStateToProps } from "../../../../main/shared/components/Login/LoggedInUserBox";
import { createMockStore } from "../../../mocks/mockStore";
import { AuthTypeKeys } from "../../../../main/shared/actionTypes/AuthTypes";
import { AuthService } from "../../../../main/shared/services/AuthService";


describe("LoggedInUserBoxComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders nothing when the user is not logged in", () => {
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={initialAuthState.loggedIn}
            username={initialAuthState.username}
            logOut={()=>({})}
        />);
        expect(rendered.text()).to.be.empty;
    });

    it("renders log out link", () => {
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={true}
            username="test.user"
            logOut={()=>({})}
        />);
        expect(rendered.text()).to.contain("Logged in as test.user");
        expect(rendered.find(InternalLink)).to.have.length(1);
    });

    it("clicking log out emits logOut event", () => {
        const dispatchSpy = sandbox.createSpy();
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={true}
            username="test.user"
            logOut={dispatchSpy}
        />);
        const spy = sandbox.dispatchSpy();
        rendered.find(InternalLink).simulate("click");
        expect(dispatchSpy.called).to.equal(true);
    });

    it("maps state to props", () => {
        const globalStateMock = mockGlobalState({ auth: {loggedIn: true, username: "test.user"} })
        const props = mapStateToProps(globalStateMock)
        expect(props.username).to.eq("test.user");
        expect(props.loggedIn).to.eq(true);
    });

    it("clicking log out dispatches unauthenticated action", (done: DoneCallback) => {
        const store = createMockStore({auth: {loggedIn: true}});
        sandbox.setStub(AuthService.prototype, "clearShinyCookie");
        const rendered = mount(<Provider store={store}><LoggedInUserBox/></Provider>);
        rendered.find(InternalLink).simulate("click");
        const actions = store.getActions();
        expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
        done();
    });

});