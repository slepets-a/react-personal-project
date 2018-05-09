// Core
import React from "react";

// Instruments
import Styles from "./styles.m.css";

export default class Spinner extends React.Component {
    render () {
        const { spin } = this.props;

        return spin ? <div className = { Styles.spin } /> : null;
    }
}
