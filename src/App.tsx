import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from 'pages/Login';
import Posts from 'pages/Posts';
import { AuthProvider } from 'contexts/authContext';
import Layout from 'components/Layout/Layout';

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
