/* eslint-disable camelcase */
import { Container, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Paper, Autocomplete, TextField, Button, Avatar, Backdrop, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import NavBar from '../Components/NavBar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import TableViewIcon from '@mui/icons-material/TableView';
import * as XLSX from 'xlsx';

export const Marcas = () => {
	dayjs.locale('es');
	const [asistencia, setAsistencia] = useState([]);
	const [open, setOpen] = useState(false);
	const [visible, setVisible] = useState(false);

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();

	const Trabajador = [
		{
			label: 'Trabajador 1',
			id: '1',
		},
		{
			label: 'Trabajador 2',
			id: '2',
		},
		{
			label: 'Trabajador 3',
			id: '3',
		},
	];
	const calculateHours = (entradaTurno, salidaColacion, entradaColacion, salidaTurno) => {
		const entradaTurnoDate = new Date(entradaTurno);
		const salidaTurnoDate = salidaTurno ? new Date(salidaTurno) : new Date();
		const entradaColacionDate = new Date(entradaColacion);
		const salidaColacionDate = new Date(salidaColacion);

		const diffTurno = salidaTurnoDate - entradaTurnoDate;
		const diffColacion = entradaColacionDate - salidaColacionDate;

		const totalHoras = diffTurno - diffColacion;

		const totalMinutos = totalHoras / (1000 * 60);

		const horas = Math.floor(totalMinutos / 60);
		const minutos = Math.floor(totalMinutos % 60);

		const horasLegales = Math.min(horas, 9);
		const minutosLegales = horas >= 9 && minutos > 0 ? 0 : minutos;

		const horasExtras = Math.max(0, horas - 9);
		const minutosExtras = horas >= 9 && minutos > 0 ? minutos : 0;

		let horasRetraso = horasLegales < 9 ? 9 - horasLegales - 1 : 0;
		let minutosRetraso = (horasLegales < 9 || (horasLegales === 9 && minutosLegales < 60)) && minutosLegales < 60 ? 60 - minutosLegales : 0;

		if (horasRetraso < 0) {
			horasRetraso = 0;
		}

		if (horasLegales === 9 && minutosLegales === 0) {
			minutosRetraso = 0;
		}

		return {
			horasLegales: `${horasLegales} horas, ${minutosLegales} minutos`,
			horasExtras: `${horasExtras} horas, ${minutosExtras} minutos`,
			horasRetraso: `${horasRetraso} horas, ${minutosRetraso} minutos`,
			horasTotales: `${horasExtras + horasLegales} horas, ${minutosExtras + minutosLegales} minutos`,
		};
	};

	const FormatNew = (entradaTurno, salidaColacion, entradaColacion, salidaTurno) => {
		const EntradaTurno = new Date(entradaTurno).toLocaleString('es-CL', { timeZone: 'America/Santiago' });
		const SalidaColacion = new Date(salidaColacion).toLocaleString('es-CL', { timeZone: 'America/Santiago' });
		const EntradaColacion = new Date(entradaColacion).toLocaleString('es-CL', { timeZone: 'America/Santiago' });
		const SalidaTurno = new Date(salidaTurno).toLocaleString('es-CL', { timeZone: 'America/Santiago' });

		return { EntradaTurno, SalidaColacion, EntradaColacion, SalidaTurno };
	};

	const handleExport = () => {
		// Preparar los datos para exportar
		const dataToExport = asistencia.map((item) => {
			const { horasLegales, horasExtras, horasRetraso, horasTotales } = calculateHours(item.entrada_turno, item.salida_colacion, item.entrada_colacion, item.salida_turno);
			const { EntradaTurno, SalidaColacion, EntradaColacion, SalidaTurno } = FormatNew(item.entrada_turno, item.salida_colacion, item.entrada_colacion, item.salida_turno);
			return {
				'Nombre Empleado': item.NOMBRE_TRABAJADOR + ' ' + item.APELLIDOS_TRABAJADOR,
				'Entrada Turno': EntradaTurno,
				'Salida Colación': SalidaColacion ? SalidaColacion : '-',
				'Entrada Colación': EntradaColacion ? EntradaColacion : '-',
				'Salida Turno': SalidaTurno,
				'Horas Trabajadas': horasLegales,
				'Horas Extras': horasExtras,
				'Horas Retraso': horasRetraso,
				'Total Horas': horasTotales,
			};
		});

		// Crear el libro de trabajo
		const worksheet = XLSX.utils.json_to_sheet(dataToExport);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');

		// Descargar el archivo Excel
		XLSX.writeFile(workbook, 'asistencia.xlsx');
	};

	const onSumbit = async (param) => {
		setVisible(false);
		setOpen(true);
		const { Trabajador, Fecha_Inicio, Fecha_Termino } = param;

		const Params = {
			idTrabajador: Trabajador.id,
			fechaInicio: Fecha_Inicio.format('DD/MM/YYYY'),
			fechaTermino: Fecha_Termino.format('DD/MM/YYYY'),
		};

		const url = 'http://localhost:3000/buscar-marca';
		const result = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(Params),
		});
		const { data } = await result.json();

		setAsistencia(data);
		setOpen(false);
		setVisible(true);
	};

	// useEffect(() => {
	// 	getAsistencia();
	// }, []);
	return (
		<>
			<NavBar />
			<Container maxWidth="xxl" sx={{ paddingTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
				<Avatar></Avatar>
				<Typography variant="h6">ASISTENCIA POR TRABAJADOR</Typography>
			</Container>
			<form onSubmit={handleSubmit(onSumbit)}>
				<Container maxWidth="xxl" sx={{ paddingTop: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
					<Controller
						name="Trabajador"
						control={control}
						defaultValue={null}
						rules={{ required: 'Este campo es requerido' }}
						render={({ field }) => (
							<Autocomplete
								{...field}
								id="empresa-autocomplete"
								options={Trabajador}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								getOptionLabel={(option) => option.label}
								noOptionsText="No hay resultados ..."
								fullWidth
								onChange={(event, newValue) => {
									field.onChange(newValue);
								}}
								renderInput={(params) => <TextField {...params} label="Trabajador" fullWidth error={!!errors.Trabajador} helperText={errors?.Trabajador?.message || ' '} />}
							/>
						)}
					/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Controller
							name="Fecha_Inicio"
							control={control}
							defaultValue={null}
							rules={{
								validate: (value) => value !== null || 'Este campo es requerido',
							}}
							render={({ field }) => (
								<DatePicker
									{...field}
									label="Fecha Inicio"
									format="DD/MM/YYYY"
									sx={{ width: '100%' }}
									error={!!errors.Fecha_Inicio}
									helperText={errors.Fecha_Inicio ? errors.Fecha_Inicio.message : ' '}
									slotProps={{
										textField: {
											error: !!errors.Fecha_Inicio,
											helperText: errors.Fecha_Inicio ? errors.Fecha_Inicio.message : ' ', // Establece el estado de error según si hay un error
										},
									}}
								/>
							)}
						/>
					</LocalizationProvider>

					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Controller
							name="Fecha_Termino"
							control={control}
							defaultValue={null}
							rules={{
								validate: (value) => value !== null || 'Este campo es requerido',
							}}
							render={({ field }) => (
								<DatePicker
									{...field}
									label="Fecha Termino"
									format="DD/MM/YYYY"
									sx={{ width: '100%' }}
									error={!!errors.Fecha_Termino}
									helperText={errors.Fecha_Termino ? errors.Fecha_Termino.message : ' '}
									slotProps={{
										textField: {
											error: !!errors.Fecha_Termino,
											helperText: errors.Fecha_Termino ? errors.Fecha_Termino.message : ' ',
										},
									}}
								/>
							)}
						/>
					</LocalizationProvider>
				</Container>
				<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button variant="contained" type="submit">
						Buscar{' '}
					</Button>
				</Container>
			</form>
			{visible && (
				<>
					<Container maxWidth="xxl" sx={{ paddingTop: 4 }}>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Nombre Empleado</TableCell>
										<TableCell>Entrada Turno</TableCell>
										<TableCell>Salida Colación</TableCell>
										<TableCell>Entrada Colación</TableCell>
										<TableCell>Salida Turno</TableCell>
										<TableCell>Horas Trabajadas</TableCell>
										<TableCell>Horas Extras</TableCell>
										<TableCell>Horas Retraso</TableCell>
										<TableCell>Total Horas</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{asistencia.length > 0 ? (
										asistencia.map((item, index) => {
											const { horasLegales, horasExtras, horasRetraso, horasTotales } = calculateHours(item.entrada_turno, item.salida_colacion, item.entrada_colacion, item.salida_turno);
											const { EntradaTurno, SalidaColacion, EntradaColacion, SalidaTurno } = FormatNew(item.entrada_turno, item.salida_colacion, item.entrada_colacion, item.salida_turno);
											return (
												<TableRow key={index}>
													<TableCell>{item.NOMBRE_TRABAJADOR + ' ' + item.APELLIDOS_TRABAJADOR}</TableCell>
													<TableCell sx={{ color: 'green' }}>{EntradaTurno}</TableCell>
													<TableCell sx={{ color: 'red' }}>{SalidaColacion ? SalidaColacion : '-'}</TableCell>
													<TableCell sx={{ color: 'green' }}>{EntradaColacion ? EntradaColacion : '-'}</TableCell>
													<TableCell sx={{ color: 'red' }}>{SalidaTurno}</TableCell>
													<TableCell>{horasLegales}</TableCell>
													<TableCell>{horasExtras}</TableCell>
													<TableCell sx={{ color: 'red' }}>{horasRetraso}</TableCell>
													<TableCell>{horasTotales}</TableCell>
												</TableRow>
											);
										})
									) : (
										<TableRow>
											<TableCell align="center" colSpan={9}>
												Sin resultados
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Container>
					<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 2 }}>
						<Button variant="contained" color="success" onClick={handleExport} endIcon={<TableViewIcon />}>
							Exportar
						</Button>
					</Container>
				</>
			)}

			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
};
