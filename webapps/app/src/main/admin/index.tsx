import * as React from "react";
import * as ReactDOM from "react-dom";
import { AdminApp } from "./components/AdminApp";

require('file-loader?name=[name].[ext]!./index.html');
require('../shared/styles/fonts.css');
require('../shared/styles/buttons.css');
require('../shared/styles/common.css');

ReactDOM.render(
    <AdminApp />,
    document.getElementById("react")
);