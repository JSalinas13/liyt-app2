import { UserProvider, useUser } from './context/UserContext';
import Login from './pages/login';
import Home from './pages/Home'; // Página principal después de login



// Componente contenedor para poder usar useUser()
function AppContent() {
  const { user } = useUser();

  return user ? <Home /> : <Login />;
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
