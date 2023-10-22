import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {RoutesConstants} from './constants/RoutesConstants';
import HomePage from "./pages/home/HomePage";
import TransaccionesEnBloque from './pages/blockTransactions/transaccionesEnBloque';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={RoutesConstants.BLOCK_TRANSACTIONS} element={<TransaccionesEnBloque/>}></Route>
                <Route path={RoutesConstants.HOME_PAGE} element={<HomePage/>}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
