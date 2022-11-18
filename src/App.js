import TodoList from './components/TodoList/TodoList.jsx'

import './App.css';
import './styles/less/main.css';
import {useState} from "react";

function App() {
    const [time, setTime] = useState()
    /**
     * Событие из дочернего компонента
     * @param data
     */
    const GetFilterData = (data) => {
        //*****WRAP useState VARIABLE INSIDE setTimeout WITH 0 TIME AS BELOW.*****
        setTimeout(() => setTime(data), 0);
    }
    return (
        <div className="App">
          <header className="App-header container">
            <h1>Todo list</h1>
            <span>Создано: 17.11.2022</span>
            <span>Время: {time}</span>
          </header>
          <TodoList HandleChild={GetFilterData}/>
        </div>
    );
}

export default App;
