/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';
import { Container, Radio, RadioGroup, Typography, FormControl, FormControlLabel, TextField } from '@mui/material';
import Logo from '../assets/IMG/Logo.png';

export const Inicio = () => {
	const [radio, setRadio] = useState('Entrada');
	const [text, setText] = useState('');

	function handleRadioChange(event) {
		setRadio(event.target.value);
	}

	async function handleChange(event) {
		const data = event.target.value;
		setText(data);

		if (data.length == 9) {
			if (!radio) {
				alert('Debe seleccionar una opción');
				setText('');
			}

			const fechaActual = new Date();
			const fechaLocal = new Date(fechaActual.getTime() - fechaActual.getTimezoneOffset() * 60000).toISOString().slice(0, -1);

			const params = {
				tipo: radio,
				run: data,
				fecha: fechaLocal,
			};

			console.log(params);

			const response = await Marcar(params);
			console.log(response);
		}
	}
	const Marcar = async (params) => {
		const url = `http://localhost:3000/Marcaje`;
		try {
			const result = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					params,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await result.json();
			return data;
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		handleRadioChange({ target: { value: 'Entrada' } });
	}, []);

	return (
		<>
			<Container maxWidth="xxl">
				<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center' }}>
					<img src={Logo} style={{ width: 200 }} alt="Logo"></img>
				</Container>
				<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center' }}>
					<Typography variant="h4"> Sistema de Asistencia </Typography>
				</Container>
				<Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
					<FormControl>
						<RadioGroup value={radio} name="radio-buttons-group" row onChange={handleRadioChange}>
							<FormControlLabel value="Entrada" control={<Radio size="medium" />} label="Entrada" />
							<FormControlLabel value="Salida" control={<Radio size="medium" />} label="Salida" />
						</RadioGroup>
					</FormControl>
				</Container>
				<Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
					<TextField autoFocus sx={{ width: '40%' }} value={text} onChange={handleChange} inputProps={{ maxLength: 9 }} />
				</Container>
			</Container>
		</>
	);
};
