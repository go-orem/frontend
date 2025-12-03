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
} from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

type StoryCreateProps = {
  onClose: () => void;
  storyId?: number | null;
};

export default function StoryCreate({ onClose, storyId }: StoryCreateProps) {
  const fileInputRef = useRef<any>(null);
  const musicInputRef = useRef<any>(null);

  const [media, setMedia] = useState<string | null>(null);
  const [type, setType] = useState<"image" | "video" | null>(null);
  const [caption, setCaption] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);
  const [privacy, setPrivacy] = useState("everyone");
  const [expire, setExpire] = useState("24jam");

  const [canvasSize, setCanvasSize] = useState({ w: 420, h: 720 });
  const [textPos, setTextPos] = useState({ x: 150, y: 400 });
  const [textScale, setTextScale] = useState(1);
  const [textRotate, setTextRotate] = useState(0);

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [poll, setPoll] = useState<string[]>([]);

  const draggingRef = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // ===== DRAG / RESIZE / ROTATE =====
  const onMouseDownCaption = (e: any) => {
    draggingRef.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMoveCaption = (e: any) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setTextPos((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUpCaption = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoveCaption);
    window.addEventListener("mouseup", onMouseUpCaption);
    return () => {
      window.removeEventListener("mousemove", onMouseMoveCaption);
      window.removeEventListener("mouseup", onMouseUpCaption);
    };
  }, []);

  // ===== LOAD STORY IF EDIT =====
  useEffect(() => {
    if (!storyId) return;
    const mock = {
      media: "/sample.jpg",
      type: "image",
      caption: "Hello world 😎",
      brightness: 120,
      contrast: 90,
      saturate: 110,
      blur: 0,
      privacy: "contacts",
      expire: "24jam",
      musicUrl: null,
      poll: ["Option 1", "Option 2"],
    };
    setMedia(mock.media);
    setType(mock.type as "image" | "video");
    setCaption(mock.caption);
    setBrightness(mock.brightness);
    setContrast(mock.contrast);
    setSaturate(mock.saturate);
    setBlur(mock.blur);
    setPrivacy(mock.privacy);
    setExpire(mock.expire);
    setMusicUrl(mock.musicUrl);
    setPoll(mock.poll);
  }, [storyId]);

  // ===== FILE HANDLER =====
  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMedia(url);
    setType(file.type.startsWith("video") ? "video" : "image");

    if (file.type.startsWith("image")) {
      const img = new Image();
      img.onload = () => updateCanvasSize(img.width, img.height);
      img.src = url;
    }
  };

  const updateCanvasSize = (imgW: number, imgH: number) => {
    const maxW = 450;
    const ratio = imgW / imgH;
    const newW = Math.min(imgW, maxW);
    const newH = newW / ratio;
    setCanvasSize({ w: newW, h: newH });
  };

  // ===== MUSIC =====
  const handleMusic = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setMusicUrl(URL.createObjectURL(file));
  };

  // ===== EMOJI =====
  const addEmoji = (emoji: any) => setCaption(caption + emoji.native);

  // ===== POLL =====
  const addPollOption = () => setPoll([...poll, ""]);

  const updatePollOption = (index: number, value: string) =>
    setPoll(poll.map((o, i) => (i === index ? value : o)));

  const removePollOption = (index: number) =>
    setPoll(poll.filter((_, i) => i !== index));

  // ===== PUBLISH =====
  const handlePublish = () => {
    const payload = {
      id: storyId ?? "new",
      media,
      type,
      caption,
      filter: { brightness, contrast, saturate, blur },
      privacy,
      expire,
      textPos,
      textScale,
      textRotate,
      musicUrl,
      poll,
    };
    console.log("PUBLISH STORY:", payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-99 flex flex-col">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center text-white">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
          <X />
        </button>

        <p className="font-semibold text-lg">
          {storyId ? "Edit Story" : "Create Story"}
        </p>

        {media ? (
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-[--primarycolor] rounded-full font-semibold"
          >
            {storyId ? "Save" : "Publish"}
          </button>
        ) : (
          <div className="w-[70px]" />
        )}
      </div>

      {/* MAIN */}
      <div className="flex flex-1 gap-5 p-5">
        {/* PREVIEW */}
        <div className="flex-1 flex items-center justify-center">
          {media ? (
            <div
              className="relative bg-white/5 rounded-2xl overflow-hidden shadow-xl"
              style={{ width: canvasSize.w, height: canvasSize.h }}
            >
              {type === "image" ? (
                <img
                  src={media}
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`,
                  }}
                />
              ) : (
                <video
                  src={media}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              )}

              {/* Caption */}
              {caption && (
                <div
                  className="absolute cursor-move select-none"
                  style={{
                    left: textPos.x,
                    top: textPos.y,
                    transform: `translate(-50%, -50%) scale(${textScale}) rotate(${textRotate}deg)`,
                  }}
                  onMouseDown={onMouseDownCaption}
                >
                  <p className="text-white text-2xl drop-shadow-lg whitespace-pre-line">
                    {caption}
                  </p>
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const startY = e.clientY;
                      const startScale = textScale;
                      const move = (ev: any) => {
                        setTextScale(startScale + (ev.clientY - startY) / 200);
                      };
                      const up = () => {
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", up);
                      };
                      window.addEventListener("mousemove", move);
                      window.addEventListener("mouseup", up);
                    }}
                    className="absolute bottom-[-20px] right-[-20px] w-5 h-5 bg-white/30 rounded-full cursor-se-resize"
                  />
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const startX = e.clientX;
                      const startRotate = textRotate;
                      const move = (ev: any) =>
                        setTextRotate(startRotate + (ev.clientX - startX) / 2);
                      const up = () => {
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", up);
                      };
                      window.addEventListener("mousemove", move);
                      window.addEventListener("mouseup", up);
                    }}
                    className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-5 h-5 bg-white/30 rounded-full cursor-grab"
                  />
                </div>
              )}

              {/* Music */}
              {musicUrl && (
                <audio src={musicUrl} autoPlay loop className="hidden" />
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-4 bg-white/10 text-white rounded-xl"
            >
              <Upload className="mx-auto mb-2" />
              Upload Media
            </button>
          )}
        </div>

        {/* TOOLS */}
        <div className="w-[320px] bg-white/5 rounded-2xl p-4 text-white flex flex-col gap-6 overflow-y-auto scrollbar-none">
          {/* Upload */}
          <div>
            <p className="text-xs mb-1 opacity-70">Upload Media</p>
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full flex items-center gap-2 bg-white/10 p-3 rounded-xl hover:bg-white/20"
            >
              <Upload size={18} />
              Choose File
            </button>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleFile}
            />
          </div>

          {/* Caption */}
          <div>
            <p className="text-xs mb-1 opacity-70 flex items-center gap-2">
              <MessageSquare size={14} /> Caption
            </p>
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full h-20 p-3 bg-white/10 rounded-xl focus:outline-none text-sm"
                placeholder="Add some text…"
              />
              <button
                type="button"
                onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                className="absolute top-2 right-2 text-white"
              >
                <Smile size={18} />
              </button>
              {emojiPickerOpen && (
                <div className="absolute top-10 right-0 z-50">
                  <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
              )}
            </div>
          </div>

          {/* Music */}
          <div>
            <p className="text-xs mb-1 opacity-70 flex items-center gap-2">
              <Music size={14} /> Music
            </p>
            <button
              onClick={() => musicInputRef.current.click()}
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
          </div>

          {/* Poll */}
          <div>
            <p className="text-xs mb-1 opacity-70 flex items-center gap-2">
              <MessageSquare size={14} /> Poll / Question
            </p>
            {poll.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={p}
                  onChange={(e) => updatePollOption(i, e.target.value)}
                  className="flex-1 bg-white/10 rounded-xl p-2 text-sm"
                  placeholder={`Option ${i + 1}`}
                />
                <button
                  onClick={() => removePollOption(i)}
                  className="px-2 rounded-xl bg-red-500 text-white"
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={addPollOption}
              className="w-full bg-white/10 p-2 rounded-xl text-sm hover:bg-white/20"
            >
              Add Option
            </button>
          </div>

          {/* Filters */}
          <div>
            <p className="text-xs mb-2 opacity-70 flex items-center gap-2">
              <SlidersHorizontal size={14} /> Filters
            </p>
            <FilterSlider label="Brightness" value={brightness} onChange={setBrightness} />
            <FilterSlider label="Contrast" value={contrast} onChange={setContrast} />
            <FilterSlider label="Saturation" value={saturate} onChange={setSaturate} />
            <FilterSlider label="Blur" value={blur} max={10} onChange={setBlur} />
          </div>

          {/* Privacy */}
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

          {/* Expire */}
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

// ===== FILTER SLIDER =====
function FilterSlider({
  label,
  value,
  onChange,
  max = 200,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="mb-2">
      <p className="text-[11px] mb-1 opacity-70">{label}</p>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[--primarycolor]"
      />
    </div>
  );
}
