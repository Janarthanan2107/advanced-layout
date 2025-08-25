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

const App = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme="system">
        <div className="app">
          <Routes>
            {/* Wrap all routes with AppLayout */}
            <Route path="/" element={<AppLayout />}>
              {/* Default route inside layout */}
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
