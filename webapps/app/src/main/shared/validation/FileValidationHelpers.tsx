import React = require("react");

export interface CustomValidationResult {
    isValid: boolean;
    content: JSX.Element;
}

export function checkFileExtensionIsCSV(path: string): CustomValidationResult {
    const extension = path.split('.').pop().toLowerCase();
    if (extension != "csv") {
        const helpUrl = "https://support.office.com/en-us/article/Import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba";
        const message = <span>
                <p>
                    The file you have selected is not in CSV (comma-separated value) format.
                    Please upload a file in the correct format. If you think your file is
                    already in CSV format, please check that the file extension is ".csv".
                </p>
                <p>
                    If you are using Microsoft Excel please see&nbsp;
                    <a href={helpUrl}>this help page</a>
                    &nbsp;for instructions on how to export to CSV format.
                </p>
            </span>;
        return { isValid: false, content: message };
    } else {
        return { isValid: true, content: null };
    }
}