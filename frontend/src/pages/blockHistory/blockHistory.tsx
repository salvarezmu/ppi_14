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
import './blockHistory.css';
import SideBarComponent from "../../components/sidebar/SideBarComponent";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";

const HistoryBlock: React.FC = () => {
  const theme = useTheme();
  const [blocksNumber, setBlockNumber] = useState<number | string>('');
  const [blocks, setBlocks] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const obtenerHistoryBlock = async () => {
    try {
      if (!blocksNumber) {
        setError('Por favor, ingresa un número de bloques determinado.');
        return;
      }

      const apiUrl = 'https://api.shasta.trongrid.io/walletsolidity/getblockbylatestnum';
      const params = { num: blocksNumber };
      const response = await axios.get(apiUrl, { params });
      const data = response.data;
      console.log(blocks);
      if (data && data.block.length > 0) {
        setBlocks(data.block);
        setError('');
      } else {
        setError(`No se encontraron bloques`);
      }
    } catch (error) {
      setError('Error al obtener las transacciones.');
    }
  };

  return (
      <div className={"blocks-page-father"}>
        <SideBarComponent></SideBarComponent>
        <div  className="container"> {/* Aplica la clase de contenedor desde el archivo CSS */}
          <Typography variant="h5" gutterBottom>
            Obtener historico de bloques
          </Typography>
          <TextField
              label="Número de Bloques"
              variant="outlined"
              value={blocksNumber}
              onChange={(e) => setBlockNumber(e.target.value)}
          />
          <Button
              variant="contained"
              color="primary"
              onClick={obtenerHistoryBlock}
              style={{ marginTop: '16px' }}
          >
            Obtener Bloques
          </Button>
          <div >
            {error && <Typography variant="h6" color="error">{error}</Typography>}
            {blocks.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '16px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID de Bloque</TableCell>
                        <TableCell>Numero</TableCell>
                        <TableCell>Timestamp del Bloque</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {blocks.map((block, index) => (
                          <TableRow key={index}>
                            <TableCell>{block.blockID}</TableCell>
                            <TableCell>{block.block_header.raw_data.number}</TableCell>
                            <TableCell>{new Date(block.block_header.raw_data.timestamp).toLocaleString()}</TableCell>
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

export default HistoryBlock;