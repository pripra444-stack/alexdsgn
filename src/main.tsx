import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import "./index.css";

const Portfolio = lazy(() => import("./pages/Portfolio"));
const Oferta    = lazy(() => import("./pages/Oferta"));
const Privacy   = lazy(() => import("./pages/Privacy"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <HashRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"        element={<Portfolio />} />
            <Route path="/oferta"  element={<Oferta />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </LazyMotion>
  </React.StrictMode>
);
