import { combineReducers, createStore } from "redux";

const initialState = { current_post: null }

type PostReducerAction = {
    payload: Post
    type: string
}

const postsReducer = (state = initialState.current_post, action:PostReducerAction) => {
    switch (action.type) {
        case 'SET_CURRENT_POST':
            return action.payload;
        case 'CLEAN_POST':
            return null;
        default:
            return state;
    }
};

const sharingPostsReducer = (state = initialState.current_post, action:PostReducerAction) => {
    switch (action.type) {
        case 'SET_CURRENT_SHARING_POST':
            return action.payload;
        case 'CLEAN_SHARING_POST':
            return null;
        default:
            return state;
    }
};

const loginReducer = (state = initialState.current_post, action:PostReducerAction) => {
    switch (action.type) {
        case 'SHOW_LOGIN_FORM':
            return true
        case 'CLEAN_LOGIN':
            return null;
        default:
            return state;
    }
};

const reducer = combineReducers({
    current_post: postsReducer,
    sharing_post: sharingPostsReducer,
    login: loginReducer
});

// Crea el store de Redux utilizando el reducer
const store = createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()

);

export default store;
