// Core
import React from "react";
import { createPortal } from "react-dom";

// Instruments
import Styles from "./styles.m.css";

const portal = document.getElementById('spinner');

const Spinner = ({ isSpinning }) => createPortal(
    isSpinning ?
        <div className = { Styles.spinner }>
            <div className = { Styles.loader } />
        </div> :
        null,
    portal,
);

export default Spinner;
