/**
 * Created by Administrator on 2017/4/3.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/RootReducer';

const configureStore = initLoadedState => {
    return createStore (
        rootReducer,
        initLoadedState,
        compose (
            applyMiddleware(thunk,logger)
        )
    );
};

const store = configureStore();

export default store;