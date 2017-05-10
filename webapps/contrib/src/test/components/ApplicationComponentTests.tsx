import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { shallow } from 'enzyme';
import * as MainStore from '../../main/stores/MainStore';
import * as AuthStore from '../../main/stores/AuthStore';
import { expect } from 'chai';

import { ApplicationComponent } from '../../main/components/Application';
import { LoadingPage } from '../../main/components/LoadingPage';
import Router from '../../main/components/Router';

describe("Application", () => {
    it("renders LoadingPage when not ready", () => {
        const main: MainStore.State = {
            ready: false,
            diseases: { loaded: false, content: null },
            errorMessage: null
        };
        const auth: AuthStore.State = {
            loggedIn: false,
            username: null,
            bearerToken: null,
            permissions: [],
            modellingGroups: []
        };
        const rendered = shallow(<ApplicationComponent main={ main } auth={ auth } />);
        expect(rendered.find(LoadingPage)).has.length(1, "Expected LoadingPage to be rendered");
    });

    it("renders Router when ready", () => {
        const main: MainStore.State = {
            ready: true,
            diseases: { loaded: false, content: null },
            errorMessage: null
        };
        const auth: AuthStore.State = {
            loggedIn: false,
            username: null,
            bearerToken: null,
            permissions: [],
            modellingGroups: []
        };
        const rendered = shallow(<ApplicationComponent main={ main } auth={ auth } />);
        expect(rendered.find(Router)).has.length(1, "Expected Router to be rendered");
    });
});