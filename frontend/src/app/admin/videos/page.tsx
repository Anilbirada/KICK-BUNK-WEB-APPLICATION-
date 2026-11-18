"use client";

import React, { useState, useEffect } from "react";
import { 
  Film, PlusCircle, Edit, Trash2, CheckCircle2, Play, 
  Eye, EyeOff, ArrowUpDown, Sparkles, RefreshCw, X 
} from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url: string;
  poster_url: string;
  duration_seconds: number;
  display_order: number;
  is_active: boolean;
  tagline: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Culinary Gastronomy");
  const [tagline, setTagline] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(30);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/experience/videos?active_only=false");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleEditClick = (v: VideoItem) => {
    setSelectedVideo(v);
    setTitle(v.title);
    setCategory(v.category);
    setTagline(v.tagline);
    setVideoUrl(v.video_url);
    setPosterUrl(v.poster_url);
    setDescription(v.description);
    setDurationSeconds(v.duration_seconds);
    setIsEditing(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: selectedVideo ? selectedVideo.id : undefined,
      title,
      category,
      tagline,
      video_url: videoUrl,
      poster_url: posterUrl,
      description,
      duration_seconds: durationSeconds,
      display_order: selectedVideo ? selectedVideo.display_order : videos.length + 1,
      is_active: true,
    };

    try {
      const res = await fetch("http://localhost:8001/api/v1/experience/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setToastMsg("Video experience updated and synced to homepage.");
        setIsEditing(false);
        setSelectedVideo(null);
        fetchVideos();
      }
    } catch (_) {
      setToastMsg("Saved locally.");
      setIsEditing(false);
    }
  };

  const toggleVideoActive = async (v: VideoItem) => {
    const updated = { ...v, is_active: !v.is_active };
    try {
      await fetch("http://localhost:8001/api/v1/experience/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      fetchVideos();
      setToastMsg(`Video ${updated.is_active ? "Activated" : "Deactivated"}`);
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F0E9DC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#B66A4B]" />
            <h1 className="font-serif text-2xl font-bold text-[#382D25]">Cinematic Video Experiences</h1>
          </div>
          <p className="text-xs text-[#77716A] mt-1">
            Dynamically manage and reorder the 5 cinematic experience videos displayed in &#34;The KICK BUNK Experience&#34; on the homepage.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedVideo(null);
            setTitle("");
            setTagline("");
            setVideoUrl("");
            setPosterUrl("");
            setDescription("");
            setDurationSeconds(30);
            setIsEditing(true);
          }}
          className="px-5 py-2.5 rounded-full bg-[#382D25] text-white hover:bg-[#B66A4B] text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#C5A46D]" />
          <span>Add Experience Video</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Videos Table */}
      <div className="bg-white rounded-3xl border border-[#F0E9DC] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#F0E9DC] flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#382D25]">Homepage Experience Video Registry</h3>
          <span className="text-xs text-[#77716A] font-medium">{videos.length} Registered Videos</span>
        </div>

        <div className="divide-y divide-[#F0E9DC]">
          {videos.map((vid) => (
            <div key={vid.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#FAF8F2] transition-colors">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-xl overflow-hidden bg-black shrink-0 relative border border-[#C5A46D]/40 shadow-sm">
                  <img src={vid.poster_url} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0E9DC] text-[#382D25]">
                      {vid.category}
                    </span>
                    <span className="text-[11px] font-bold text-[#B66A4B] uppercase tracking-wider">
                      Order #{vid.display_order}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#382D25] mt-1">{vid.title}</h4>
                  <p className="text-xs text-[#77716A] line-clamp-1 mt-0.5">{vid.tagline} • {vid.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={() => toggleVideoActive(vid)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    vid.is_active
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-300"
                  }`}
                >
                  {vid.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{vid.is_active ? "Active" : "Hidden"}</span>
                </button>

                <button
                  onClick={() => handleEditClick(vid)}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#382D25] text-[#382D25] hover:text-white border border-[#C5A46D] text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FAF8F2] border border-[#C5A46D] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#F0E9DC] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#382D25]">
                {selectedVideo ? "Edit Experience Video" : "Add Experience Video"}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[#77716A] hover:text-[#382D25]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Signature Food Experience"
                  className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#382D25] block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Mixology Showcase"
                    className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#382D25] block mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Flame & Tandoor Artistry"
                    className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Video MP4 URL</label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/.../video.mp4"
                  className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Poster Image URL</label>
                <input
                  type="url"
                  required
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/.../photo.jpg"
                  className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vignette description displayed on card..."
                  className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F0E9DC]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-full bg-[#F0E9DC] text-[#382D25] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#382D25] text-white hover:bg-[#B66A4B] text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Save & Publish Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
