import React from "react";

import Styles from "./styles.m";

class Scheduler extends React.Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Title</h1>
                        <input placeholder = 'first input' type = 'text' />
                    </header>
                    <input placeholder = 'second input' type = 'text' />
                    <section>
                        <form action = ''>
                            <input placeholder = 'Form input' type = 'text' />
                            <button>Button</button>
                        </form>
                        <div className = 'overlay' />
                        <ul />
                    </section>
                    <div className = 'footer'>
                        <div />
                        <div className = 'completeAllTasks' />
                    </div>
                </main>
            </section>
        );
    }
}

export default Scheduler;
