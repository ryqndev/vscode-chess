import { memo, useEffect } from "react";
import { Landing } from "./pages/Landing/Landing";
import { Puzzle } from "./pages/Puzzle/Puzzle";
import { Stats } from "./pages/Stats/Stats";
import { Route, Routes, useNavigate } from 'react-router-dom';

export const App = memo(function App() {
	const navigate = useNavigate();
	useEffect(() => {
		const page = document.documentElement.dataset?.page;
		if (!page) return;

		navigate(page);
	}, [navigate]);

	return (
		<Routes>
			<Route index element={<Landing />} />
			<Route path="/stats" element={<Stats />} />
			<Route path="/puzzle" element={<Puzzle />} />
		</Routes>
	);
});
