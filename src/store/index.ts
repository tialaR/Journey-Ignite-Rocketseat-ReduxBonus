import { applyMiddleware, createStore } from 'redux';
import { ICartState } from './modules/cart/types';

import createSagaMiddleware from '@redux-saga/core';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

export interface IState {
    cart: ICartState; //Reducer de carrinho
}

//Redux Saga - Criando middleware
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

//Criando Store (Estado global)
const store = createStore(
    rootReducer, //Root Reducer contem todas as stores
    applyMiddleware(...middlewares) //Inserindo middlewares na store
); 

sagaMiddleware.run(rootSaga); //Root Saga contém todos os saga middlewares (interceptadores de actions)

export default store;