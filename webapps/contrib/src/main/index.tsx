import * as React from "react";
import * as ReactDOM from "react-dom";
import Router from "./Router";

require('file-loader?name=[name].[ext]!./index.html');
require('./styles/fonts.css');
require('./styles/buttons.css');

ReactDOM.render(    
    <Router />,
    document.getElementById("react")
);