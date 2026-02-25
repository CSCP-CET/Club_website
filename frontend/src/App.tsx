import { Route, Routes } from 'react-router-dom';
import Dither from './components/Dither';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Execom from './pages/Execom';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div className="appShell">
      <div className="bgDither" aria-hidden="true">
        <Dither
          waveColor={[0.66, 0.33, 0.97]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.28}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/execom" element={<Execom />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}
