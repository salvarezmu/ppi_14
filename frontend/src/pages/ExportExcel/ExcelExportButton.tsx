import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import './ExcelExportButton.css'

interface ExcelExportButtonProps {
  address: string;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ address }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['txID', 'amount', 'timestamp', 'from', 'to', 'type']);

  const handleCategoryChange = (category: string) => {
    // Toggle category selection
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(cat => cat !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const handleExportToExcel = () => {
    // Construct the API request URL with selected categories
    const apiUrl = `/api/v1/tronapi/export-to-excel/${address}/?categories=${selectedCategories.join(',')}`;

    axios.get(apiUrl, { responseType: 'blob', baseURL: process.env.REACT_APP_BASE_URL })
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
    <div className="container">
      <FormGroup className="checkbox-group">
        <FormControlLabel
          className="checkbox-label"
          control={<Checkbox checked={selectedCategories.includes('txID')} onChange={() => handleCategoryChange('txID')} />}
          label="txID"
        />
        <FormControlLabel
          className="checkbox-label"
          control={<Checkbox checked={selectedCategories.includes('amount')} onChange={() => handleCategoryChange('amount')} />}
          label="Cantidad"
        />
        <FormControlLabel
          className="checkbox-label"
          control={<Checkbox checked={selectedCategories.includes('timestamp')} onChange={() => handleCategoryChange('timestamp')} />}
          label="Timestamp"
        />
        <FormControlLabel
          className="checkbox-label"
          control={<Checkbox checked={selectedCategories.includes('from')} onChange={() => handleCategoryChange('from')} />}
          label="Desde"
        />
        <FormControlLabel
          className="checkbox-label"
          control={<Checkbox checked={selectedCategories.includes('to')} onChange={() => handleCategoryChange('to')} />}
          label="Hacia"
        />
        <FormControlLabel
          className="checkbox-label"
          control={<Checkbox checked={selectedCategories.includes('type')} onChange={() => handleCategoryChange('type')} />}
          label="Tipo"
        />
      </FormGroup>

      <Button onClick={handleExportToExcel}>Exportar a Excel</Button>
    </div>
  );
}

export default ExcelExportButton;
