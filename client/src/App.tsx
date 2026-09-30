import { Toaster } from "sonner";
import Home from "./pages/Home";

/*
 * 봄날의 햇살 — 교사용 교육 도구 허브
 * Theme: 종이 위의 봄 (light only)
 */

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
            borderRadius: "0.75rem",
          },
        }}
      />
      <Home />
    </>
  );
}

export default App;
