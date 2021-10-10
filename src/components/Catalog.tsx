import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { IProduct } from '../store/modules/cart/types';
import { CatalogItem } from '../components/CatalogItem';

const Catalog: React.FC = () => {
    const [catalog, setCatalog] = useState<IProduct[]>([]);

    useEffect(() => {
        api.get('products').then(res => {
            setCatalog(res.data);
        })
    },[]);
    
    return (
        <main>
            <h1>Catalog</h1>
             
            {catalog.map(product => (
                <CatalogItem product={product} />
            ))}
        </main>
    );
}

export { Catalog };