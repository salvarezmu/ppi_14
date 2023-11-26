import {Button, TextField} from "@mui/material";
import React from "react";
import './TransactionsFilter.css';

export default function TransactionsFilter(props: {
    setFilterRecipient: (param: string) => (void),
    setFilterSender: (param: string) => (void),
    startDate: string,
    setStartDate: (param: string) => (void),
    endDate: string,
    setEndDate: (param: string) => (void),
    setShowFilters: (param: boolean) => (void),
    getDataClickEvent: () => (void),
}) {
    return (
        <div id={"show-filters-container"}>
            <div id={"show-filters-container-form"}>
                <h2>Selecciona tus filtros</h2>
                <TextField
                    label={"Destinatario"}
                    style={{marginLeft: '10px'}}
                    variant="outlined"
                    onChange={(e) => props.setFilterRecipient(e.target.value)}
                    placeholder="Filtrar por destinatario."
                />
                <TextField
                    label={"Salida"}
                    style={{marginLeft: '10px'}}
                    variant="outlined"
                    onChange={(e) => props.setFilterSender(e.target.value)}
                    placeholder="Filtrar por dirección de salida."
                />
                <div>
                    <input
                        type="date"
                        placeholder="Fecha de inicio"
                        value={props.startDate}
                        style={{marginTop: '5px', marginLeft: '10px', height: '30px'}}
                        onChange={(e) => props.setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        style={{marginTop: '5px', marginLeft: '10px', height: '30px'}}
                        placeholder="Fecha de fin"
                        value={props.endDate}
                        onChange={(e) => props.setEndDate(e.target.value)}
                    />
                </div>
                <div className={"buttons-transactions-filter"}>
                    <Button
                        onClick={() => props.setShowFilters(false)}
                        variant="contained"
                        style={{marginLeft: '5px', height: '35px'}}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            props.getDataClickEvent();
                            props.setShowFilters(false);
                        }}
                        variant="contained"
                        style={{marginLeft: '5px', height: '35px'}}
                    >
                        Filtrar
                    </Button>
                </div>
            </div>
        </div>
    );
}