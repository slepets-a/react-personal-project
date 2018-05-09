// Core
import React from 'react';

// Instruments
import Styles from "./styles.m.css";

// Components
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';

class Task extends React.Component {
    render () {
        return (
            <li className = { Styles.task }>
                <div className = { Styles.content } >
                    <Checkbox
                        inlineBlock
                        checked = { false }
                        className = { Styles.complete }
                        color1 = '#3b8ef3'
                        color2 = '#fff'
                    />
                    <input type = 'text' />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        className = { Styles.setPriority }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.edit }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                    <Remove
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                </div>
            </li>
        );
    }
}

export default Task;
