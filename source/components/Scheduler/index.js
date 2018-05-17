// Core
import React from 'react';
import { func, string, bool, arrayOf, shape } from 'prop-types';
import Move from 'react-flip-move';

// Instruments
import Styles from "./styles.m.css";

// Components
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';
import Spinner from 'components/Spinner';

import withApi from 'components/HOC/withApi';

export class Scheduler extends React.Component {

    render () {
        const {
            isSpinnerShowing,
            tasks,
            tasksFilter,
            taskDescription,
            removeTask,
            updateTask,
            areAllTasksDone,
            filterTasksHandler,
            onNewTaskDescriptionChangeHandler,
            onAddTaskHandler,
            onCheckAllAsDoneHandler,
        } = this.props;

        const renderTasks = tasks
            .filter(({ message }) => message.toLowerCase().includes(tasksFilter))
            .map((task) => (<Task
                key = { task.id }
                removeTaskHandler = { removeTask }
                updateTask = { updateTask }
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
                            onChange = { filterTasksHandler }
                        />
                    </header>
                    <section>
                        <form>
                            <input
                                autoFocus
                                maxLength = { 50 }
                                placeholder = 'Описание моей новой задачи'
                                type = 'text'
                                value = { taskDescription }
                                onChange = { onNewTaskDescriptionChangeHandler }
                            />
                            <button onClick = { onAddTaskHandler }>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay } >
                            <ul>
                                <Move
                                    duration = { 250 }
                                    easing = 'ease-in-out'
                                    staggerDelayBy = { 100 }>
                                    {renderTasks}
                                </Move>
                            </ul>
                        </div>
                    </section>
                    <footer onClick = { onCheckAllAsDoneHandler }>
                        <Checkbox
                            inlineBlock
                            checked = { areAllTasksDone() }
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

Scheduler.propTypes = {
    areAllTasksDone:    func.isRequired,
    createTask:         func.isRequired,
    fetchTasks:         func.isRequired,
    filterTasksHandler: func.isRequired,
    isSpinnerShowing:   bool.isRequired,
    removeTask:         func.isRequired,
    taskDescription:    string.isRequired,
    tasks:              arrayOf(
        shape({
            id:        string.isRequired,
            message:   string.isRequired,
            completed: bool.isRequired,
            favorite:  bool.isRequired,
            created:   string.isRequired,
            modified:  string,
        })
    ).isRequired,
    tasksFilter:                       string.isRequired,
    updateTask:                        func.isRequired,
    onAddTaskHandler:                  func.isRequired,
    onCheckAllAsDoneHandler:           func.isRequired,
    onNewTaskDescriptionChangeHandler: func.isRequired,
};

export default withApi(Scheduler);
