import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import AdminGallery from "./views/AdminGallery";
import Gallery from "./views/Gallery";
import Login from "./views/Login";
import Register from "./views/Register";
import Game from "./views/Game";
import { ROUTES } from "./constants/routes";
import RequireUser from "./components/RequireUser";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.register} element={<Register />} />
          <Route path={ROUTES.dashboard} element={<RequireUser><Dashboard /></RequireUser>}/>
          <Route path={ROUTES.game}element={<RequireUser><Game /></RequireUser>}/>
          <Route
            path={ROUTES.adminGallery}
            element={
              <RequireUser role="ADMIN">
                <AdminGallery />
              </RequireUser>
            }
          />
          <Route path={ROUTES.gallery} element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
