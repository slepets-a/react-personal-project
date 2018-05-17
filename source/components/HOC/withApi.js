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
            this.fetchWrapper = this._fetchWrapper.bind(this);

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

        async _fetchWrapper (endpoint, method, body) {
            const correctResponseStatus = method === 'DELETE' ? 204 : 200;

            this.showSpinner(true);
            try {
                const response = await fetch(endpoint, {
                    method,
                    headers: {
                        Authorization:  token,
                        "Content-Type": "application/json",
                    },
                    body,
                });

                const { status } = response;

                if (status !== correctResponseStatus) {
                    throw new Error(`Fetch ${method} request failed`);
                }

                if (status === 200) {
                    const { data } = await response.json();

                    return data;
                }
            } catch ({ errMessage }) {
                console.log(errMessage);
            } finally {
                this.showSpinner(false);
            }
        }

        async _fetchTasks () {
            const data = await this.fetchWrapper(url, 'GET');

            this.setState(({ tasks }) => ({
                tasks: [...data, ...tasks],
            }), () => {
                this.sortTasks();
            });
        }

        async _createTask (message) {
            const data = await this.fetchWrapper(url, 'POST', JSON.stringify({ message }));

            this.setState(({ tasks }) => ({
                tasks:           [data, ...tasks],
                taskDescription: '',
            }), () => {
                this.sortTasks();
            });
        }

        async _removeTask (id) {
            await this.fetchWrapper(`${url}/${id}`, 'DELETE');

            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        }

        async _updateTask (tasksList) {
            const data = await this.fetchWrapper(url, 'PUT', JSON.stringify(tasksList));

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
