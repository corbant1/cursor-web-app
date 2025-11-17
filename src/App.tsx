import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ImagesScreen from './screens/ImagesScreen';
import ExternalDocumentsScreen from './screens/ExternalDocumentsScreen';
import TransmittalsScreen from './screens/TransmittalsScreen';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<ImagesScreen />} />
        <Route path="/images" element={<ImagesScreen />} />
        <Route path="/external-documents" element={<ExternalDocumentsScreen />} />
        <Route path="/transmittals" element={<TransmittalsScreen />} />
      </Routes>
    </AppLayout>
  );
}

export default App;

