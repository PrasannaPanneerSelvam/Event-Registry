import EventsPad from './EventsPad';
import EventRegistryContextComponent from './context/EventRegistryContext'


function App() {

  return (<EventRegistryContextComponent>

    <EventsPad />

  </EventRegistryContextComponent>);
}

export default App
