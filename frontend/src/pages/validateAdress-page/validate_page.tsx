import React, { useState } from 'react';
import axios from 'axios';
import './validate_page.css';

const ValidateAddress: React.FC = () => {
  // Estado para almacenar la dirección ingresada por el usuario
  const [address, setAddress] = useState<string>('');
  
  // Estado para almacenar si la dirección es válida o no
  const [isValid, setIsValid] = useState<boolean | null>(null);
  
  // Estado para almacenar la información de la cuenta, si es válida
  const [accountInfo, setAccountInfo] = useState<any>(null);

  // Función para validar la dirección ingresada por el usuario
  const validateAddress = async () => {
    try {
      // Realiza una solicitud POST a la API para validar la dirección
      const response = await axios.post(
        'https://api.shasta.trongrid.io/wallet/validateaddress',
        {
          address,
        }
      );

      if (response.data.result) {
        // Si la dirección es válida, establece isValid en true y obtiene información de la cuenta
        setIsValid(true);
        await getAccountInfo();
      } else {
        // Si la dirección no es válida, establece isValid en false y borra la información de la cuenta
        setIsValid(false);
        setAccountInfo(null);
      }
    } catch (error) {
      console.error('Error validating address:', error);
      // En caso de error, establece isValid en false y borra la información de la cuenta
      setIsValid(false);
      setAccountInfo(null);
    }
  };

  // Función para obtener información de la cuenta
  const getAccountInfo = async () => {
    try {
      // Realiza una solicitud GET a la API para obtener información de la cuenta
      const response = await axios.get(
        `https://api.shasta.trongrid.io/wallet/getaccount?address=${address}`
      );

      // Almacena la información de la cuenta en el estado accountInfo
      setAccountInfo(response.data);
    } catch (error) {
      console.error('Error getting account info:', error);
      // En caso de error, borra la información de la cuenta
      setAccountInfo(null);
    }
  };

  return (
    <div className="ValidateAddress-container"> {/* Aplica la clase al contenedor principal */}
      <div className="ValidateAddress-form"> {/* Aplica la clase al formulario */}
        <h2 className="ValidateAddress-title">Validar Dirección Tron</h2>
        <input
          type="text"
          className="ValidateAddress-input" /* Aplica la clase al input */
          placeholder="Enter Tron Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={validateAddress}
          className="ValidateAddress-button" /* Aplica la clase al botón */
        >
          Validate
        </button>
        {isValid !== null && (
          <div className="ValidateAddress-info">
          <p>
            La dirección es {isValid ? 'válida' : 'inválida'}. {/* Cambiado a español */}
          </p>
          {isValid && accountInfo && (
            <div>
              <h3>Información de la Cuenta</h3>
              <pre>{JSON.stringify(accountInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
};

export default ValidateAddress;