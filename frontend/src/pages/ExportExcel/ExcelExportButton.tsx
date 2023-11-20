import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Button } from "@mui/material";

interface ExcelExportButtonProps {
  address: string;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ address }) => {
  const handleExportToExcel = () => {
    axios.get(`/api/v1/tronapi/export-to-excel/${address}/`, { responseType: 'blob', baseURL: process.env.REACT_APP_BASE_URL })
      .then((response: AxiosResponse<Blob>) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tron_pulse_${address}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error exporting to Excel:', error);
      });
  };

  return (
    <Button onClick={handleExportToExcel}>Exportar a Excel</Button>
  );
}

export default ExcelExportButton;
