// Core
import React, { Component } from "react";

// Imstruments
import { withSvg } from "instruments/withSvg";

class Checkbox extends Component {
    render () {
        const { checked, color1, color2, color3 } = this.props;

        const fill = checked ? color1 : color2;
        const checkBoxFill = checked ? color3 : color2;

        return (
            <g>
                <circle
                    cx = '12.5'
                    cy = '12.5'
                    fill = { fill }
                    height = '25'
                    r = '12.5'
                    stroke = { color1 }
                    strokeWidth = '0'
                    x = '1'
                    y = '1'
                />
                <polyline
                    fill = 'none'
                    points = '6,12.5 11,18 20,7'
                    stroke = { checkBoxFill }
                    strokeWidth = '2'
                />
            </g>
        );
    }
}

export default withSvg({
    viewBoxWidth:  27,
    viewBoxHeight: 27,
    width:         25,
    height:        25,
})(Checkbox);
