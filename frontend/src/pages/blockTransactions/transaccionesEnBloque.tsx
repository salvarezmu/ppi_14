import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

// Importa los estilos desde el archivo CSS
import './TransaccionesEnBloque.css';
import SideBarComponent from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";

const TransaccionesEnBloque: React.FC = () => {
  const theme = useTheme();
  const [blockNumber, setBlockNumber] = useState<number | string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const obtenerTransaccionesEnBloque = async () => {
    try {
      if (!blockNumber) {
        setError('Por favor, ingresa un número de bloque.');
        return;
      }

      const apiUrl = 'https://api.shasta.trongrid.io/walletsolidity/gettransactioninfobyblocknum';
      const params = { num: blockNumber };
      const response = await axios.get(apiUrl, { params });
      const data = response.data;

      if (data && data.length > 0) {
        setTransactions(data);
        setError('');
      } else {
        setError(`No se encontraron transacciones en el bloque #${blockNumber}`);
      }
    } catch (error) {
      setError('Error al obtener las transacciones.');
    }
  };

  const convertirCostoADolares = (costoTRX: number) => {
    // Factor de conversión ficticio (1 TRX = 0.03 USD)
    const factorConversion = 0.03;
    return (costoTRX * factorConversion).toFixed(2);
  };

  return (
      <div className={"transactions-page-father"}>
        <SideBarComponent></SideBarComponent>
        <div  className="container"> {/* Aplica la clase de contenedor desde el archivo CSS */}
          <Typography variant="h5" gutterBottom>
            Obtener Transacciones en un Bloque
          </Typography>
          <TextField
              label="Número de Bloque"
              variant="outlined"
              value={blockNumber}
              onChange={(e) => setBlockNumber(e.target.value)}
          />
          <Button
              variant="contained"
              color="primary"
              onClick={obtenerTransaccionesEnBloque}
              style={{ marginTop: '16px' }}
          >
            Obtener Transacciones
          </Button>
          <div >
            {error && <Typography variant="h6" color="error">{error}</Typography>}
            {transactions.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '16px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID de Transacción</TableCell>
                        <TableCell>Contrato</TableCell>
                        <TableCell>Timestamp del Bloque</TableCell>
                        <TableCell>Costo (USD)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                          <TableRow key={index}>
                            <TableCell>{transaction.id}</TableCell>
                            <TableCell>{transaction.contract_address}</TableCell>
                            <TableCell>{new Date(transaction.blockTimeStamp).toLocaleString()}</TableCell>
                            <TableCell>${convertirCostoADolares(transaction.fee / 1e6)}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            )}
          </div>
        </div>
        <CollaboratorsComponent></CollaboratorsComponent>
      </div>
  );
};

export default TransaccionesEnBloque;