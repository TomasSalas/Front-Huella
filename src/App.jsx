import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Marcas } from './Views/Marcas';
import { Inicio } from './Views/Inicio';
import FingerprintRegistration from './Views/FingerprintRegistration';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Inicio />} />
				<Route path="/marcas" element={<Marcas />} />
				<Route path="/test" element={<FingerprintRegistration />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
