import { AxiosResponse } from 'axios';
import { all, takeLatest, select, call, put } from 'redux-saga/effects';
import { IState } from '../..';
import api from '../../../services/api';
import { addProductToCartFailure, addProductToCartRequest, addProductToCartSuccess } from './actions';
import { ActionTypes } from './types';

interface IStock {
    id: number;
    quantity: number;
}

//Tipando o retorno da action ADD_PRODUCT_TO_CART
type CheckStockProductRequest = ReturnType<typeof addProductToCartRequest>;

// Função disparada toda vez que a função ADD_PRODUCT_TO_CART é disparada
//Função interceptadora (MIDDLEWARE) entre a Action ADD_PRODUCT_TO_CART e o reducer de carrinho
function* checkProductStock(action: CheckStockProductRequest) {
    //alert('Verificando produto no estoque');
    //console.log(action.payload);

   //Recuperando produto que está tentando ser inserido no carrinho
    const { product } = action.payload;

    //Buscando do estado a quantidade atual que eu tenho desse produto no meu carrinho 
    const currentQuantity: number = yield select((state: IState) => {
        return state.cart.items.find(item => product.id === item.product.id)?.quantity ?? 0;
    });

    // Realizando chamada a api de stock para veridicar se o produto esxiste no stock
    const availableStockResponse: AxiosResponse<IStock> = yield call(api.get, `stock/${product.id}`);

    //Verificando se o produto será adicionado ao carrinho ou não
    if (availableStockResponse.data.quantity === currentQuantity) {
        //Se a verificação a API de estoque der sucesso eu disparo a Action ADD_PRODUCT_TO_CART_SUCCESS
        yield put(addProductToCartSuccess(product))
    } else {
        /* Se a verificação a API de estoque der sucesso eu disparo a Action ADD_PRODUCT_TO_CART_FAILURE
         que vai sinalizar a aplicação que aquele produto não está disponível em estoque */
        yield put(addProductToCartFailure(product.id));
    }
}

export default all([
    takeLatest(ActionTypes.addProductToCartRequest, checkProductStock)
]);

/*
    takeLatest (mais utilizado) -> É utilizado em cenários onde o usuário 
    pode clicar multiplas vezes em um botão e acabar realizando várias requisições a api. 
    O takeLatest vai considerar somente a ultima chamada a API e desconsiderar as anteriores 
    (os cliks anteriores)
    -> Só aguarda a ultima ação ser finalizada (a ultima chamada a API)

    takeEvery -> Direferente do takeLatest conseideraria todas as ações de click e 
    consequentemente realizaria todas as requisições a API.
    -> Aguarda todas as ações serem finalizadas

    takeLeading -> Discarata as 4 ultimas solicitações e considera somente a primeira 

    select() -> método usando para buscar informações do meu estado. Onde recebo o meu state
    e defino quais informações eu quero buscar de meu state

    call() -> No saga devemos utilizar o método call para realizar chamadas a api. Sendo 
    que o primeiro parâmetro que ele recebe é qual ação assíncrona (podendo ser qualquer Promise) 
    queremos executar e como segundo parâmetro recebe os parâmetros do método do primeiro 
    argumento.

    put() -> Serve para a mesma coisa que o dispatch, ou seja, serve para disparar
    uma ação.

    OBS: TODO MÉTODO QUE VEM DO REDUX-SAGA PRECISA TER O YIELD NA FRENTE
*/
