import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Provider} from "react-redux";

import {mockLocation} from "../../mocks/mocks";
import {PageProperties, PageWithHeader} from "../../../main/shared/components/PageWithHeader/PageWithHeader";
import {PageHeader} from "../../../main/shared/components/PageWithHeader/PageHeader";
import {PageArticle} from "../../../main/shared/components/PageWithHeader/PageArticle";
import {Page} from "../../../main/shared/components/PageWithHeader/Page";
import {IPageWithParent} from "../../../main/shared/models/Breadcrumb";
import {Sandbox} from "../../Sandbox";
import {checkAsync} from "../../testHelpers";
import {reduxHelper} from "../../reduxHelper";

export class DummyPage extends PageWithHeader<undefined> {
    loaded: boolean;

    constructor(props?: PageProperties<undefined>) {
        super(props);
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

    load(props: undefined) {
        return super.load(props).then(() => {
            this.loaded = true;
        });
    }

    title(): JSX.Element {
        return <span>Elbereth</span>;
    }

    render(): JSX.Element {
        return <Page page={this}><span>Content</span></Page>;
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

    render(): JSX.Element {
        return <Page page={this}><span>Content</span></Page>;
    }

    hideTitle(): boolean {
        return true;
    }
}


describe('PageWithHeader', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    beforeEach(() => {
        rendered = shallow(<DummyPage location={mockLocation<undefined>()} router={null}/>);
    });
    afterEach(() => sandbox.restore());

    it("loads on mount after timeout", (done: DoneCallback) => {
        const store = reduxHelper.createStore({auth: {loggedIn: true}})
        const page = sandbox.mount(<Provider store={store}><DummyPage location={mockLocation<undefined>()}
                                                                      router={null}/></Provider>)
            .find(DummyPage).instance() as DummyPage;
        expect(page.loaded).to.be.false;

        checkAsync(done, () => {
            expect(page.loaded).to.be.true;
        });
    });

    it("renders the content without title element if hideTitle equals true", () => {
        const dummyPageNoTitle = shallow(<DummyPageNoTitle location={mockLocation<undefined>()} router={null}/>);
        expect(dummyPageNoTitle.find(".pageTitle").exists()).to.equal(false);
    });
});


describe('PageHeader', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();
    const logo = "logo.png";
    beforeEach(() => {
        rendered = shallow(<PageHeader siteTitle={"LOTR"} logo={logo}/>);
    });
    afterEach(() => sandbox.restore());

    it("renders the application title", () => {
        expect(rendered.find(".header__siteTitle").render().text()).to.equal("LOTR");
    });

    it("renders the logo", () => {
        expect(rendered.find("img").prop("src")).to.equal("logo.png");
    });
});


describe('PageArticle', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    beforeEach(() => {
        rendered = shallow(<PageArticle title={<p>Elbereth</p>} hideTitle={false}>Content</PageArticle>);
    });
    afterEach(() => sandbox.restore());

    it("renders the title", () => {
        expect(rendered.find(".page__title").text()).to.equal("Elbereth");
    });

    it("renders the content", () => {
        expect(rendered.find(".page__content").text()).to.equal("Content");
    });
});