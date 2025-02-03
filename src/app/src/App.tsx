import { Landing } from "./pages/Landing/Landing";
import { Puzzle } from "./pages/Puzzle/Puzzle";
import { Stats } from "./pages/Stats/Stats";
import { Route, Routes } from 'react-router-dom';

function App() {
	return (
		<Routes>
			<Route index element={<Landing />} />
			<Route path="/stats" element={<Stats />} />
			<Route path="/puzzle" element={<Puzzle />} />
		</Routes>
	);
}

export default App;
