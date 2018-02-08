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
            parent: () => null,
            load: () => Promise.resolve(true)
        };
        const pageB: IPageWithParent = {
            url: () => "b",
            urlFragment: () => "b",
            name: () => "B",
            parent: () => pageA,
            load: () => Promise.resolve(true)
        };

        navActions.initialize(pageB);
        expect(navStore.getState().crumbs).to.eql([
            { url: "a", name: "A" },
            { url: "b", name: "B" }
        ]);
    });

});