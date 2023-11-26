import React from 'react';
import {Button, Typography} from '@mui/material';
import '@mui/system';
import './DataTreatment.css';

const DataTreatment: React.FC<{ close: () => (void) }> = (props: { close: () => (void) }) => {
    return (
        <div className={"data-treatment-container"}>
            <div className="container-2">
                <Typography variant="h4" gutterBottom>
                    Política de Tratamiento de Datos para TRON Pulse
                </Typography>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        1. Introducción
                    </Typography>
                    <Typography paragraph>
                        Gracias por utilizar TRON Pulse. Esta política de tratamiento de datos describe cómo
                        recopilamos,
                        utilizamos y protegemos la información personal que nos proporcionas. Al utilizar nuestros
                        servicios, aceptas las prácticas descritas en este documento.
                    </Typography>
                </div>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        2. Información Recopilada
                    </Typography>
                    <Typography paragraph>
                        Para utilizar TRON Pulse, se te pedirá que proporciones la siguiente información durante el
                        proceso
                        de registro:
                        <ul>
                            <li>Correo electrónico</li>
                            <li>Contraseña</li>
                            <li>Nombre de usuario</li>
                            <li>Dirección de TRON válida</li>
                        </ul>
                    </Typography>
                </div>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        3. Uso de la Información
                    </Typography>
                    <Typography paragraph>
                        La información recopilada se utiliza para los siguientes propósitos:
                        <ul>
                            <li><strong>Identificación del Usuario:</strong> Utilizamos tu nombre de usuario y
                                contraseña
                                para autenticarte y proporcionarte acceso seguro a nuestra plataforma.
                            </li>
                            <li><strong>Comunicación:</strong> Podemos utilizar tu dirección de correo electrónico para
                                enviarte comunicaciones relacionadas con el servicio, como actualizaciones,
                                notificaciones
                                importantes o cambios en nuestra política de privacidad.
                            </li>
                            <li><strong>Operación del Servicio:</strong> La dirección de TRON se utiliza para
                                interactuar
                                con la API de TRON y proporcionarte datos específicos relacionados con la dirección
                                proporcionada.
                            </li>
                        </ul>
                    </Typography>
                </div>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        4. Protección de la Información
                    </Typography>
                    <Typography paragraph>
                        Nos comprometemos a proteger la seguridad de tu información personal. Implementamos medidas de
                        seguridad físicas, electrónicas y administrativas para garantizar la confidencialidad y la
                        integridad de tus datos.
                    </Typography>
                </div>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        5. Compartir Información
                    </Typography>
                    <Typography paragraph>
                        No compartimos tu información personal con terceros sin tu consentimiento, excepto cuando sea
                        necesario para operar el servicio o cumplir con requisitos legales.
                    </Typography>
                </div>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        6. Derechos del Usuario
                    </Typography>
                    <Typography paragraph>
                        Tienes derecho a acceder, corregir y eliminar tu información personal. Puedes hacerlo a través
                        de la
                        configuración de tu cuenta en TRON Pulse.
                    </Typography>
                </div>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        7. Cambios en la Política de Privacidad
                    </Typography>
                    <Typography paragraph>
                        Nos reservamos el derecho de actualizar esta política en cualquier momento. Te notificaremos
                        sobre
                        cambios significativos a través de la plataforma o por correo electrónico.
                    </Typography>
                </div>

                <div className="section">
                    <Typography variant="h5" gutterBottom>
                        8. Contacto
                    </Typography>
                    <Typography paragraph>
                        Si tienes preguntas o inquietudes sobre nuestra política de tratamiento de datos, contáctanos
                        en <a
                        href="mailto:tronpulse.contact@gmail.com">tronpulse.contact@gmail.com</a>.
                    </Typography>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => props.close()}
                    className="backButton"
                >
                    Aceptar
                </Button>
            </div>
        </div>
    );
};

export default DataTreatment;
