import * as React from "react";
import {Report} from "../../../../shared/models/Generated";

export const nameAccessorFunction = (data: Report) => {

    let name = data.name;
    if (data.display_name) {
        name = data.display_name + ` (${name})`
    }
    return name
};
