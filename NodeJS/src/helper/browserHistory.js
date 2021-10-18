import {createBrowserHistory, createMemoryHistory} from "history"

let history = createMemoryHistory();

if (typeof document !== 'undefined') {
    history = createBrowserHistory();
}

export default history;