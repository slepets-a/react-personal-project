// Core
import React from 'react';
import cx from 'classnames';

// Instruments
import Styles from "./styles.m.css";

// Components
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';

class Task extends React.Component {
    constructor () {
        super();
        this.state = {
            isEditable:  false,
            description: '',
        };
        this.togglePriority = this._togglePriority.bind(this);
        this.toggleFulfillment = this._toggleFulfillment.bind(this);
        this.toggleEdit = this._toggleEdit.bind(this);
        this.onDescriptionChangeHandler = this._onDescriptionChangeHandler.bind(this);
        this.onKeyPressHandler = this._onKeyPressHandler.bind(this);
        this.onRemoveTaskHandler = this._onRemoveTaskHandler.bind(this);
    }

    _togglePriority () {
        const {
            id,
            toggleTaskPriority,
        } = this.props;

        toggleTaskPriority(id);
    }

    _toggleFulfillment () {
        const {
            id,
            toggleTaskFulfillment,
        } = this.props;

        toggleTaskFulfillment(id);
    }

    _toggleEdit () {
        const {
            message,
        } = this.props;

        this.setState(({ isEditable }) => ({
            isEditable:  !isEditable,
            description: message,
        }));
    }

    _onDescriptionChangeHandler ({ target: { value }}) {
        this.setState({
            description: value.slice(0, 50),
        });
    }

    _onKeyPressHandler ({ keyCode }) {
        const {
            id,
            updateTaskHandler,
        } = this.props;
        const {
            description,
        } = this.state;

        switch (keyCode) {
            case 13:
                updateTaskHandler(id, description);
                this.setState({
                    isEditable: false,
                });
                break;
            case 27:
                this.toggleEdit();
                break;
            default:
                // do nothing
        }
    }

    _onRemoveTaskHandler () {
        const {
            id,
            removeTaskHandler,
        } = this.props;

        removeTaskHandler(id);
    }

    render () {
        const {
            message,
            completed,
            favorite,
        } = this.props;
        const {
            isEditable,
            description,
        } = this.state;
        const taskStyle = cx(Styles.task, {
            [Styles.completed]: completed,
        });

        return (
            <li className = { taskStyle }>
                <div className = { Styles.content } >
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.complete }
                        color1 = '#3b8ef3'
                        color2 = '#fff'
                        onClick = { this.toggleFulfillment }
                    />
                    {
                        isEditable
                            ? (
                                <input
                                    autoFocus
                                    maxLength = { 50 }
                                    type = 'text'
                                    value = { description }
                                    onChange = { this.onDescriptionChangeHandler }
                                    onKeyUp = { this.onKeyPressHandler }
                                />
                            )
                            : <span>{ message }</span>
                    }

                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.setPriority }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this.togglePriority }
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.edit }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this.toggleEdit }
                    />
                    <Remove
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this.onRemoveTaskHandler }
                    />
                </div>
            </li>
        );
    }
}

export default Task;
