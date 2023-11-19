import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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
      const response = await axios.get(`http://localhost:8000/api/contract-transactions/${contractAddress}/`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div>
      <TextField
        id="contractAddress"
        label="Contract Address"
        variant="outlined"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <Button variant="contained" onClick={handleFetchTransactions}>
        Fetch Transactions
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From Address</TableCell>
              <TableCell>To Address</TableCell>
              <TableCell>Amount</TableCell>
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
  );
};

export default ContractsTrans;
