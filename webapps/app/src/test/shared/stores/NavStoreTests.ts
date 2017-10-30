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

    it("navigate to new page adds crumb", () => {
        navActions.navigate("/", "Test");
        expect(navStore.getState().crumbs).to.eql([
            { url: "/", name: "Test" }
        ]);
    });

    it("navigate to child page adds crumb", () => {
        navActions.navigate("/", "Parent");
        navActions.navigate("/child/", "Child");
        expect(navStore.getState().crumbs).to.eql([
            { url: "/", name: "Parent" },
            { url: "/child/", name: "Child" }
        ]);
    });

    it("navigate to sibling page adds crumb", () => {
        navActions.navigate("/", "Parent");
        navActions.navigate("/brother/", "Brother");
        navActions.navigate("/sister/", "Sister");
        expect(navStore.getState().crumbs).to.eql([
            { url: "/", name: "Parent" },
            { url: "/brother/", name: "Brother" },
            { url: "/sister/", name: "Sister" }
        ]);
    });

    it("navigate to parent page unwinds crumbs", () => {
        navActions.navigate("/", "Root");
        navActions.navigate("/grandfather/", "Grandfather");
        navActions.navigate("/grandfather/father/", "Father");
        navActions.navigate("/grandfather/father/child/", "Child");
        navActions.navigate("/grandfather/", "Grandfather");
        expect(navStore.getState().crumbs).to.eql([
            { url: "/", name: "Root" },
            { url: "/grandfather/", name: "Grandfather" }
        ]);
    });
});