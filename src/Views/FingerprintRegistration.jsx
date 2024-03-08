import React, { useState, useEffect } from 'react';
import { FingerprintReader } from '@digitalpersona/devices';

const FingerprintRegistration = () => {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const initializeFingerprintReader = async () => {
			try {
				await FingerprintReader.initialize();
				setIsInitialized(true);
			} catch (error) {
				console.error('Error al inicializar el lector de huellas:', error);
			}
		};

		initializeFingerprintReader();
	}, []);

	return (
		<div>
			<h1>Registro de Huella</h1>
			{isInitialized ? <p>Lector de huellas inicializado correctamente.</p> : <p>Esperando inicialización...</p>}
		</div>
	);
};

export default FingerprintRegistration;
