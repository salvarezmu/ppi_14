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
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/v1/contract-transactions/${contractAddress}/`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
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
                <TableCell>Desde</TableCell>
                <TableCell>Hacia</TableCell>
                <TableCell>Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.from}</TableCell>
                  <TableCell>{transaction.to}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
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
