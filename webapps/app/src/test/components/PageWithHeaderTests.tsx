import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { mockLocation } from "../mocks/mocks";

import { PageWithHeader } from "../../main/shared/components/PageWithHeader/PageWithHeader";

const styles = require('../../main/shared/components/PageWithHeader/PageWithHeader.css');

class DummyPage extends PageWithHeader<undefined> {
    siteTitle() {
        return "LOTR";
    }

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
        rendered = shallow(<DummyPage location={ mockLocation<undefined>() } />);
    });

    it("renders the application title", () => {
        expect(rendered.find(`.${styles.siteTitle}`).render().text()).to.equal("LOTR");
    });

    it("renders the title", () => {
        expect(rendered.find(`.${styles.pageTitle}`).text()).to.equal("Elbereth");
    });

    it("renders the content", () => {
        expect(rendered.find(`.${styles.pageContent}`).text()).to.equal("Content");
    });
});