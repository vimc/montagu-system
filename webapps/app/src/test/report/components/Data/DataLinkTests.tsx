import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {DataLinks} from "../../../../main/report/components/Data/DataLinks";
import {Sandbox} from "../../../Sandbox";
import {FileDownloadLink} from "../../../../main/report/components/FileDownloadLink";
import {ILookup} from "../../../../main/shared/models/Lookup";

describe("DataLinks", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders list of links", () => {

        const fakeHash = "53269fehwjcfksd678";
        const fakeData = {
            "datasource": fakeHash,
            "another": "753927yhfdjwkncsalk"
        } as Readonly<ILookup<string>>;

        const rendered = shallow(<DataLinks {...fakeData}/>);

        const links = rendered.find(FileDownloadLink);
        const firstLink = links.at(0);
        const secondLink = links.at(1);

        expect(links.length).to.eq(4);

        expect(firstLink.prop("href")).to.eq(`/data/csv/${fakeHash}/`);
        expect(firstLink.children().first().text()).to.eq("csv");

        expect(secondLink.prop("href")).to.eq(`/data/rds/${fakeHash}/`);
        expect(secondLink.children().first().text()).to.eq("rds");
    });

});