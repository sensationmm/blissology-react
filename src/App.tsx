import Layout from 'components/Layout/Layout';
import { AuthProvider } from 'contexts/authContext';
import Login from 'pages/Login';
import Posts from 'pages/Posts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
