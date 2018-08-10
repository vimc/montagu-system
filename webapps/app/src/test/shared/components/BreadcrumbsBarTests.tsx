import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../helper";
import {Sandbox} from "../../Sandbox";
import {mockContribState} from "../../mocks/mockStates";
import {BreadcrumbsBar, makeLink, mapStateToProps} from "../../../main/shared/components/Breadcrumbs/Breadcrumbs";
import {createMockStore} from "../../mocks/mockStore";

describe("Breadcrumb Bar", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders link with url", () => {
        const rendered = shallow(makeLink({name: "Test", url:"test"}));
        expect(rendered.find('a').props().href).to.equal('test');
        expect(rendered.find('a').text()).to.equal('Test');
    });

    it("renders link with no url", () => {
        const rendered = shallow(makeLink({name: "Test", url: undefined}));
        expect(rendered.find('span').text()).to.equal('Test');
    });

    it("maps crumbs from state", () => {
        const state = mockContribState();
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.crumbs).to.eql([]);
    });

    it("passes crumbs from state to component", () => {
        const store = createMockStore(mockContribState({breadcrumbs: {breadcrumbs: [{name: 'A', url: 'a'}]}}));
        const rendered = shallow(<BreadcrumbsBar />, {context: {store}});
        expect(rendered.props().crumbs).to.eql([{name: 'A', url: 'a'}])
    });

    it("renders one crumb based on data from state", () => {
        const store = createMockStore(mockContribState({breadcrumbs: {breadcrumbs: [{name: 'A', url: 'a'}]}}));
        const rendered = shallow(<BreadcrumbsBar />, {context: {store}}).dive();
        const crumbs = rendered.find('div.montagu-navbar__chunk');
        expect(crumbs.length).to.equal(1);
        const crumb = crumbs.at(0).render();
        expect(crumb.find('a').prop('href')).to.equal('a');
        expect(crumb.find('a').text()).to.equal('A');
    });

    it("renders no crumbs", () => {
        const store = createMockStore(mockContribState({breadcrumbs: {breadcrumbs: []}}));
        const rendered = shallow(<BreadcrumbsBar />, {context: {store}}).dive();
        const crumbs = rendered.find('div.montagu-navbar__chunk');
        expect(crumbs.length).to.equal(0);
    });

});
