import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from 'src/pages/Login';
import Posts from 'src/pages/Posts';

import Layout from 'src/components/Layout/Layout';

import { AuthProvider } from 'src/contexts/authContext';

const App: React.FC = () => (
  <AuthProvider>
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="posts" element={<Posts />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  </AuthProvider>
);

export default App;
