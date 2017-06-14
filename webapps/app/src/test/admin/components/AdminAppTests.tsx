import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import { alt } from "../../../main/shared/alt";
import { AdminApp, AdminAppComponent, AdminAppProps } from "../../../main/admin/components/AdminApp";
import { AdminRouter } from "../../../main/admin/components/AdminRouter";
import { ErrorLog } from "../../../main/shared/components/ErrorLog/ErrorLog";

describe("AdminApp", () => {
    it("can get props from stores", () => {
        alt.bootstrap(JSON.stringify({
            ErrorStore: { errors: ["a", "b"] },
            AdminAuthStore: { loggedIn: true }
        }));

        const expected: AdminAppProps = {
            errors: ["a", "b"],
            loggedIn: true
        };
        expect(AdminAppComponent.getPropsFromStores()).to.eql(expected);
    });

    it("passes through loggedIn to router", () => {
        const rendered = shallow(<AdminAppComponent errors={ [] } loggedIn={ true } />);
        expect(rendered.find(AdminRouter).props()).to.eql({ loggedIn: true });
    });

    it("passes through errors to ErrorLog", () => {
        const rendered = shallow(<AdminAppComponent errors={ [ "a", "b" ] } loggedIn={ false } />);
        expect(rendered.find(ErrorLog).props()).to.eql({ errors: [ "a", "b" ] });
    });
});