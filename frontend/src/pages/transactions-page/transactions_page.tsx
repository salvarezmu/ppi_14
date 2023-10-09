import React, { useState } from 'react';
import axios from 'axios';



function App() {
  const [address, setAddress] = useState('');
  const [responseData, setResponseData] = useState<any | null>(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.shasta.trongrid.io/v1/accounts/${address}/transactions`);
      const data = response.data;
      setResponseData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Ingrese una dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
      {responseData && (
        <div>
          {/* Renderiza los datos de la respuesta de la API aquí */}
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
