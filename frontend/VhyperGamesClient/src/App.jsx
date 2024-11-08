import RootLayout from './pages/RootLayout';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Error from './pages/Error';
import SobreNosotros from './pages/SobreNosotros'

import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";


const routeDefinition = createRoutesFromElements(
  <Route path="/" element={<RootLayout />} errorElement={<Error />}>
    <Route index element={<Home />} />
    <Route path="catalogo" element={<Catalogo />} />
    <Route path="error" element={<Error />} />
    {/* <Route path="details" element={<Details />} /> */}
    <Route path="sobre-nosotros" element={<SobreNosotros />} />
  </Route>
);

const router = createBrowserRouter(routeDefinition);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
