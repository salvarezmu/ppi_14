import React, { useState } from 'react';
import axios from 'axios';

function ValidateAddress() {
  const [address, setAddress] = useState('');
  const [validationResult, setValidationResult] = useState('');

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const validateAddress = () => {
    axios
      .post('/api/validate-address/', { address: address })
      .then((response) => {
        // Comprueba si la respuesta es una cadena "true" o "false"
        const isValid = response.data.result === 'true';
        setValidationResult(isValid ? 'Valid' : 'Invalid');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Validate TRON Address</h1>
      <input
        type="text"
        placeholder="Enter TRON Address"
        value={address}
        onChange={handleAddressChange}
      />
      <button onClick={validateAddress}>Validate</button>
      <div>
        {validationResult && <p>Validation Result: {validationResult}</p>}
      </div>
    </div>
  );
}

export default ValidateAddress;