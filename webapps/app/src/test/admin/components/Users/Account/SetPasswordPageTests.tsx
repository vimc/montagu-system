import {
    RequestResetLinkButton, SetPasswordPage,
    SetPasswordPageComponent,
    SetPasswordPageProps
} from "../../../../../main/admin/components/Users/Account/SetPasswordPage";
import {Sandbox} from "../../../../Sandbox";
import {helpers} from "../../../../../main/shared/Helpers";
import * as React from "react";
import {expect} from "chai";
import {jwtTokenAuth} from "../../../../../main/shared/modules/jwtTokenAuth";
import {shallow} from "enzyme";
import {SetPasswordForm} from "../../../../../main/admin/components/Users/Account/SetPasswordForm";
import {setPasswordPageActionCreators} from "../../../../../main/admin/actions/pages/SetPasswordPageActionCreators";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockAdminState} from "../../../../mocks/mockStates";
import {checkAsync} from "../../../../testHelpers";

describe("SetPasswordPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    function minimalProps(): SetPasswordPageProps {
        const p: Partial<SetPasswordPageProps> = {
            saveTokenToState: x => {},
            onLoad: () => {}
        };
        return p as SetPasswordPageProps;
    }

    it("calls onLoad and saves token from URL to state on mount", (done: DoneCallback) => {
        sandbox.setStubFunc(helpers, "queryStringAsObject", () => ({token: "TOKEN"}));
        const onLoad = sandbox.setStubReduxAction(setPasswordPageActionCreators, "onLoad");
        const saveTokenToState = sandbox.setStubReduxAction(setPasswordPageActionCreators, "saveToken");
        const store = createMockAdminStore(mockAdminState());

        shallow(<SetPasswordPage {...{} as SetPasswordPageProps} />, {context: {store}})
            .dive();
        checkAsync(done, () => {
            expect(saveTokenToState.getCall(0).args).to.eql(["TOKEN"]);
            expect(onLoad.callCount).to.equal(1, "Expected onLoad to be called");
        });
    });

    it("renders SetPasswordForm if token is valid", () => {
        sandbox.setStubFunc(jwtTokenAuth, "isCompressedTokenValid", () => true);
        const rendered = shallow(<SetPasswordPageComponent {...minimalProps()} />);
        expect(rendered.find(SetPasswordForm)).to.have.length(1);
    });

    it("renders RequestResetLinkButton if token is invalid", () => {
        sandbox.setStubFunc(jwtTokenAuth, "isCompressedTokenValid", () => false);
        const rendered = shallow(<SetPasswordPageComponent {...minimalProps()} />);
        expect(rendered.find(RequestResetLinkButton)).to.have.length(1);
    });
});

