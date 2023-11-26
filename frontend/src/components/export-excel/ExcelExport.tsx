import React, {useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import {Backdrop, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup} from "@mui/material";
import './ExcelExport.css'

interface ExcelExportButtonProps {
    address: string;
}

const ExcelExport: React.FC<ExcelExportButtonProps> = ({address}) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['txID', 'amount', 'timestamp', 'from', 'to', 'type']);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prevSelected => {
            if (prevSelected.includes(category)) {
                return prevSelected.filter(cat => cat !== category);
            } else {
                return [...prevSelected, category];
            }
        });
    };

    const handleExportToExcel = () => {
        setLoading(true);
        const apiUrl = `/api/v1/tronapi/export-to-excel/${address}/?categories=${selectedCategories.join(',')}`;
        axios.get(apiUrl, {responseType: 'blob', baseURL: process.env.REACT_APP_BASE_URL})
            .then((response: AxiosResponse<Blob>) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `tron_pulse_${address}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error exporting to Excel:', error);
                setLoading(false);
            });
    };

    return (
        <div className="container-3">
            {showOptions ?
                <div className={"container-checkbox-group"}>
                    <FormGroup className="checkbox-group">
                        <FormControlLabel
                            className="checkbox-label"
                            control={<Checkbox checked={selectedCategories.includes('txID')}
                                               onChange={() => handleCategoryChange('txID')}/>}
                            label="txID"
                        />
                        <FormControlLabel
                            className="checkbox-label"
                            control={<Checkbox checked={selectedCategories.includes('amount')}
                                               onChange={() => handleCategoryChange('amount')}/>}
                            label="Cantidad"
                        />
                        <FormControlLabel
                            className="checkbox-label"
                            control={<Checkbox checked={selectedCategories.includes('timestamp')}
                                               onChange={() => handleCategoryChange('timestamp')}/>}
                            label="Timestamp"
                        />
                        <FormControlLabel
                            className="checkbox-label"
                            control={<Checkbox checked={selectedCategories.includes('from')}
                                               onChange={() => handleCategoryChange('from')}/>}
                            label="Desde"
                        />
                        <FormControlLabel
                            className="checkbox-label"
                            control={<Checkbox checked={selectedCategories.includes('to')}
                                               onChange={() => handleCategoryChange('to')}/>}
                            label="Hacia"
                        />
                        <FormControlLabel
                            className="checkbox-label"
                            control={<Checkbox checked={selectedCategories.includes('type')}
                                               onChange={() => handleCategoryChange('type')}/>}
                            label="Tipo"
                        />
                        <div className={"buttons-export-excell"}>
                            <Button
                                onClick={() => setShowOptions(false)}
                                variant="contained"
                                style={{marginLeft: '5px', height: '35px'}}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => {
                                    handleExportToExcel();
                                    setShowOptions(false);
                                }}
                                variant="contained"
                                style={{marginLeft: '5px', height: '35px'}}
                            >
                                Descargar
                            </Button>
                        </div>
                    </FormGroup>
                </div>
                : <></>
            }
            <Button onClick={() => setShowOptions(true)}>Exportar a Excel</Button>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    );
}

export default ExcelExport;
