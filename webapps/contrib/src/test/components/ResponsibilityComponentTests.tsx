import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import { mockResponsibility } from '../mocks';
import { alt } from '../../main/alt';

import { ResponsibilityComponent } from '../../main/components/Responsibilities/ResponsibilityComponent';
const styles = require("../../main/components/Responsibilities/Responsibilities.css");
import { Responsibility } from '../../main/Models';

describe('ResponsibilityComponent', () => {
    let rendered: ShallowWrapper<any, any>;

    before(() => {
        alt.bootstrap(JSON.stringify({
            MainStore: {
                diseases: {
                    loaded: true,
                    content: { "disease-id": "Disease name" }
                }
            }
        }));

        const responsibility = mockResponsibility({
            status: "empty"
        }, { 
            id: "scenario-id",
            description: "Description" ,          
        });
        rendered = shallow(<ResponsibilityComponent {...responsibility} />);
    });


    it("renders the scenario header", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("Description (ID: scenario-id)");
    });

    it("renders the responsibility status", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("empty");
    });
});