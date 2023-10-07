import React, { useState } from 'react';

function ValidateAddress() {
    const [address, setAddress] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(address);
        try {
            const response = await fetch('/validate_address/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }), // Envía la dirección al backend en formato JSON
            });

            if (response.ok) {
                const data = await response.json();
                setIsValid(data.is_valid);
            } else {
                console.error('Error al enviar la solicitud al servidor');
                throw new Error();
            }
            } catch (error) {
            console.error('Error al procesar la solicitud:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Dirección TRON"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button type="submit">Validar Dirección</button>
            </form>
            {isValid === null ? null : isValid ? (
                <p>La dirección es válida</p>
            ) : (
                <p>La dirección no es válida</p>
            )}
        </div>
    );
}

export default ValidateAddress;