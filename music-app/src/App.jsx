import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Idols from "./pages/Idols";
import Me from "./pages/Me";
import Sidebar from "./components/Sidebar";
import AdminVideos from "./pages/AdminVideos";
import AdminIdols from "./pages/AdminIdols";
import AdminHtmlImport from "./pages/AdminHtmlImport";
import MusicPlayer from "./pages/MusicPlayer";
import Albums from "./pages/Albums";
import Playlist from "./pages/Playlist";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex">

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/idols" element={<Idols />} />
            <Route path="/music-player" element={<MusicPlayer />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/playlists" element={<Playlist />} />
            <Route path="/me" element={<Me />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/admin/idols" element={<AdminIdols />} />
            <Route path="/admin/import" element={<AdminHtmlImport />} />
          </Routes>
        </main>
        <Sidebar />
      </div>
    </BrowserRouter>
  );
}

export default App;