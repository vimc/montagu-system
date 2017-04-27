import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { shallow } from 'enzyme';
import { State } from '../../main/stores/MainStore';
import { expect } from 'chai';

import { ApplicationComponent } from '../../main/components/Application';
import { LoadingPage } from '../../main/components/LoadingPage';
import Router from '../../main/components/Router';

describe("Application", () => {
    it("renders LoadingPage when not ready", () => {
        const rendered = shallow(<ApplicationComponent 
            diseases={{ loaded: false, content: {} }} 
            errorMessage="" 
            ready={ false } />);
        expect(rendered.find(LoadingPage)).has.length(1, "Expected LoadingPage to be rendered");
    });

    it("renders Router when ready", () => {
        const rendered = shallow(<ApplicationComponent 
            diseases={{ loaded: false, content: {} }}
            errorMessage="" 
            ready={ true } />);
        expect(rendered.find(Router)).has.length(1, "Expected Router to be rendered");
    });
});