import { combineReducers, createStore } from "redux";

const initialState = { current_post: null }

const postsReducer = (state = initialState.current_post, action) => {
    switch (action.type) {
        case 'SET_CURRENT_POST':
            return action.payload;
        case 'CLEAN_POST':
            return null;
        default:
            return state;
    }
};

const sharingPostsReducer = (state = initialState.current_post, action) => {
    switch (action.type) {
        case 'SET_CURRENT_SHARING_POST':
            return action.payload;
        case 'CLEAN_SHARING_POST':
            return null;
        default:
            return state;
    }
};

const reducer = combineReducers({
    current_post: postsReducer,
    sharing_post: sharingPostsReducer,
});

// Crea el store de Redux utilizando el reducer
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

);

export default store;
