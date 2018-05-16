// Core
import React from 'react';
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
                toggleTaskFulfillment = { updateTask }
                toggleTaskPriority = { updateTask }
                updateTaskHandler = { updateTask }
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

export default withApi(Scheduler);
