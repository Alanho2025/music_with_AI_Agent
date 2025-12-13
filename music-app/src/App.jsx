import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import GroupTimelinePage from "./pages/GroupTimelinePage";
import Idols from "./pages/Idols";
import Me from "./pages/Me";
import Sidebar from "./components/Sidebar";
import AdminVideos from "./pages/AdminVideos";
import AdminIdols from "./pages/AdminIdols";
import AdminHtmlImport from "./pages/AdminHtmlImport";
import AdminAlbums from "./pages/AdminAlbums";
import MusicPlayer from "./pages/MusicPlayer";
import Albums from "./pages/StoreAlbums";
import CartPage from "./pages/CartPage";
import Playlist from "./pages/Playlist";
import CheckoutPage from "./pages/CheckoutPage";
import HeroBackgroundEditor from "./pages/settings/sections/HeroBackgroundEditor";
import SettingsPage from "./pages/settings/SettingsPage"; 
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-6 flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:id" element={<GroupTimelinePage />} />
            <Route path="/groupTimelinePage" element={<GroupTimelinePage />} />
            <Route path="/idols" element={<Idols />} />
            <Route path="/music-player" element={<MusicPlayer />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/playlists" element={<Playlist />} />
            <Route path="/me" element={<Me />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/hero-background" element={<HeroBackgroundEditor />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/admin/idols" element={<AdminIdols />} />
            <Route path="/admin/import" element={<AdminHtmlImport />} />
            <Route path="/admin/albums" element={<AdminAlbums />} />
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
}

export default App;