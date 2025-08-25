import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from "./Components/layout/app-layout";
import { ThemeProvider } from './Components/themeProvider';
import './App.css';

// simple Home page
function Home() {
  return (
    <div className="text-xl font-semibold">
      Welcome to the Home Page 🎉
    </div>
  );
}

// src/Components/NotFound.jsx
function NotFound() {
  return (
    <div className=" h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-lg font-medium">Oops! Page not found.</p>
      <p className="text-sm text-gray-500">The page you are looking for does not exist.</p>
      <a
        href="/dashboard"
        className="mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme="system">
        <div className="app font-sans">
          <Routes>
            {/* Dashboard routes (with layout) */}
            <Route path="/dashboard" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Catch-all route for anything outside dashboard */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
