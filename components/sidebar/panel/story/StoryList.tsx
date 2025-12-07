"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import StoryPreview, { StoryItem } from "./StoryPreview";
import {
  ShieldCheck,
  Music,
  Link,
  Lock,
  FileText,
  ImageIcon,
  Video,
  Pin,
  Crown,
  Eye,
  Pencil,
  Edit,
  CircleFadingPlus,
} from "lucide-react";

export default function StoryList({
  onStoryClick,
  onEdit,
}: {
  onStoryClick?: (id: number) => void;
  onEdit?: (id: number) => void;
}) {
  const yourStory = {
    id: 0,
    username: "Your Story",
    status: "you",
    type: "photo",
  };

  const highlightFolders = [
    { id: 100, name: "Moments", icon: "⭐", count: 12 },
    { id: 101, name: "Travel", icon: "✈️", count: 8 },
    { id: 102, name: "Friends", icon: "👥", count: 16 },
  ];

  const stories = [
    {
      id: 1,
      username: "John Doe",
      timestamp: "2h ago",
      status: "active",
      type: "video",
      verified: true,
      pinned: true,
    },
    {
      id: 2,
      username: "Jane Smith",
      timestamp: "5h ago",
      status: "active",
      type: "photo",
      verified: false,
    },
    {
      id: 3,
      username: "Mike",
      timestamp: "1 day ago",
      status: "viewed",
      type: "text",
    },
    {
      id: 4,
      username: "Sarah",
      timestamp: "2 days ago",
      status: "active",
      type: "music",
    },
    {
      id: 5,
      username: "Alex",
      timestamp: "2 days ago",
      status: "expired",
      type: "encrypted",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <ImageIcon size={14} />;
      case "video":
        return <Video size={14} />;
      case "text":
        return <FileText size={14} />;
      case "music":
        return <Music size={14} />;
      case "link":
        return <Link size={14} />;
      case "encrypted":
        return <Lock size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const getRingClass = (status: string) => {
    switch (status) {
      case "you":
        return "bg-gradient-to-br from-[#00E0FF] to-[#4C5CFF]";
      case "active":
        return "bg-gradient-to-br from-[#00D1FF] to-[#FF00E6]";
      case "viewed":
        return "bg-gray-600";
      case "expired":
        return "border border-dashed border-gray-500";
      default:
        return "bg-gray-700";
    }
  };

  const renderAvatar = (username: string, status: string) => (
    <div className="relative w-14 h-14 shrink-0">
      <div
        className={`
          absolute inset-0 rounded-full p-[2.5px]
          ${status === "expired" ? "" : getRingClass(status)}
          ${status === "active" ? "animate-pulse-slow" : ""}
        `}
      >
        <div className="w-full h-full rounded-full bg-[#0b1220] flex items-center justify-center text-white font-semibold">
          {username.charAt(0)}
        </div>
      </div>
      {previewOpen && (
        <StoryPreview
          stories={previewStories}
          startIndex={previewIndex}
          onClose={closePreview}
        />
      )}
    </div>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <p className="text-xs font-semibold text-gray-400 tracking-wide mb-2 px-1">
      {title}
    </p>
  );

  // Preview state & helpers
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  // aggregate list for preview navigation
  const previewStories: StoryItem[] = [
    { id: 0, username: "Your Story", status: "you", type: "photo" },
    ...stories.map((s) => ({ ...(s as any) })),
  ];

  const openPreview = (id: number) => {
    const idx = previewStories.findIndex((s) => s.id === id);
    setPreviewIndex(idx >= 0 ? idx : 0);
    setPreviewOpen(true);
    onStoryClick?.(id);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* YOUR STORY */}
      <div>
        <SectionTitle title="Your Story" />

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => openPreview(yourStory.id)}
          className="
            p-4 rounded-xl border border-black/10
            hover:bg-(--hovercolor) transition-all cursor-pointer
            backdrop-blur-xl flex items-center gap-4
          "
        >
          {renderAvatar("Y", "you")}

          <div className="flex-1 min-w-0 flex flex-col">
            <p className="text-white font-medium truncate">Add Story</p>
            <p className="text-xs text-gray-400">Share your moments.</p>
          </div>

          <CircleFadingPlus size={18} className="text-green-500" />
        </motion.div>
      </div>

      {/* HIGHLIGHTS */}
      <div>
        <SectionTitle title="Highlights" />

        <div className="space-y-2">
          {highlightFolders.map((h) => (
            <motion.div
              key={h.id}
              whileHover={{ scale: 1.02 }}
              className="
                p-4 rounded-xl border border-white/10 bg-white/5 
                hover:bg-white/10 transition-all cursor-pointer
                backdrop-blur-xl flex items-center gap-4
                relative
              "
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg">
                {h.icon}
              </div>

              <div className="flex-1">
                <p className="text-white text-sm font-medium">{h.name}</p>
                <p className="text-xs text-gray-400">{h.count} stories</p>
              </div>

              <Pin size={15} className="text-gray-300" />

              {/* optional edit (disable by default)
              <Pencil
                size={15}
                className="absolute right-3 top-3 text-gray-300 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(h.id);
                }}
              />
              */}
            </motion.div>
          ))}
        </div>
      </div>

      {/* RECENT STORIES */}
      <div>
        <SectionTitle title="Recent Stories" />
        <div className="space-y-3">
          {stories
            .filter((s) => s.status === "active")
            .map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.015 }}
                onClick={() => openPreview(story.id)}
                className="
                  p-4 rounded-xl bg-white/5 border border-white/10
                  hover:bg-white/10 cursor-pointer backdrop-blur-xl
                  flex items-center gap-4 relative
                "
              >
                {renderAvatar(story.username, story.status)}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate flex items-center gap-1">
                    {story.username}
                    {story.verified && (
                      <ShieldCheck size={13} className="text-blue-400" />
                    )}
                  </p>

                  <p className="text-xs text-gray-400">{story.timestamp}</p>

                  <div className="flex items-center gap-2 text-[11px] mt-1 text-gray-300">
                    {getTypeIcon(story.type)}
                    {story.pinned && (
                      <Pin size={12} className="text-amber-300" />
                    )}
                  </div>
                </div>

                <Eye size={15} className="text-[--primarycolor]" />

                {/* EDIT BUTTON */}
                <Pencil
                  size={16}
                  className="
                    absolute right-3 top-3 
                    text-gray-300 hover:text-white
                    hover:scale-110 transition-transform
                  "
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(story.id);
                  }}
                />
              </motion.div>
            ))}
        </div>
      </div>

      {/* VIEWED STORIES */}
      <div>
        <SectionTitle title="Viewed" />
        <div className="space-y-3">
          {stories
            .filter((s) => s.status === "viewed")
            .map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => openPreview(story.id)}
                className="
                  p-4 rounded-xl bg-white/3 border border-white/10 
                  hover:bg-white/8 cursor-pointer backdrop-blur-xl
                  flex items-center gap-4 relative
                "
              >
                {renderAvatar(story.username, "viewed")}

                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {story.username}
                  </p>
                  <p className="text-xs text-gray-400">{story.timestamp}</p>
                  <div className="flex items-center gap-2 text-[11px] mt-1 text-gray-300">
                    {getTypeIcon(story.type)}
                  </div>
                </div>

                {/* EDIT BUTTON */}
                <Pencil
                  size={16}
                  className="
                    absolute right-3 top-3 
                    text-gray-300 hover:text-white
                    hover:scale-110 transition-transform
                  "
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(story.id);
                  }}
                />
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
