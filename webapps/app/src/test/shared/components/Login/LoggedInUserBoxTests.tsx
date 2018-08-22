import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {expect} from "chai";
import {mount, shallow} from "enzyme";
import {Provider} from "react-redux";
import {MemoryRouter as Router} from 'react-router-dom';

import {initialAuthState} from "../../../../main/shared/reducers/authReducer";
import {InternalLink} from "../../../../main/shared/components/InternalLink";
import {
    LoggedInUserBox,
    LoggedInUserBoxComponent,
    mapStateToProps
} from "../../../../main/shared/components/Login/LoggedInUserBox";
import {mockContribState} from "../../../mocks/mockStates";
import {createMockContribStore} from "../../../mocks/mockStore";
import {AuthTypeKeys} from "../../../../main/shared/actionTypes/AuthTypes";
import {AuthService} from "../../../../main/shared/services/AuthService";

describe("LoggedInUserBoxComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders nothing when the user is not logged in", () => {
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={initialAuthState.receivedBearerToken}
            username={initialAuthState.username}
            logOut={() => ({})}
        />);
        expect(rendered.text()).to.be.empty;
    });

    it("renders log out link", () => {
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={true}
            username="test.user"
            logOut={() => ({})}
        />);
        expect(rendered.text()).to.contain("Logged in as test.user");
        expect(rendered.find(InternalLink)).to.have.length(1);
    });

    it("maps state to props", () => {
        const contribStateMock = mockContribState({auth: {receivedBearerToken: true, username: "test.user"}});
        const props = mapStateToProps(contribStateMock);
        expect(props.username).to.eq("test.user");
        expect(props.loggedIn).to.eq(true);
    });

    it("clicking log out dispatches unauthenticated action", (done: DoneCallback) => {
        const store = createMockContribStore({auth: {receivedBearerToken: true}});
        sandbox.setStub(AuthService.prototype, "logOutOfAPI");
        const rendered = mount(<Provider store={store}><Router><LoggedInUserBox/></Router></Provider>);
        rendered.find(InternalLink).simulate("click");
        const actions = store.getActions();
        expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
        done();
    });

});