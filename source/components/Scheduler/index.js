// Core
import React from "react";

import { url, token } from 'config/api';

// Instruments
import Styles from "./styles.m.css";
import moment from 'moment';

// Components
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';
import Spinner from 'components/Spinner';

class Scheduler extends React.Component {
    constructor () {
        super();
        this.state = {
            isSpinnerShowing: false,
            tasks:            [],
            tasksFilter:      '',
            taskDescription:  '',
        };
        this.onAddTaskHandler = this._onAddTaskHandler.bind(this);
        this.onInputChangeHandler = this._onInputChangeHandler.bind(this);
        this.sortTasks = this._sortTasks.bind(this);
        // this.toggleTaskPriority = this._toggleTaskPriority.bind(this);
        this.toggleTaskFulfillment = this._toggleTaskFulfillment.bind(this);
        this.updateTaskHandler = this._updateTaskHandler.bind(this);
        this.onCheckAllAsDoneHandler = this._onCheckAllAsDoneHandler.bind(this);
        this.areAllTasksDone = this._areAllTasksDone.bind(this);
        this.filterTasksHandler = this._filterTasksHandler.bind(this);
        this.showSpinner = this._showSpinner.bind(this);
        this.fetchTasks = this._fetchTasks.bind(this);
        this.createTask = this._createTask.bind(this);
        this.removeTask = this._removeTask.bind(this);
        this.updateTask = this._updateTask.bind(this);
    }

    componentDidMount () {
        this.fetchTasks();
        this.sortTasks();
    }

    _onAddTaskHandler (event) {
        const {
            taskDescription,
        } = this.state;

        event.preventDefault();
        if (taskDescription) {
            this.createTask(taskDescription);
            this.sortTasks();
        }
    }

    _onInputChangeHandler ({ target: { value }}) {
        this.setState({
            taskDescription: value.slice(0, 50),
        });
    }

    // _toggleTaskPriority (id) {
    //     this.setState(({ tasks }) => ({
    //         tasks: tasks.map(
    //             (task) => task.id === id
    //                 ? { ...task, favorite: !task.favorite }
    //                 : task
    //         ),
    //     }), () => {
    //         this.sortTasks();
    //     });
    // }

    _toggleTaskFulfillment (id) {
        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            ),
        }), () => {
            this.sortTasks();
        });
    }

    _areAllTasksDone () {
        const {
            tasks,
        } = this.state;

        return tasks.every((task) => task.completed);
    }

    _filterTasksHandler ({ target: { value }}) {
        this.setState({
            tasksFilter: value,
        });
    }

    _sortTasks () {
        const {
            tasks,
        } = this.state;
        const sortedTasks = {
            favorite:  [],
            regular:   [],
            completed: [],
        };

        tasks.forEach((task) => {
            if (task.completed) {
                sortedTasks.completed.push(task);
            } else if (task.favorite) {
                sortedTasks.favorite.push(task);
            } else {
                sortedTasks.regular.push(task);
            }
        });

        this.setState({
            tasks: [
                ...sortedTasks.favorite,
                ...sortedTasks.regular,
                ...sortedTasks.completed
            ],
        });
    }

    _updateTaskHandler (id, description) {
        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === id
                    ? { ...task, message: description }
                    : task,
            ),
        }));
    }

    _onCheckAllAsDoneHandler () {
        if (!this.areAllTasksDone()) {
            this.setState(({ tasks }) => ({
                tasks: tasks.map((task) => ({
                    ...task,
                    completed: true,
                })),
            }));
        }
    }

    _showSpinner (state) {
        this.setState({
            isSpinnerShowing: state,
        });
    }

    async _fetchTasks () {
        this.showSpinner(true);
        try {
            const response = await fetch(url, {
                method:  'GET',
                headers: {
                    Authorization:  token,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Fetch tasks failed");
            }
            const { data } = await response.json();

            this.setState(({ tasks }) => ({
                tasks: [...data, ...tasks],
            }));
        } catch ({ message }) {
            console.log(message);
        } finally {
            this.showSpinner(false);
        }
    }

    async _createTask (message) {
        this.showSpinner(true);
        try {
            const response = await fetch(url, {
                method:  'POST',
                headers: {
                    Authorization:  token,
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (response.status !== 200) {
                throw new Error("Create task failed");
            }
            const { data } = await response.json();

            this.setState(({ tasks }) => ({
                tasks:           [data, ...tasks],
                taskDescription: '',
            }));
        } catch ({ message: errMessage }) {
            console.log(errMessage);
        } finally {
            this.showSpinner(false);
        }
    }

    async _removeTask (id) {
        this.showSpinner(true);
        try {
            const response = await fetch(`${url}/${id}`, {
                method:  'DELETE',
                headers: {
                    Authorization: token,
                },
            });

            if (response.status !== 204) {
                throw new Error("Remove task failed");
            }

            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        } catch ({ message: errMessage }) {
            console.log(errMessage);
        } finally {
            this.showSpinner(false);
        }
    }

    async _updateTask ({ id, message, completed, favorite }) {
        this.showSpinner(true);
        try {
            const response = await fetch(url, {
                method:  'PUT',
                headers: {
                    Authorization:  token,
                    'Content-Type': "application/json",
                },
                body: JSON.stringify([{
                    id,
                    message,
                    completed,
                    favorite,
                }]),
            });

            const { data } = await response.json();

            console.log(data);

            if (response.status !== 200) {
                throw new Error("Edit task failed");
            }

            this.setState(({ tasks }) => ({
                tasks: tasks.map(
                    (task) => task.id === data[0].id
                        ? {
                            ...data[0],
                        }
                        : task
                ),
            }));
        } catch ({ message: errMessage }) {
            console.log(errMessage);
        } finally {
            this.showSpinner(false);
        }
    }

    render () {
        const {
            isSpinnerShowing,
            tasks,
            tasksFilter,
            taskDescription,
        } = this.state;

        const renderTasks = tasks
            .filter(({ message }) => message.includes(tasksFilter))
            .map((task) => (<Task
                key = { task.id }
                removeTaskHandler = { this.removeTask }
                toggleTaskFulfillment = { this.toggleTaskFulfillment }
                toggleTaskPriority = { this.updateTask }
                updateTaskHandler = { this.updateTaskHandler }
                { ...task }
            />));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isSpinnerShowing } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'text'
                            value = { tasksFilter }
                            onChange = { this.filterTasksHandler }
                        />
                    </header>
                    <section>
                        <form>
                            <input
                                autoFocus
                                maxLength = { 50 }
                                placeholder = 'Описание моей новой задачи'
                                type = 'text' value = { taskDescription }
                                onChange = { this.onInputChangeHandler }
                            />
                            <button onClick = { this.onAddTaskHandler }>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay } >
                            <ul>
                                {renderTasks}
                            </ul>
                        </div>
                    </section>
                    <footer onClick = { this.onCheckAllAsDoneHandler }>
                        <Checkbox
                            inlineBlock
                            checked = { this.areAllTasksDone() }
                            color1 = '#363636'
                            color2 = '#fff'
                        />
                        <span className = { Styles.completeAllTasks } >Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}

export default Scheduler;
