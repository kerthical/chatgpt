import App from '@/pages/App/App.tsx';
import Login from '@/pages/Login/Login.tsx';

export default function Index() {
  if (localStorage.getItem('apiKey') === null) {
    return <Login />;
  }

  return <App />;
}
