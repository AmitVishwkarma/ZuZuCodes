import './App.css';
import Toast from './components/Toast.jsx';
import Header from './Page/Header.jsx';
import Home from './Page/Home.jsx';
import Slider from './Page/Slider.jsx';
import Card from './Page/Card.jsx';

function App() {
  return (
    <div className="App">
      <Header/>
      <Home />
      <Slider />
      <Card />

    </div>
  );
}

export default App
