import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import { ErrorLog } from "../../../main/shared/components/ErrorLog/ErrorLog";
import { alt } from "../../../main/shared/alt";
import { ContribAppComponent } from "../../../main/contrib/components/ContribApp";
import { ContribRouter } from "../../../main/contrib/components/ContribRouter";
import { NotificationArea } from "../../../main/shared/components/NotificationArea/NotificationArea";

describe("ContribApp", () => {
    it("pulls properties from stores", () => {
        alt.bootstrap(JSON.stringify({
            MainStore: { ready: true },
            ContribAuthStore: { loggedIn: true },
            NotificationStore: {
                errors: [ "Hi" ],
                infos: [ "Ho" ]
            }
        }));
        const props = ContribAppComponent.getPropsFromStores();
        expect(props).to.eql({
            ready: true,
            errors: [ "Hi" ],
            infos: [ "Ho" ],
            loggedIn: true
        });
    });

    it("renders Router", () => {
        const rendered = shallow(<ContribAppComponent ready={ true } errors={ [] } loggedIn={ true } infos={ [] } />);
        const router = rendered.find(ContribRouter);
        expect(router).has.length(1, "Expected Router to be rendered");
        expect(router.props()).to.eql({
            loaded: true,
            loggedIn: true
        });
    });

    it("renders ErrorLog", () => {
        const rendered = shallow(<ContribAppComponent errors={ [ "m1", "m2" ] } loggedIn={ true } ready={ true } infos={ [] } />);
        const log = rendered.find(ErrorLog);
        expect(log).has.length(1, "Expected Router to be rendered");
        expect(log.props()).to.eql({
            errors: [ "m1", "m2" ]
        });
    });

    it("renders NotificationArea", () => {
        const rendered = shallow(<ContribAppComponent errors={ [] } loggedIn={ true } ready={ true } infos={ [ "m1", "m2" ] } />);
        const log = rendered.find(NotificationArea);
        expect(log).has.length(1, "Expected NotificationArea to be rendered");
        expect(log.props()).to.eql({
            notifications: [ "m1", "m2" ]
        });
    });
});