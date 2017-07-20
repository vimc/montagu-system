import * as React from "react";
import { expect } from "chai";
import {alt} from "../../../../../contrib/src/main/shared/alt";
import {VersionListComponent} from "../../../main/report/components/Versions/VersionList";

describe("VersionListComponent", () => {
    it("can get props from stores", () => {
        const versions = { "reportname": [ "version1", "version2" ]};
        alt.bootstrap(JSON.stringify({
            ReportStore: {
                ready: true,
                versions: versions,
                currentReport: "reportname"
            }
        }));

        expect(VersionListComponent.getPropsFromStores()).to.eql({
            ready: true,
            versions: [ "version1", "version2" ],
            report: "reportname"
        });
    });

});