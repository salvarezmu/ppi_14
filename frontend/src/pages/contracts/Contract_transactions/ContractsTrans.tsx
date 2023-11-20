import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import SideBarComponent from '../../../components/sidebar/SideBarComponent';
import './ContractsTrans.css';

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

const ContractsTrans: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleFetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/v1/tronapi/contract-transactions/${contractAddress}/`, { baseURL: process.env.REACT_APP_BASE_URL });
      setTransactions(response.data.response.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    
    }console.log('response.data')
  };

  return (
    <div className="contracts-page-father">
      <SideBarComponent />
      <div className="content-container">
        <TextField
          id="contractAddress"
          label="Contract Address"
          variant="outlined"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <Button variant="contained" onClick={handleFetchTransactions}>
          Traer transacciones
        </Button>

        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TX ID</TableCell>
                <TableCell>Bloque</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Desde</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.txID}</TableCell>
                  <TableCell>{transaction.blockNumber}</TableCell>
                  <TableCell>{new Date(transaction.raw_data.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.raw_data.contract[0].parameter.value.owner_address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ContractsTrans;
