// Reducer -> Retona os dados do cart

import produce from "immer";
import { Reducer } from "redux";
import { ActionTypes, ICartState } from './types';

//Valor inicial do reducer de cart
const INITIAL_STATE: ICartState = {
    items: [], //Armazena array de produtos do carrinho
    faildStockCheck: [], //Armazenar array dos produtos que falharam na checagem de stock (que estão sem stock)
}

const cart: Reducer<ICartState> = (state = INITIAL_STATE, action) => {
    //console.log(state, action)

    return produce(state, draft => {
        switch(action.type) {
             //Só adicionar o produto ao carrinho se a chamada a API que verifica o estoque der sucesso
            // Por isso o reducer escuta a ação ADD_PRODUCT_TO_CART_SUCCESS e não a ADD_PRODUCT_TO_CART_REQUEST
            // Esse reducer só será disparado se a ação ADD_PRODUCT_TO_CART_SUCCESS for disparada
            case ActionTypes.addProductToCartSuccess:
                const { product } = action.payload;
    
                const productInCartIndex = state?.items.findIndex(item => 
                    item.product.id === product.id,
                );
                
                if (productInCartIndex >= 0) {
                    draft.items[productInCartIndex].quantity++;
                } else {
                    draft.items.push({
                        product,
                        quantity: 1,
                    })
                }
                break;
            // Ouvindo Ação de falha do Reducer
            case ActionTypes.addProductToCartFailure:{
                //console.log('Failure', action.payload);
                draft.faildStockCheck.push(action.payload.productId)
                break;
            }
            default:
                return state;
        }
    })
}

export default cart;