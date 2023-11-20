import {Alert, Backdrop, Button, CircularProgress, Snackbar, TextField, Typography} from "@mui/material";
import React from "react";
import CollaboratorsComponent from "../../components/collaborators/CollaboratorsComponent";
import SideBarComponent from "../../components/sidebar/SideBarComponent";
import './HomePage.css';
import {AxiosUtils} from "../../utils/AxiosUtils";
import {ValidateAddressRes} from "../../types/responses/ValidateAddressRes";
import {BackendConstants} from "../../constants/BackendConstants";
import {Link} from "react-router-dom";
import {RoutesConstants} from "../../constants/RoutesConstants";
import Modal from "react-modal";
import axios from "axios";

interface State {
    currentAddress: string;
    showErrorValidAddress: boolean;
    loading: boolean;
    isQRModalOpen: boolean; // Nuevo estado para controlar el modal
    qrCodeUrl: string;
}

export class HomePage extends React.Component<unknown, State> {

    constructor(props: unknown) {
        super(props);
        this.state = {
            currentAddress: '',
            showErrorValidAddress: false,
            loading: false,
            isQRModalOpen: false, //
            qrCodeUrl: ''
        }
    }

    validateAddress = async (e: any) => {
        if (e.keyCode === 13) {
            this.setState({loading: true})
            const url = BackendConstants.VALIDATE_ADDRESS + this.state.currentAddress;
            const axiosResponse = await AxiosUtils.get<ValidateAddressRes>(url);
            if (!axiosResponse.data.isValid) {
                this.setState({loading: false, showErrorValidAddress: true});
                return;
            }
            this.setState({loading: false});
            const element = document.getElementById('home-page-acctions');
            element && (element.style.display = 'block');
        }
    }

    setAddress = (e: any) => {
        this.setState({currentAddress: e.target.value});
    }

    handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({showErrorValidAddress: false});
    };

    openQRModal = () => {
        const url = BackendConstants.GENERATE_QR + this.state.currentAddress;
        axios.get(url, {responseType: 'arraybuffer', baseURL: process.env.REACT_APP_BASE_URL})
            .then(response => {
                const url = URL.createObjectURL(new Blob([response.data], {type: 'image/png'}));
                this.setState({qrCodeUrl: url, isQRModalOpen: true});
            })
            .catch(error => {
                console.error('Error fetching QR code:', error);
            });
    };

    closeQRModal = () => {
        this.setState({isQRModalOpen: false});
    };

    render() {
        return (
            <div className={"home-page-father"}>
                <SideBarComponent>
                </SideBarComponent>
                <div className={"home-page-container"}>
                    <Typography variant="h5" gutterBottom>
                        Ingresa tu address:
                    </Typography>
                    <TextField
                        style={{minWidth: '400px'}}
                        required
                        id="outlined-required"
                        value={this.state.currentAddress}
                        onChange={this.setAddress}
                        onKeyUp={this.validateAddress}
                    />
                    <div id={'home-page-acctions'} style={{marginTop: '10px', display: 'none'}}>
                        <Link to={RoutesConstants.TRX_TRANSACTIONS} state={{propAddress: this.state.currentAddress}}>
                            <Button variant="contained">Transacciones</Button>
                        </Link>


                        <Button onClick={this.openQRModal} variant="contained" style={{marginLeft: '10px'}}>
                            Qr
                        </Button>
                        <Modal
                            isOpen={this.state.isQRModalOpen}
                            onRequestClose={this.closeQRModal}
                        >
                            <div style={{textAlign: "center"}}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                }}>
                                    <img
                                        alt={this.state.qrCodeUrl}
                                        src={this.state.qrCodeUrl}
                                        style={{
                                            width: "500px", // Ajusta el tamaño del código QR según tus necesidades
                                            height: "400px",
                                        }}
                                    />
                                </div>
                                <div style={{marginTop: "10px"}}>
                                    <button onClick={this.closeQRModal}>Cerrar</button>
                                </div>
                            </div>
                        </Modal>

                    </div>
                </div>
                <CollaboratorsComponent></CollaboratorsComponent>
                <Snackbar open={this.state.showErrorValidAddress} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert severity="warning" sx={{width: '100%'}} onClose={this.handleClose}>
                        La dirección ingresada es inválida.
                    </Alert>
                </Snackbar>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={this.state.loading}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </div>
        );
    }
}