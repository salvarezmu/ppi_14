import './CategoriesDetailPage.css';
import {useLocation} from "react-router-dom";
import {CategoryTransaction} from "../../../types/CategoryTransaction";

export function CategoriesDetailPage() {
    const transaction: CategoryTransaction = useLocation().state?.blockNumber;
    return (
        <>
            <p>Hola, ¿ Cómo estás ?</p>
            <p>{transaction[0]}</p>
        </>
    )
}