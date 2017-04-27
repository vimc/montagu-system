import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./components/Application";
import { mainActions } from './actions/MainActions';

require('file-loader?name=[name].[ext]!./index.html');
require('./styles/fonts.css');
require('./styles/buttons.css');

mainActions.fetch({});

ReactDOM.render(    
    <Application />,
    document.getElementById("react")
);