import EventRegistryContextComponent from './context/EventRegistryContext'
import EventsRegistry from './pages/EventsRegistry';


function App() {

  return (<EventRegistryContextComponent>

    <EventsRegistry></EventsRegistry>

  </EventRegistryContextComponent>);
}

export default App
