import { all } from 'redux-saga/effects';

import sagaCart from './cart/sagas';

export default function* rootSaga(): any {
    return yield all([
        sagaCart,
    ])
}