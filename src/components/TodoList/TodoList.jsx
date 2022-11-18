import "./_TodoList.less"
import {useState} from "react";
// /* eslint-disable */

function TodoList(props) {

    //- Далее хуки состояния

    const [list, setList] = useState([])
    const [inputText, setInputText] = useState("");
    const [inputTextInfo, setInputTextInfo] = useState("");
    const [inputFile, setInputFile] = useState("");
    const [inputValid, setInputValid] = useState(true)
    const [inputFileValid, setInputFileValid] = useState(true)
    const [time, setTime] = useState('')

    //- Отправка родителю

    /**
     * отправка времени в родитель
     */
    const sendToParent = () => {
        props.HandleChild(time)
    }
    sendToParent()


    //- Далее функционал компонента

    /**
     * Получение даты
     * @param date
     * @returns {{h: string, y: string}}
     */
    const nowDate = new Date();
    const date = (date) => {
        let hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
            minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
            seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        let newHours = `${hours}:${minutes}:${seconds}`
        let newYear = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
        setTime(newHours + ' ' + newYear)
        return {
            h: newHours,
            y: newYear
        }
    }
    setTimeout(() => date(nowDate), 1000)

    /**
     *
     * @param i - индекс тодо
     * @param nameProp - свойство объекта
     * @param value - значение для свойства объекта
     */
    const changeValue = (i, nameProp, value) => {
        setList(list.map(obj => {
            if (obj.id === i) {
                if (nameProp === 'disabled') value = toggleValue(obj.disabled);
                if (nameProp === 'statusClosed') {
                    value = value.h + ' ' + value.y;
                    obj['btnTodoStatus'] = false;
                }
                if (nameProp === 'file') {

                    obj['file'] = value;
                }
                return {...obj, [nameProp]: value};
            } else {
                return obj;
            }
        }));
    }
    /**
     * Меняет булевое значение на противоположное
     * @param val параметр
     * @returns {boolean}
     */
    const toggleValue = (val) => !val
    /**
     *
     * @param e - событие инпута
     * @param i - id тодо объекта
     * @param file - файл добавленный в инпут
     */
    const changeFile = (e, file, i) => changeValue(i, "file", file)
    const changeText = (e, i) => changeValue(i, "todo", e.target.value)
    const changeTextInfo = (e, i) => changeValue(i, "todoInfo", e.target.value)
    const toggleDisableValue = (e, i) => changeValue(i, "disabled")
    const statusClosedTodo = (e, i) => changeValue(i, "statusClosed", date(nowDate))

    /**
     * @description - проверяет размер файла, если всё ок то добавляет в state inputFile
     * @param e - event
     * @param check - своеобразная проверка для определения в какой инпут добавляем файлы
     // * @returns {null|void}
     */
    const checkFile = (e, check) => {
        let file;
        if (e) {
            setInputFileValid(true)
            file = e.target.files[0]
        }

        if ((file.size / 1000) > 6000) {
            console.log('Размер файла должен быть не больше 6 мб:', file.size / 1000)
            setInputFile('')
            setInputFileValid(false)
            return 'big-file'
        } else {
            if (check) return
            return  setInputFile(file)
        }
    }
    /**
     * Конкатенация строк ВЫБРАН ФАЙЛ: <название файла>
     * @param val - объект
     * @returns {string}
     */
    const getFileName = (val) => val && `Выбран файл: ${val.name}`

    /**
     * Создание объекта туду
     * возвращает объект туду элемента
     * @param obj - объект с данными
     * @returns {{todo: string, file: string, btnTodoStatus: boolean, disabled: boolean, id: number, todoInfo: string, initTime: string}}
     */
    const newTodo = (obj) => {
        const newList = {
            id: Math.random(),
            todo: obj.inputText,
            todoInfo: obj.inputTextInfo,
            file: obj.inputFile,
            disabled: true,
            initTime: date(nowDate).h + ' ' + date(nowDate).y,
            btnTodoStatus: true
        }
        return newList;
    }
    /**
     * Добавление туду
     * @param obj - объект, элемент туду
     */
    const addTodo = (obj) => {
        setInputValid(true)

        if (!obj.inputText) {
            setInputValid(false)
            return
        }
        setList([...list, newTodo(obj)])

        changeInputText()
        changeInputTextInfo()

        setInputFile("")
    }
    /**
     * Удаление туду
     * @param e - event
     * @param i - index тодо
     */
    const removeTodo = (e, i) => {
        setList(list.filter(obj => {
            if (obj.id !== i) {
                return obj
            }
        }));
    }

    //- Далее замены у инпутов отображений текстов
    /**
     * Замена текста отображение у инпутов
     * @param e - event
     * @param id - id тодо
     * @param file - файл
     */
    const changeInputFile = (e, id, file) => e ? changeFile(e, file, id) : setInputFile('')
    const changeInputText = (e) => e ? setInputText(e.target.value) : setInputText('')
    const changeInputTextInfo = (e) => e ? setInputTextInfo(e.target.value) : setInputTextInfo('')
    const changeInputTextById = (e, id) => e ? changeText(e, id) : setInputText('')
    const changeInputTextInfoById = (e, id) => e ? changeTextInfo(e, id) : setInputTextInfo('')


    //- Далее рендеры элементов JSX
    /**
     * Рендер инпута
     * @returns {JSX.Element|null}
     */
    const renderInput = () => {
        if (!inputFile) {
            return (
                <input type="file"
                       value={inputFile ? 'null' : inputFile }
                       onChange={e => checkFile(e)}
                />
            )
        }
        return null
    }
    /**
     * Рендер инпута [type=file]
     * @param file - файл, для проверки
     * @param id - index тодо
     * @returns {JSX.Element}
     */
    const renderInputFile = (file, id) => {
        if (!file) {
            return (
                <input
                    className="Todo-list__list_info_file-input"
                    type="file"
                    onChange={e => {
                        const callback = checkFile(e, 'no-main');
                        if (callback) {
                            e.target.value = null;
                            return
                        }
                        changeInputFile(e, id, e.target.files[0])
                    }}
                />
            )
        }
    }
    /**
     * Рендер кнопки удаления файла у элемента туду
     * @param id - index
     * @param file - файл
     * @returns {JSX.Element}
     */
    const renderButtonRemoveFile = (id, file) => {
        if (file) {
            return (
                <button className="Todo-list__list_info_file-remove" onClick={e => changeInputFile(e, id, null)}>
                    &#10006;
                </button>
            )
        }
    }
    /**
     * Рендер span с текстом
     * @param condition - условие для показа этого рендера
     * @param showText - какой текст показать в span
     * @returns {JSX.Element}
     */
    const renderSpan = (condition, showText) => {
        if (condition) {
            return (
                <span className="Todo-list__list_info_file-input">{showText}</span>
            )
        }
    }
    /**
     * Рендер оповещения юзера
     * @returns {JSX.Element}
     */
    const renderAlert = () => {
        const nullInput = <label className="Todo-list__err">Write something</label>;
        const bigFile = <label className="Todo-list__err">The size of your file should not exceed 6 MB</label>;

        if (!inputFileValid) return bigFile
        else if (!inputValid) return (nullInput)
    }

    //- Далее рендер всего компонента
    return (
        <div className="Todo-list container">
            <div className="Todo-list__new-todo">
                {renderAlert()}
                <div className="d-flex flex-column col-8 gap-2">
                    <input
                        type="text"
                        placeholder="Write your todo"
                        value={inputText}
                        onChange={changeInputText}
                    />
                    <input
                        type="text"
                        placeholder="Write your todo information"
                        value={inputTextInfo}
                        onChange={changeInputTextInfo}
                    />
                </div>
                <div className="d-flex flex-column col-4 gap-2">
                    <div className={inputFile ? "Todo-list__new-todo_input file" : "Todo-list__new-todo_input"}>
                        { renderInput() }
                        { getFileName(inputFile) }
                    </div>
                    <button onClick={() => addTodo({inputText, inputTextInfo, inputFile})}>Add</button>
                </div>
            </div>
            <div className="Todo-list__list">
                <ul>
                    {list.map((todo, index)=> (
                        <li key={todo.id}
                            className={"Todo-list__list_li" + (!todo.btnTodoStatus ? ' todo-completed' : '')}
                        >
                            <div className="Todo-list__list_info">
                                <div
                                    className={(todo.disabled ? "disable" : "undisable") +
                                    " Todo-list__list_info_title d-flex flex-column gap-2"}
                                >
                                    <input disabled={todo.disabled}
                                           value={todo.todo}
                                           onChange={e => changeInputTextById(e, todo.id)}
                                    />
                                    <input disabled={todo.disabled}
                                           value={todo.todoInfo}
                                           onChange={e => changeInputTextInfoById(e, todo.id)}
                                    />
                                    {/*<span>{list[index].disabled}</span>*/}
                                    <button
                                        className="Todo-list__list_info_edits"
                                        onClick={e => toggleDisableValue(e, todo.id)}
                                    >
                                        &#9998;
                                    </button>
                                </div>
                                <div className="Todo-list__list_info_file d-flex">
                                    { renderButtonRemoveFile(todo.id, todo.file) }
                                    { renderInputFile(todo.file, todo.id) }
                                    { todo.file && renderSpan(todo.file, todo.file.name) }
                                </div>
                            </div>
                            <p className="Todo-list__list_date">
                                <span>Создана: {todo.initTime}</span>
                                <button
                                    onClick={e => statusClosedTodo(e, todo.id)}
                                    disabled={!todo.btnTodoStatus}
                                >Закрыть задачу</button>
                                <span>{todo.statusClosed && 'Закрыта: '+todo.statusClosed}</span>
                            </p>
                            <div
                                className="Todo-list__list_close"
                                onClick={(e) => removeTodo(e, todo.id)}
                            >&#10006;</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default TodoList;
