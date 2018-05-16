import React from 'react';

import { url, token } from 'config/api';
import moment from "moment/moment";

const withApi = (Enhanced) =>
    class WithApi extends React.Component {
        constructor () {
            super();
            this.state = {
                isSpinnerShowing: false,
                tasks:            [],
                tasksFilter:      '',
                taskDescription:  '',
            };
            // private
            this.showSpinner = this._showSpinner.bind(this);
            this.sortMethod = this._sortMethod.bind(this);
            this.sortTasks = this._sortTasks.bind(this);

            // public
            this.onAddTaskHandler = this._onAddTaskHandler.bind(this);
            this.onNewTaskDescriptionChangeHandler = this._onNewTaskDescriptionChangeHandler.bind(this);
            this.onCheckAllAsDoneHandler = this._onCheckAllAsDoneHandler.bind(this);
            this.areAllTasksDone = this._areAllTasksDone.bind(this);
            this.filterTasksHandler = this._filterTasksHandler.bind(this);

            // endpoint
            this.createTask = this._createTask.bind(this);
            this.fetchTasks = this._fetchTasks.bind(this);
            this.removeTask = this._removeTask.bind(this);
            this.updateTask = this._updateTask.bind(this);
        }

        componentDidMount () {
            this.fetchTasks();
        }

        _showSpinner (state) {
            this.setState({
                isSpinnerShowing: state,
            });
        }

        _sortMethod (firstTask, secondTask) {
            return moment(firstTask.created).valueOf() - moment(secondTask.created).valueOf();
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

            [...tasks].sort(this.sortMethod).forEach((task) => {
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

        _onAddTaskHandler (event) {
            const {
                taskDescription,
            } = this.state;

            event.preventDefault();
            if (taskDescription) {
                this.createTask(taskDescription);
            }
        }

        _onNewTaskDescriptionChangeHandler ({ target: { value }}) {
            this.setState({
                taskDescription: value.slice(0, 50),
            });
        }

        _onCheckAllAsDoneHandler () {
            const {
                tasks,
            } = this.state;

            if (!this.areAllTasksDone()) {
                this.updateTask(tasks.map(
                    (task) => ({
                        ...task,
                        completed: true,
                    })
                ));
            }
        }

        _areAllTasksDone () {
            const {
                tasks,
            } = this.state;

            return tasks.every((task) => task.completed);
        }

        _filterTasksHandler ({ target: { value }}) {
            this.setState({
                tasksFilter: value.toLowerCase(),
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
                }), () => {
                    this.sortTasks();
                });
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
                }), () => {
                    this.sortTasks();
                });
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

        async _updateTask (tasksList) {
            this.showSpinner(true);
            try {
                const response = await fetch(url, {
                    method:  'PUT',
                    headers: {
                        Authorization:  token,
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(tasksList),
                });

                const { data } = await response.json();

                if (response.status !== 200) {
                    throw new Error("Edit task failed");
                }

                // All tasks are sent to endpoint only after "All tasks done" checkboxes is checked
                // Otherwise we update only one task
                this.setState(
                    ({ tasks }) => data.length > 1
                        ? {
                            tasks: [...data],
                        }
                        : {
                            tasks: tasks.map(
                                (task) => task.id === data[0].id
                                    ? data[0]
                                    : task
                            ),
                        },
                    () => {
                        this.sortTasks();
                    }
                );
            } catch ({ message: errMessage }) {
                console.log(errMessage);
            } finally {
                this.showSpinner(false);
            }
        }

        render () {
            return (
                <Enhanced
                    { ...this.props }
                    { ...this.state }
                    areAllTasksDone = { this.areAllTasksDone }
                    createTask = { this.createTask }
                    fetchTasks = { this.fetchTasks }
                    filterTasksHandler = { this.filterTasksHandler }
                    removeTask = { this.removeTask }
                    updateTask = { this.updateTask }
                    onAddTaskHandler = { this.onAddTaskHandler }
                    onCheckAllAsDoneHandler = { this.onCheckAllAsDoneHandler }
                    onNewTaskDescriptionChangeHandler = { this.onNewTaskDescriptionChangeHandler }
                />
            );
        }
    };

export default withApi;