// Core
import React from 'react';
import { func, string, bool } from 'prop-types';
import cx from 'classnames';

// Instruments
import Styles from "./styles.m.css";

// Components
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';

class Task extends React.PureComponent {
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
            message,
            completed,
            favorite,
            updateTask,
        } = this.props;

        updateTask([{
            id,
            message,
            completed,
            favorite: !favorite,
        }]);
    }

    _toggleFulfillment () {
        const {
            id,
            message,
            completed,
            favorite,
            updateTask,
        } = this.props;

        updateTask([{
            id,
            message,
            completed: !completed,
            favorite,
        }]);
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
            completed,
            favorite,
            updateTask,
        } = this.props;
        const {
            description,
        } = this.state;

        switch (keyCode) {
            case 13:
                updateTask([{
                    id,
                    message: description,
                    completed,
                    favorite,
                }], () => {
                    this.setState({
                        isEditable: false,
                    });
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
            <li className = { Styles.task }>
                <div className = { Styles.content } >
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.complete }
                        color1 = '#56d26c'
                        color2 = '#3f4d5c'
                        color3 = '#fcfefc'
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
                        color1 = '#ffc868'
                        color2 = '#3f4d5c'
                        onClick = { this.togglePriority }
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.edit }
                        color1 = '#56d26c'
                        color2 = '#3f4d5c'
                        onClick = { this.toggleEdit }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.remove }
                        color1 = '#ff5358'
                        color2 = '#3f4d5c'
                        onClick = { this.onRemoveTaskHandler }
                    />
                </div>
            </li>
        );
    }
}

Task.propTypes = {
    completed:         bool.isRequired,
    favorite:          bool.isRequired,
    id:                string.isRequired,
    message:           string.isRequired,
    removeTaskHandler: func.isRequired,
    updateTask:        func.isRequired,
};

export default Task;
