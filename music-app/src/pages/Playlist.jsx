// src/pages/Playlist.jsx
import React from 'react';
import { useSecureApi } from '../api/secureClient';
import VideoFilters from '../components/music/VideoFilters';
import VideoList from '../components/music/VideoList';
import { useVideoLibrary } from '../hooks/useVideoLibrary';
import { usePlaylistEditor } from '../hooks/usePlaylistEditor';
import PlaylistMetaPanel from '../components/playlist/PlaylistMetaPanel';
import PlaylistItemsPanel from '../components/playlist/PlaylistItemsPanel';

function Playlist() {
  const api = useSecureApi();

  // 左邊：影片庫 + filter
  const {
    loading: videosLoading,
    error: videosError,
    filteredVideos,
    videoById,
    searchTerm,
    setSearchTerm,
    groupFilter,
    setGroupFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    groupOptions,
    currentVideoId,
    setCurrentVideoId,
  } = useVideoLibrary(api);

  // 右邊：playlist 編輯
  const {
    playlists,
    playlistsLoading,
    selectedPlaylistId,
    playlistName,
    playlistItems,
    saving,
    saveMessage,
    playlistError,
    dirty,
    handleSelectPlaylist,
    handleNameChange,
    addVideoToPlaylist,
    removeItem,
    moveItemUp,
    moveItemDown,
    handleSavePlaylist,
  } = usePlaylistEditor(api, videoById);

  const handleDragStartFromLibrary = (event, videoId) => {
    event.dataTransfer.setData('text/plain', String(videoId));
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropToPlaylist = (event) => {
    event.preventDefault();
    const text = event.dataTransfer.getData('text/plain');
    const videoId = Number(text);
    if (!videoId) return;
    addVideoToPlaylist(videoId);
  };

  const handleDragOverPlaylist = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const saveLabel = selectedPlaylistId ? 'Save changes' : 'Create playlist';

  return (
    <div className="flex flex-col gap-4 w-full px-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Playlists</h1>
        <p className="text-sm text-slate-400 mt-1">
          Create your own playlists by dragging videos from the library on the
          left.
        </p>
      </header>

      <section className="bg-slate-900 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-[1.4fr,1.6fr] gap-4">
        {/* 左邊：Videos Library */}
        <div className="flex flex-col gap-3 border-r border-slate-800 pr-2">
          <VideoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            groups={groupOptions}
            groupFilter={groupFilter}
            onGroupChange={setGroupFilter}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={setSortBy}
            onSortDirectionToggle={() =>
              setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
          />

          <VideoList
            videos={filteredVideos}
            loading={videosLoading}
            error={videosError}
            currentVideoId={currentVideoId}
            onSelectVideo={setCurrentVideoId}
            enableDrag
            onDragStartVideo={handleDragStartFromLibrary}
            showAddButton
            onAddToPlaylist={addVideoToPlaylist}
          />
        </div>

        {/* 右邊：Playlist 編輯區 */}
        <div className="flex flex-col gap-4">
          <PlaylistMetaPanel
            playlistName={playlistName}
            selectedPlaylistId={selectedPlaylistId}
            playlists={playlists}
            playlistsLoading={playlistsLoading}
            saving={saving}
            saveLabel={saveLabel}
            playlistError={playlistError}
            saveMessage={saveMessage}
            dirty={dirty}
            onNameChange={handleNameChange}
            onSelectPlaylist={handleSelectPlaylist}
            onSave={handleSavePlaylist}
          />

          <PlaylistItemsPanel
            playlistItems={playlistItems}
            onMoveUp={moveItemUp}
            onMoveDown={moveItemDown}
            onRemove={removeItem}
            onDragOver={handleDragOverPlaylist}
            onDrop={handleDropToPlaylist}
          />

          <p className="text-[11px] text-slate-500">
            Tip: Playlists are saved per user. Later you can connect this with
            the Music Player page to play a whole list in order.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Playlist;
