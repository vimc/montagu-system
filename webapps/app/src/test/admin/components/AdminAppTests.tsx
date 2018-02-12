import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import { alt } from "../../../main/shared/alt";
import { AdminApp, AdminAppComponent, AdminAppProps } from "../../../main/admin/components/AdminApp";
import { AdminRouter } from "../../../main/admin/components/AdminRouter";
import { ErrorLog } from "../../../main/shared/components/ErrorLog/ErrorLog";
import { NotificationArea } from "../../../main/shared/components/NotificationArea/NotificationArea";

describe("AdminApp", () => {
    it("can get props from stores", () => {
        alt.bootstrap(JSON.stringify({
            NotificationStore: {
                errors: ["a", "b"],
                infos: ["c", "d"]
            },
        }));

        const expected: Partial<AdminAppProps> = {
            errors: ["a", "b"],
            infos: ["c", "d"],
            // loggedIn: true
        };
        expect(AdminAppComponent.getPropsFromStores()).to.eql(expected);
    });

    it("passes through loggedIn to router", () => {
        const rendered = shallow(<AdminAppComponent errors={ [] } loggedIn={ true } infos={ [] } />);
        expect(rendered.find(AdminRouter).props()).to.eql({
            loggedIn: true
        });
    });

    it("passes through errors to ErrorLog", () => {
        const rendered = shallow(<AdminAppComponent errors={ [ "a", "b" ] } loggedIn={ false } infos={ [] } />);
        expect(rendered.find(ErrorLog).props()).to.eql({ errors: [ "a", "b" ] });
    });

    it("passes through infos to NotificationArea", () => {
        const rendered = shallow(<AdminAppComponent errors={ [] } loggedIn={ false } infos={ [ "a", "b" ] } />);
        expect(rendered.find(NotificationArea).props()).to.eql({ notifications: [ "a", "b" ] });
    });
});