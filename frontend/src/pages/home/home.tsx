import React from "react";
import { Link } from 'react-router-dom';
import { RoutesConstants } from "../../constants/RoutesConstants";
import './home.css'

const Home = () => {
    return (
        <div>
          <Link to={RoutesConstants.TRANSACTIONS}>
            <button>Transacciones</button>
          </Link>
          <Link to={RoutesConstants.VALIDATE_PAGE}>
            <button>Validar dirección</button>
          </Link>
          <Link to={RoutesConstants.BLOCKTRANSACTIONS}>
            <button>Transacciones bloque</button>
          </Link>
        </div>
      );
    };

export default Home