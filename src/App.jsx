import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from "./Components/layout/app-layout";
import {ThemeProvider} from './Components/themeProvider'

const App = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme="system">
        <div className="app">
          <AppLayout />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;