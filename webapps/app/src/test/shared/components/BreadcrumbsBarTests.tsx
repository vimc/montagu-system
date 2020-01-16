import * as React from "react";

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
        expect(rendered.find('a').props().href).toEqual('test');
        expect(rendered.find('a').text()).toEqual('Test');
    });

    it("renders link with no url", () => {
        const rendered = shallow(makeLink({name: "Test", url: undefined}));
        expect(rendered.find('span').text()).toEqual('Test');
    });

    it("maps crumbs from state", () => {
        const state = mockContribState();
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.crumbs).toEqual([]);
    });

    it("passes crumbs from state to component", () => {
        const store = createMockStore(mockContribState({breadcrumbs: {breadcrumbs: [{name: 'A', url: 'a'}]}}));
        const rendered = shallow(<BreadcrumbsBar />, {context: {store}});
        expect(rendered.props().crumbs).toEqual([{name: 'A', url: 'a'}])
    });

    it("renders one crumb based on data from state", () => {
        const store = createMockStore(mockContribState({breadcrumbs: {breadcrumbs: [{name: 'A', url: 'a'}]}}));
        const rendered = shallow(<BreadcrumbsBar />, {context: {store}}).dive();
        const crumbs = rendered.find('div.montagu-navbar__chunk');
        expect(crumbs.length).toEqual(1);
        const crumb = crumbs.at(0).render();
        expect(crumb.find('a').prop('href')).toEqual('a');
        expect(crumb.find('a').text()).toEqual('A');
    });

    it("renders no crumbs", () => {
        const store = createMockStore(mockContribState({breadcrumbs: {breadcrumbs: []}}));
        const rendered = shallow(<BreadcrumbsBar />, {context: {store}}).dive();
        const crumbs = rendered.find('div.montagu-navbar__chunk');
        expect(crumbs.length).toEqual(0);
    });

});
