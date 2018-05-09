// Core
import React from "react";

// Instruments
import Styles from "./styles.m.css";

// Components
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';

class Scheduler extends React.Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'text' />
                    </header>
                    <section>
                        <form>
                            <input placeholder = 'Описание моей новой задачи' type = 'text' />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay } >
                            <ul>
                                <Task />
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            inlineBlock
                            checked = { false }
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
