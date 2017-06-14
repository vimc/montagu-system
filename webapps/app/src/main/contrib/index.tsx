import * as React from "react";
import * as ReactDOM from "react-dom";
import { ContribApp } from "./components/ContribApp";

require('file-loader?name=[name].[ext]!./index.html');
require('../shared/styles/fonts.css');
require('../shared/styles/buttons.css');

ReactDOM.render(
    <ContribApp />,
    document.getElementById("react")
);