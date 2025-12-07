"use client";

import { useState, useRef, useEffect } from "react";
import {
  SlidersHorizontal,
  Eye,
  Upload,
  X,
  Music,
  Smile,
  MessageSquare,
  Edit,
  Image,
  Crop,
} from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

type StoryCreateProps = {
  onClose: () => void;
  storyId?: number | null;
};

type OverlayText = {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  color?: string;
};

type StickerItem = {
  id: string;
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
};

type StoryElement = {
  id: string;
  type: "text" | "image" | "video" | "sticker";
  x: number;
  y: number;
  scale: number;
  rotate: number;
  value?: string;
  src?: string;
};

export default function StoryCreate({ onClose, storyId }: StoryCreateProps) {
  const fileInputRef = useRef<any>(null);
  const musicInputRef = useRef<any>(null);

  const [media, setMedia] = useState<string | null>(null);
  const [type, setType] = useState<"image" | "video" | null>(null);

  // basic editor states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);

  const [privacy, setPrivacy] = useState("everyone");
  const [expire, setExpire] = useState("24jam");

  // story description
  const [editingDesc, setEditingDesc] = useState(false);
  const [storyDesc, setStoryDesc] = useState("");

  // canvas size follows viewport / media
  const [canvasSize, setCanvasSize] = useState({ w: 420, h: 720 });

  // overlay content
  const [texts, setTexts] = useState<OverlayText[]>([]);
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [activeTool, setActiveTool] = useState<
    "select" | "text" | "sticker" | "filter" | "music" | "crop"
  >("select");

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [newTextValue, setNewTextValue] = useState("");

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [poll, setPoll] = useState<string[]>([]);

  // dragging helpers (shared)
  const draggingRef = useRef<boolean>(false);
  const dragTargetRef = useRef<{ type: "text" | "sticker"; id: string } | null>(
    null
  );
  const lastMouse = useRef({ x: 0, y: 0 });

  // keep references to DOM elements
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // ===== drag handlers for overlays =====
  const onMouseDownOverlay = (
    e: React.MouseEvent,
    kind: "text" | "sticker",
    id: string
  ) => {
    e.stopPropagation();
    draggingRef.current = true;
    dragTargetRef.current = { type: kind, id };
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current || !dragTargetRef.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    if (dragTargetRef.current.type === "text") {
      setTexts((prev) =>
        prev.map((t) =>
          t.id === dragTargetRef.current!.id
            ? { ...t, x: t.x + dx, y: t.y + dy }
            : t
        )
      );
    } else {
      setStickers((prev) =>
        prev.map((s) =>
          s.id === dragTargetRef.current!.id
            ? { ...s, x: s.x + dx, y: s.y + dy }
            : s
        )
      );
    }
  };

  const onMouseUp = () => {
    draggingRef.current = false;
    dragTargetRef.current = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== file handling & autosize behaviour =====
  const handleUploadFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMedia(url);
    setType(file.type.startsWith("video") ? "video" : "image");

    if (file.type.startsWith("image")) {
      const img = new window.Image();
      img.onload = () => {
        updateCanvasSizeAuto(img.width, img.height);
      };
      img.src = url;
    } else if (file.type.startsWith("video")) {
      // will be handled by effect below
      setTimeout(() => {
        // small delay to allow media to load in DOM if needed
        // the video metadata effect will set size
      }, 50);
    }
  };

  // compute canvas size to fill viewport height (but keep ratio)
  const updateCanvasSizeAuto = (mediaW: number, mediaH: number) => {
    const maxH = window.innerHeight * 0.82; // use most of viewport
    const ratio = mediaW / mediaH;
    const newH = Math.min(maxH, mediaH);
    const newW = newH * ratio;

    // also cap width to 95vw
    const maxW = window.innerWidth * 0.95;
    if (newW > maxW) {
      const finalW = maxW;
      const finalH = finalW / ratio;
      setCanvasSize({ w: finalW, h: finalH });
    } else {
      setCanvasSize({ w: newW, h: newH });
    }
  };

  // auto size for video using metadata
  useEffect(() => {
    if (type !== "video" || !media) return;
    const v = document.createElement("video");
    v.src = media;
    v.onloadedmetadata = () => {
      updateCanvasSizeAuto(v.videoWidth || 1280, v.videoHeight || 720);
    };
  }, [media, type]);

  // if media is set programmatically (edit), try load natural size
  useEffect(() => {
    if (!media) return;
    if (type === "image") {
      const img = new window.Image();
      img.onload = () => updateCanvasSizeAuto(img.width, img.height);
      img.src = media;
    }
  }, [media, type]);

  // ===== music handler =====
  const handleMusic = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicUrl(URL.createObjectURL(file));
    setActiveTool("music");
  };

  // ===== text actions =====
  const addText = () => {
    if (!newTextValue.trim()) return;
    const t: OverlayText = {
      id: Math.random().toString(36).slice(2),
      text: newTextValue,
      x: canvasSize.w / 2,
      y: canvasSize.h / 2,
      scale: 1,
      rotate: 0,
      color: "#ffffff",
    };
    setTexts((s) => [...s, t]);
    setNewTextValue("");
    setEditingTextId(null);
    setActiveTool("select");
  };

  const updateText = (id: string, patch: Partial<OverlayText>) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const removeText = (id: string) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  // ===== sticker actions =====
  const addStickerFromEmoji = (emoji: any) => {
    const s: StickerItem = {
      id: Math.random().toString(36).slice(2),
      src: emoji.native, // we'll render emoji as text fallback
      x: canvasSize.w / 2,
      y: canvasSize.h / 2,
      w: 120,
      h: 120,
      rotate: 0,
    };
    setStickers((st) => [...st, s]);
    setEmojiPickerOpen(false);
    setActiveTool("select");
  };

  // a simple sample sticker (image) add
  const addSampleSticker = (src: string) => {
    const s: StickerItem = {
      id: Math.random().toString(36).slice(2),
      src,
      x: canvasSize.w / 2,
      y: canvasSize.h / 2,
      w: 140,
      h: 140,
      rotate: 0,
    };
    setStickers((st) => [...st, s]);
    setActiveTool("select");
  };

  // ===== poll helpers =====
  const addPollOption = () => setPoll([...poll, ""]);
  const updatePollOption = (index: number, value: string) =>
    setPoll(poll.map((o, i) => (i === index ? value : o)));
  const removePollOption = (index: number) =>
    setPoll(poll.filter((_, i) => i !== index));

  // ===== publish =====
  const handlePublish = () => {
    const payload = {
      media,
      type,
      filters: { brightness, contrast, saturate, blur },
      privacy,
      expire,
      texts,
      stickers,
      musicUrl,
      poll,
    };
    console.log("PUBLISH STORY", payload);
    onClose();
  };

  // small helper to compute filter CSS
  const mediaFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`;

  // keyboard: delete selected text/sticker if any selected (not implemented selection UI here)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ===== LOAD STORY IF EDIT =====
  useEffect(() => {
    if (!storyId) return;
    const mock = {
      media: "/sample.jpg",
      type: "image",
      brightness: 120,
      contrast: 90,
      saturate: 110,
      blur: 0,
      privacy: "contacts",
      expire: "24jam",
      musicUrl: null,
      poll: ["Option 1", "Option 2"],
      texts: [
        {
          id: "t1",
          text: "Hello world 😎",
          x: 200,
          y: 300,
          scale: 1,
          rotate: 0,
          color: "#fff",
        },
      ],
    } as any;

    setMedia(mock.media);
    setType(mock.type);
    setBrightness(mock.brightness);
    setContrast(mock.contrast);
    setSaturate(mock.saturate);
    setBlur(mock.blur);
    setPrivacy(mock.privacy);
    setExpire(mock.expire);
    setMusicUrl(mock.musicUrl);
    setPoll(mock.poll);
    if (mock.texts) setTexts(mock.texts);
  }, [storyId]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex flex-col">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center text-white">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
          <X />
        </button>

        <p className="font-semibold text-lg">Create Story</p>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-[--primarycolor] rounded-full font-semibold"
          >
            Publish
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 gap-5 p-5 items-start">
        {/* CANVAS area (center) */}
        <div
          ref={canvasRef}
          className="flex-1 flex items-center justify-center relative"
          style={{ minHeight: "72vh" }}
        >
          {/* Canvas container sized according to canvasSize */}
          <div
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
            style={{
              width: canvasSize.w,
              height: canvasSize.h,
              maxWidth: "95vw",
              maxHeight: "82vh",
            }}
            onClick={() => setActiveTool("select")}
          >
            {/* MEDIA */}
            {type === "video" && media ? (
              <video
                src={media}
                className="w-full h-full object-contain"
                style={{ filter: mediaFilter }}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : media ? (
              <img
                src={media}
                alt="preview"
                className="w-full h-full object-contain"
                style={{ filter: mediaFilter }}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-300">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-white/10 rounded-xl cursor-pointer"
                >
                  <Upload className="mx-auto" />
                  Upload Media
                </button>
                <div className="text-xs">Supported: image & video</div>
              </div>
            )}

            {/* Overlay Texts */}
            {texts.map((t) => (
              <div
                key={t.id}
                onMouseDown={(e) => onMouseDownOverlay(e, "text", t.id)}
                style={{
                  left: t.x,
                  top: t.y,
                  transform: `translate(-50%, -50%) scale(${t.scale}) rotate(${t.rotate}deg)`,
                }}
                className="absolute cursor-move select-none"
              >
                <div
                  style={{ color: t.color }}
                  className="text-white text-2xl drop-shadow-lg whitespace-pre-line"
                >
                  {t.text}
                </div>
                {/* small UI to edit / delete */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTextId(t.id);
                      setNewTextValue(t.text);
                      setActiveTool("text");
                    }}
                    className="p-1 bg-white/10 rounded"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeText(t.id);
                    }}
                    className="p-1 bg-red-600 rounded"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Stickers (emoji as text or image) */}
            {stickers.map((s) => (
              <div
                key={s.id}
                onMouseDown={(e) => onMouseDownOverlay(e, "sticker", s.id)}
                style={{
                  left: s.x,
                  top: s.y,
                  width: s.w,
                  height: s.h,
                  transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
                }}
                className="absolute cursor-move select-none flex items-center justify-center overflow-hidden"
              >
                {/* render emoji if src is single emoji (unicode) */}
                {isSingleEmoji(s.src) ? (
                  <div style={{ fontSize: s.w * 0.6 }}>{s.src}</div>
                ) : (
                  // image sticker
                  // in case src is URL
                  <img
                    src={s.src}
                    className="w-full h-full object-contain"
                    alt="sticker"
                  />
                )}
              </div>
            ))}

            {/* Story description text (ultra-modern) */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[85%] flex justify-center">
              {!editingDesc ? (
                /* ===== VIEW MODE ===== */
                <div
                  onClick={() => setEditingDesc(true)}
                  className="
        px-5 py-2 text-center text-white text-sm
        bg-white/10 
        rounded-full
        backdrop-blur-xl 
        shadow-[0_4px_20px_rgba(0,0,0,0.25)]
        cursor-text 
        transition-all duration-300
        max-w-[90%]
      "
                >
                  {storyDesc || "Tambahkan deskripsi ceritamu…"}
                </div>
              ) : (
                /* ===== EDIT MODE ===== */
                <div className="w-full animate-[fadeIn_0.2s_ease]">
                  <textarea
                    autoFocus
                    value={storyDesc}
                    onChange={(e) => setStoryDesc(e.target.value)}
                    onBlur={() => setEditingDesc(false)}
                    placeholder="description …"
                    className="
                    w-full min-h-12 max-h-[200px]
                    px-4 py-3
                   text-white text-sm leading-relaxed
                   bg-black/30
                    rounded-2xl
                    backdrop-blur-2xl 
                    shadow-[0_8px_28px_rgba(0,0,0,0.35)]
                    border border-white/20
                    outline-none
                    resize-none 
                    transition-all duration-300
                  focus:border-white/40
                    focus:shadow-[0_0_12px_rgba(255,255,255,0.4)]
                    "
                    style={{ height: "auto" }}
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = "auto"; // reset
                      t.style.height = t.scrollHeight + "px"; // auto-expand
                    }}
                  />
                </div>
              )}
            </div>

            {/* bottom toolbar inside canvas (small) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={() => {
                  setActiveTool("text");
                }}
                className={`p-3 rounded-full bg-black/30 ${
                  activeTool === "text" ? "ring-2 ring-white/20" : ""
                }`}
                title="Add text"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => {
                  setEmojiPickerOpen((s) => !s);
                  setActiveTool("sticker");
                }}
                className={`p-3 rounded-full bg-black/30 ${
                  activeTool === "sticker" ? "ring-2 ring-white/20" : ""
                }`}
                title="Add sticker"
              >
                <Image size={18} />
              </button>

              <button
                onClick={() => setActiveTool("filter")}
                className={`p-3 rounded-full bg-blcak/30 ${
                  activeTool === "filter" ? "ring-2 ring-white/20" : ""
                }`}
                title="Filters"
              >
                <SlidersHorizontal size={18} />
              </button>

              <button
                onClick={() => musicInputRef.current?.click()}
                className={`p-3 rounded-full bg-black/30 ${
                  activeTool === "music" ? "ring-2 ring-white/20" : ""
                }`}
                title="Add music"
              >
                <Music size={18} />
              </button>

              <button
                onClick={() => setActiveTool("crop")}
                className={`p-3 rounded-full bg-black/30 ${
                  activeTool === "crop" ? "ring-2 ring-white/20" : ""
                }`}
                title="Crop"
              >
                <Crop size={18} />
              </button>
            </div>
          </div>

          {/* EMOJI PICKER floating */}
          {emojiPickerOpen && (
            <div className="absolute right-10 top-28 z-50">
              <Picker
                data={data}
                onEmojiSelect={(em: StoryElement) => {
                  // add emoji as sticker
                  addStickerFromEmoji(em);
                }}
              />
            </div>
          )}
        </div>

        {/* RIGHT PANEL (tools) */}
        <div className="w-[350px] bg-white/5 rounded-2xl p-4 text-white flex flex-col gap-4 overflow-y-auto scrollbar-none">
          {/* UPLOAD */}
          <div>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleUploadFile}
            />
          </div>

          {/* ADD / EDIT TEXT */}
          <div>
            {activeTool === "text" && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={
                    editingTextId
                      ? texts.find((t) => t.id === editingTextId)?.text ??
                        newTextValue
                      : newTextValue
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    if (editingTextId) {
                      updateText(editingTextId, { text: v });
                    } else {
                      setNewTextValue(v);
                    }
                  }}
                  className="w-full h-20 p-3 bg-white/10 rounded-xl focus:outline-none text-sm"
                  placeholder="Type text to add…"
                />
                <div className="flex gap-2">
                  {!editingTextId && (
                    <button
                      onClick={addText}
                      className="px-3 py-2 bg-[--primarycolor] rounded"
                    >
                      Add
                    </button>
                  )}
                  {editingTextId && (
                    <button
                      onClick={() => setEditingTextId(null)}
                      className="px-3 py-2 bg-white/10 rounded"
                    >
                      Done
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTool("select")}
                    className="px-3 py-2 bg-white/10 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STICKERS */}
          <div>
            <p className="text-xs mb-1 opacity-70 flex items-center gap-2">
              <Image size={14} /> Stickers
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => addSampleSticker("/stickers/star.png")}
                className="p-2 bg-white/10 rounded"
              >
                Star
              </button>
              <button
                onClick={() => addSampleSticker("/stickers/heart.png")}
                className="p-2 bg-white/10 rounded"
              >
                Heart
              </button>
              <button
                onClick={() => addSampleSticker("/stickers/flash.png")}
                className="p-2 bg-white/10 rounded"
              >
                Flash
              </button>
            </div>
            <div className="mt-2 text-[12px] opacity-70">
              Or open emoji picker from canvas.
            </div>
          </div>

          {/* MUSIC */}
          <div>
            <p className="text-xs mb-1 opacity-70 flex items-center gap-2">
              <Music size={14} /> Music
            </p>
            <button
              onClick={() => musicInputRef.current?.click()}
              className="w-full flex items-center gap-2 bg-white/10 p-3 rounded-xl hover:bg-white/20"
            >
              Choose Music
            </button>
            <input
              type="file"
              hidden
              ref={musicInputRef}
              accept="audio/*"
              onChange={handleMusic}
            />
            {musicUrl && <div className="text-xs mt-2">Track loaded</div>}
          </div>

          {/* FILTERS */}
          <div>
            <p className="text-xs mb-2 opacity-70 flex items-center gap-2">
              <SlidersHorizontal size={14} /> Filters
            </p>
            <div className="mb-2">
              <p className="text-[11px] mb-1 opacity-70">Brightness</p>
              <input
                type="range"
                min={0}
                max={200}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-[--primarycolor]"
              />
            </div>
            <div className="mb-2">
              <p className="text-[11px] mb-1 opacity-70">Contrast</p>
              <input
                type="range"
                min={0}
                max={200}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-[--primarycolor]"
              />
            </div>
            <div className="mb-2">
              <p className="text-[11px] mb-1 opacity-70">Saturation</p>
              <input
                type="range"
                min={0}
                max={200}
                value={saturate}
                onChange={(e) => setSaturate(Number(e.target.value))}
                className="w-full accent-[--primarycolor]"
              />
            </div>
            <div className="mb-2">
              <p className="text-[11px] mb-1 opacity-70">Blur</p>
              <input
                type="range"
                min={0}
                max={20}
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-[--primarycolor]"
              />
            </div>
          </div>

          {/* PRIVACY */}
          <div>
            <p className="text-xs mb-1 opacity-70 flex items-center gap-2">
              <Eye size={14} /> Privacy
            </p>
            <select
              className="w-full bg-white/10 p-3 rounded-xl text-white text-sm"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">Contacts Only</option>
              <option value="closefriends">Close Friends</option>
              <option value="private">Only Me</option>
            </select>
          </div>

          {/* EXPIRE */}
          <div>
            <p className="text-xs mb-1 opacity-70">Expire in</p>
            <select
              className="w-full bg-white/10 p-3 rounded-xl text-white text-sm"
              value={expire}
              onChange={(e) => setExpire(e.target.value)}
            >
              <option value="24jam">24 Hours</option>
              <option value="12jam">12 Hours</option>
              <option value="6jam">6 Hours</option>
              <option value="1jam">1 Hour</option>
              <option value="custom">Custom (timestamp)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== util =====
function isSingleEmoji(s: string) {
  // simple heuristic: if string length <=2 or contains emoji presentation
  return /\p{Emoji}/u.test(s) && s.length <= 4;
}
