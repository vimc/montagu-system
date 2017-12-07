import {expect} from "chai";
import alt from "../../../main/shared/alt";
import {navActions} from "../../../main/shared/actions/NavActions";
import {IPageWithParent} from "../../../main/shared/models/Breadcrumb";
import {navStore} from "../../../main/shared/stores/NavStore";

describe("NavStore", () => {
    afterEach(() => alt.recycle());

    it("can be initialized", () => {
        const pageA: IPageWithParent = {
            url: () => "a",
            urlFragment: () => "a",
            name: () => "A",
            parent: () => null
        };
        const pageB: IPageWithParent = {
            url: () => "b",
            urlFragment: () => "b",
            name: () => "B",
            parent: () => pageA
        };

        navActions.initialize(pageB);
        expect(navStore.getState().isInitialized).to.be.true;
        expect(navStore.getState().crumbs).to.eql([
            { url: "a", name: "A" },
            { url: "b", name: "B" }
        ]);
    });

});