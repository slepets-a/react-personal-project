// Core
import React from "react";

// Instruments
import Styles from "./styles.m.css";
import moment from 'moment';

// Components
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';

class Scheduler extends React.Component {
    constructor () {
        super();
        this.state = {
            tasks: [
                {
                    "id":        "xjh",
                    "message":   "Успешно пройти React-интенсив компании Lectrum",
                    "completed": false,
                    "favorite":  true,
                },
                {
                    "id":        "xjr",
                    "message":   "Взять автограф у Джареда Лето",
                    "completed": false,
                    "favorite":  false,
                },
                {
                    "id":        "xrh",
                    "message":   "Зарегестрировать бабушку в Твиче",
                    "completed": false,
                    "favorite":  false,
                },
                {
                    "id":        "xpa",
                    "message":   "Stop being such retard",
                    "completed": false,
                    "favorite":  true,
                },
                {
                    "id":        "rjh",
                    "message":   "Записать собаку на груминг",
                    "completed": false,
                    "favorite":  false,
                },
                {
                    "id":        "xph",
                    "message":   "Научиться играть на барабанах",
                    "completed": true,
                    "favorite":  false,
                }
            ],
            tasksFilter:     '',
            taskDescription: '',
        };
        this.onAddTaskHandler = this._onAddTaskHandler.bind(this);
        this.onInputChangeHandler = this._onInputChangeHandler.bind(this);
        this.sortTasks = this._sortTasks.bind(this);
        this.toggleTaskPriority = this._toggleTaskPriority.bind(this);
        this.toggleTaskFulfillment = this._toggleTaskFulfillment.bind(this);
        this.updateTaskHandler = this._updateTaskHandler.bind(this);
        this.removeTaskHandler = this._removeTaskHandler.bind(this);
        this.onCheckAllAsDoneHandler = this._onCheckAllAsDoneHandler.bind(this);
        this.areAllTasksDone = this._areAllTasksDone.bind(this);
        this.filterTasksHandler = this._filterTasksHandler.bind(this);
    }

    componentWillMount () {
        this.sortTasks();
    }

    _onAddTaskHandler (event) {
        const {
            taskDescription,
        } = this.state;
        const currentTimeStamp = moment().format("MMMM D h:mm:ss a");

        event.preventDefault();
        if (taskDescription) {
            this.setState(({ tasks }) => ({
                tasks: [{
                    id:        `123ss${Math.random()}`,
                    message:   taskDescription,
                    completed: false,
                    favorite:  false,
                    created:   currentTimeStamp,
                    modified:  currentTimeStamp,
                }, ...tasks],
                taskDescription: '',
            }), () => {
                this.sortTasks();
            });
        }
    }

    _onInputChangeHandler ({ target: { value }}) {
        this.setState({
            taskDescription: value.slice(0, 50),
        });
    }

    _toggleTaskPriority (id) {
        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === id
                    ? { ...task, favorite: !task.favorite }
                    : task
            ),
        }), () => {
            this.sortTasks();
        });
    }

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

    _removeTaskHandler (id) {
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((post) => post.id !== id),
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

    render () {
        const {
            tasks,
            tasksFilter,
            taskDescription,
        } = this.state;

        const renderTasks = tasks
            .filter(({ message }) => message.includes(tasksFilter))
            .map((task) => (<Task
                key = { task.id }
                removeTaskHandler = { this.removeTaskHandler }
                toggleTaskFulfillment = { this.toggleTaskFulfillment }
                toggleTaskPriority = { this.toggleTaskPriority }
                updateTaskHandler = { this.updateTaskHandler }
                { ...task }
            />));

        return (
            <section className = { Styles.scheduler }>
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
