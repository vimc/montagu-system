import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { mockLocation } from "../../mocks/mocks";

import { PageWithHeader } from "../../../main/shared/components/PageWithHeader/PageWithHeader";
import {IPageWithParent} from "../../../main/shared/models/Breadcrumb";
import {Sandbox} from "../../Sandbox";
import {checkAsync} from "../../testHelpers";

export class DummyPage extends PageWithHeader<undefined> {
    loaded: boolean;

    constructor() {
        super();
        this.loaded = false;
    }

    siteTitle() {
        return "LOTR";
    }

    name() {
        return "Dummy";
    }

    parent(): IPageWithParent {
        return null;
    }

    urlFragment() {
        return "/lotr/";
    }

    load() {
        this.loaded = true;
        super.load();
    }

    title(): JSX.Element {
        return <span>Elbereth</span>;
    }

    renderPageContent(): JSX.Element {
        return <span>Content</span>;
    }
}

export class DummyPageNoTitle extends PageWithHeader<undefined> {
    siteTitle() {
        return "LOTR";
    }

    name() {
        return "Dummy";
    }

    parent(): IPageWithParent {
        return null;
    }

    urlFragment() {
        return "/lotr/";
    }

    renderPageContent(): JSX.Element {
        return <span>Content</span>;
    }
    hideTitle(): boolean {
        return true;
    }
}


describe('PageWithHeader', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    beforeEach(() => {
        rendered = shallow(<DummyPage location={mockLocation<undefined>()} router={null} />);
    });
    afterEach(() => sandbox.restore());

    it("renders the application title", () => {
        expect(rendered.find(".header__siteTitle").render().text()).to.equal("LOTR");
    });

    it("renders the title", () => {
        expect(rendered.find(".page__title").text()).to.equal("Elbereth");
    });

    it("renders the content", () => {
        expect(rendered.find(".page__content").text()).to.equal("Content");
    });

    it("loads on mount after timeout", (done: DoneCallback) => {
        const page = sandbox.mount(<DummyPage location={mockLocation<undefined>()} router={null} />)
            .instance() as DummyPage;
        expect(page.loaded).to.be.false;
        checkAsync(done, () => {
            expect(page.loaded).to.be.true;
        });
    });

    it("renders the content without title element if hideTitle equals true", () => {
        const dummyPageNoTitle = shallow(<DummyPageNoTitle location={mockLocation<undefined>()} router={null} />);
        expect(dummyPageNoTitle.find(".pageTitle").exists()).to.equal(false);
    });
});