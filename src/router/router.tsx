import {
  createBrowserRouter,
  Routes,
  redirect,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import DiscoverPage from "../pages/DiscoverPage";
import AboutPage from "../pages/AboutPage";
import DesignPage from "../pages/DesignPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
// import PrivateRoute from "./PrivateRoute";
// import { RequireAuth } from "../pages/RequireAuth";

const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/discover", element: <DiscoverPage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/design", element: <DesignPage /> },
  ],
  { basename: "/" }
);

export default router;
// const router = createBrowserRouter(
//   createRoutesFromElements(
//   <Routes>
//      <Route path="/" >
//       <Route path="/" element={<HomePage/>} />
//       <Route path="/login" element={<Login/>} />
//        <Route path="/register" element={<Register/>} />
//        <Route path="/discover" element={<DiscoverPage/>}/>
//        <Route path="/about" element={<PrivateRoute path="/about" element={<AboutPage />} />}/>
//        <Route path="/design" element={<DesignPage/>}/>
//     </Route>
//   </Routes>

//   )

// );

// export default router;
