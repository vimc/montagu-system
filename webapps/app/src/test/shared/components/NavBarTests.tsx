import {expect} from "chai";
import {Sandbox} from "../../Sandbox";
import {HTMLAttributes, shallow, ShallowWrapper} from "enzyme";
import * as React from "react";
import { alt } from "../../../main/shared/alt";

import {NavBar, NavBarComponent} from "../../../main/shared/components/NavBar/NavBar";
import {InternalLink} from "../../../main/shared/components/InternalLink";
import {Breadcrumb} from "../../../main/shared/models/Breadcrumb";
import {navActions} from "../../../main/shared/actions/NavActions";

describe("NavBar", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const renderCrumbs = function (crumbs: Breadcrumb[]): ShallowWrapper<HTMLAttributes, any> {
        return shallow(<NavBarComponent crumbs={crumbs}/>).find(".montagu-navbar__chunk");
    };

    it("can get props from store", () => {
        alt.bootstrap(JSON.stringify({
            NavStore: {
                crumbs: [
                    {url: "a", name: "A"},
                    {url: "b", name: "B"},
                ]
            }
        }));
        const props = NavBarComponent.getPropsFromStores();
        expect(props).to.eql({
            crumbs: [
                {url: "a", name: "A"},
                {url: "b", name: "B"}
            ]
        });
    });


    it("can render zero crumbs", () => {
        expect(renderCrumbs([])).to.have.length(0);
    });

    it("can render one crumb", () => {
        const crumbs = renderCrumbs([{
            url: "/",
            name: "name"
        }]);
        expect(crumbs).to.have.length(1);
        const link = crumbs.at(0).find(InternalLink);
        expect(link.props()).to.eql({
            href: "/",
            children: "name"
        });
    });

    it("can render two crumbs", () => {
        const crumbs = renderCrumbs([
            {url: "/1", name: "1"},
            {url: "/2", name: "2"}
        ]);
        expect(crumbs).to.have.length(2);
        let link = crumbs.at(0).find(InternalLink);
        expect(link.props()).to.eql({
            href: "/1",
            children: "1"
        });

        link = crumbs.at(1).find(InternalLink);
        expect(link.props()).to.eql({
            href: "/2",
            children: "2"
        });
    });

    it("can render crumb with null URL", () => {
        const crumbs = renderCrumbs([
            {url: null, name: "Test"}
        ]);
        expect(crumbs).to.have.length(1);
        expect(crumbs.at(0).find(InternalLink)).to.have.length(0);
        expect(crumbs.at(0).text()).to.eql("Test");
    });
});