import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import { ContributionAppComponent } from "../../main/contrib/components/ContributionApp";
import { ErrorLog } from "../../main/shared/components/ErrorLog/ErrorLog";
import { alt } from "../../main/shared/alt";
import { ContribRouter } from "../../main/contrib/components/ContribRouter";

describe("ContributionApp", () => {
    it("pulls properties from stores", () => {
        alt.bootstrap(JSON.stringify({
            MainStore: { ready: true },
            AuthStore: { loggedIn: true },
            ErrorStore: { errors: [ "Hi" ] }
        }));
        const props = ContributionAppComponent.getPropsFromStores();
        expect(props).to.eql({
            ready: true,
            loggedIn: true,
            errors: [ "Hi" ]
        });
    });

    it("renders Router", () => {
        const rendered = shallow(<ContributionAppComponent ready={ true } errors={ [] } loggedIn={ true } />);
        const router = rendered.find(ContribRouter);
        expect(router).has.length(1, "Expected Router to be rendered");
        expect(router.props()).to.eql({
            loaded: true,
            loggedIn: true
        });
    });

    it("renders ErrorLog", () => {
        const rendered = shallow(<ContributionAppComponent errors={ [ "m1", "m2" ] } loggedIn={ true } ready={ true } />);
        const log = rendered.find(ErrorLog);
        expect(log).has.length(1, "Expected Router to be rendered");
        expect(log.props()).to.eql({
            errors: [ "m1", "m2" ]
        });
    });
});