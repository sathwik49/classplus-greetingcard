import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import Home from "../pages/Home";
import ProtectedLayout from "../layouts/ProtectedLayout";
import CardPreview from "../pages/CardPreview";
import UpgradePage from "../pages/Upgrade";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/card/:id" element={<CardPreview />} />
        <Route path="/upgrade" element={<UpgradePage />} />
      </Route>
    </Routes>
  );
}
