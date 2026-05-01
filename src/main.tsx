import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import "./index.css";

const Portfolio = lazy(() => import("./pages/Portfolio"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <Suspense fallback={null}>
        <Portfolio />
      </Suspense>
    </LazyMotion>
  </React.StrictMode>
);
