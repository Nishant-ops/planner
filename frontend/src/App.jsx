import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MasteryProvider } from './contexts/MasteryContext';
import { CheckpointProvider } from './contexts/CheckpointContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './components/home/HomePage';
import TreeView from './components/tree/TreeView';
import HubView from './components/hub/HubView';
import IDEView from './components/ide/IDEView';
import CheckpointIDE from './components/checkpoint/CheckpointIDE';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MasteryProvider>
          <CheckpointProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/tree" element={<TreeView />} />
                <Route path="/hub/:topicKey" element={<HubView />} />
                <Route path="/ide/:topicKey/:problemId" element={<IDEView />} />
                <Route path="/checkpoint/:tier" element={<CheckpointIDE />} />
              </Route>
            </Routes>
          </CheckpointProvider>
        </MasteryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
