import "./index.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";

import { PageComponent } from "./components/page";

ReactDOM.render(
    <PageComponent />,
    document.getElementById("root"),
);
