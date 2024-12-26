import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MemberOnly from './pages/MemberOnly';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/memberonly" element={<MemberOnly />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;