import * as React from "react";
import {expect} from "chai";
import {DataLinks} from "../../../../main/report/components/Data/DataLinks";
import { Sandbox } from "../../../Sandbox";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";

describe("DataLinks", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders list of links", () => {

        const fakeHash = "53269fehwjcfksd678";
        const fakeData =
            {
                "datasource": fakeHash,
                "another": "753927yhfdjwkncsalk"
            };

        const rendered = sandbox.mount(<DataLinks {...fakeData}/>);

        const item = rendered.find("li").at(0);
        const firstLink = item.find(FileDownloadLink).at(0);
        const secondLink = item.find(FileDownloadLink).at(1);

        expect(rendered.find("li").length).to.eq(2);

        expect(firstLink.prop("href")).to.eq(`/data/csv/${fakeHash}/`);
        expect(firstLink.text()).to.eq("Download csv");

        expect(secondLink.prop("href")).to.eq(`/data/rds/${fakeHash}/`);
        expect(secondLink.text()).to.eq("Download rds");

    });

});