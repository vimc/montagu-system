import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import { mockLocation } from '../mocks';

import { PageWithHeader } from '../../main/components/PageWithHeader/PageWithHeader';
const styles = require('../../main/components/PageWithHeader/PageWithHeader.css');

class DummyPage extends PageWithHeader<undefined, undefined> {
    title(): JSX.Element {
        return <span>Elbereth</span>;
    }

    renderPageContent(): JSX.Element {
        return <span>Content</span>;
    }
}

describe('PageWithHeader', () => {
    let rendered: ShallowWrapper<any, any>;

    beforeEach(() => {
        rendered = shallow(<DummyPage location={ mockLocation() } />);
    });

    it("renders the title", () => {
        expect(rendered.find(`.${styles.pageTitle}`).text()).to.equal("Elbereth");
    });

    it("renders the content", () => {
        expect(rendered.find(`.${styles.pageContent}`).text()).to.equal("Content");
    });
});