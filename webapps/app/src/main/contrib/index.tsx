import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContributionApp } from "./components/ContributionApp";

require('file-loader?name=[name].[ext]!./index.html');
require('../shared/styles/fonts.css');
require('../shared/styles/buttons.css');

ReactDOM.render(
    <ContributionApp />,
    document.getElementById("react")
);