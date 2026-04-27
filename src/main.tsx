import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import "./index.css";

// Code-split routes — each page loads as a separate chunk
const Landing = lazy(() => import("./pages/Landing"));
const Questionnaire = lazy(() => import("./pages/Questionnaire"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={null}>
                <Landing />
              </Suspense>
            }
          />
          <Route
            path="/anketa"
            element={
              <Suspense fallback={null}>
                <Questionnaire />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </LazyMotion>
  </React.StrictMode>
);
