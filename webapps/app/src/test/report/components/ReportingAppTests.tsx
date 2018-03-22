import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import { alt } from "../../../main/shared/alt";
import { ReportingApp, ReportingAppComponent, ReportingAppProps } from "../../../main/report/components/ReportingApp";
import { ReportingRouter } from "../../../main/report/components/ReportingRouter";
import { ErrorLog } from "../../../main/shared/components/ErrorLog/ErrorLog";
import { NotificationArea } from "../../../main/shared/components/NotificationArea/NotificationArea";

describe("ReportingApp", () => {
    it("can get props from stores", () => {
        alt.bootstrap(JSON.stringify({
            NotificationStore: {
                errors: ["a", "b"],
                infos: ["c", "d"]
            }
        }));

        const expected: Partial<ReportingAppProps> = {
            errors: ["a", "b"],
            infos: ["c", "d"],
        };
        expect(ReportingAppComponent.getPropsFromStores()).to.eql(expected);
    });

    it("passes through loggedIn to router", () => {
        const rendered = shallow(<ReportingAppComponent errors={ [] } loggedIn={ true } infos={ [] } />);
        expect(rendered.find(ReportingRouter).props()).to.eql({
            loggedIn: true,
            history: undefined
        });
    });

    it("passes through errors to ErrorLog", () => {
        const rendered = shallow(<ReportingAppComponent errors={ [ "a", "b" ] } loggedIn={ false } infos={ [] } />);
        expect(rendered.find(ErrorLog).props()).to.eql({ errors: [ "a", "b" ] });
    });

    it("passes through infos to NotificationArea", () => {
        const rendered = shallow(<ReportingAppComponent errors={ [] } loggedIn={ false } infos={ [ "a", "b" ] } />);
        expect(rendered.find(NotificationArea).props()).to.eql({ notifications: [ "a", "b" ] });
    });
});