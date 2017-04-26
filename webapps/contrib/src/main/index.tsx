import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./components/Application";

require('file-loader?name=[name].[ext]!./index.html');
require('./styles/fonts.css');
require('./styles/buttons.css');

ReactDOM.render(    
    <Application />,
    document.getElementById("react")
);