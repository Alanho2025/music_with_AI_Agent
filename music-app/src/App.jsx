import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Idols from "./pages/Idols";
import Me from "./pages/Me";
import Sidebar from "./components/Sidebar";
import AdminVideos from "./pages/AdminVideos";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex">

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/idols" element={<Idols />} />
            <Route path="/me" element={<Me />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
          </Routes>
        </main>
        <Sidebar />
      </div>
    </BrowserRouter>
  );
}

export default App;