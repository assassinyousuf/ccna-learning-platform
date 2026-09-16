"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getModuleById, getAllModules } from "@/lib/curriculum";
import {
  Video,
  Mic,
  Monitor,
  Square,
  Play,
  UploadCloud,
  CheckCircle2,
  HardDrive,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function SubmitVideoPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const moduleId = params.moduleId as string;
  const moduleData = getModuleById(moduleId);
  const allModules = getAllModules();

  // Next module for progression
  const currentIdx = allModules.findIndex((m) => m.id === moduleId);
  const nextModule = currentIdx >= 0 && currentIdx < allModules.length - 1 ? allModules[currentIdx + 1] : null;

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [driveUrl, setDriveUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!moduleData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Module Not Found</h1>
        <Link href="/" className="mt-4 inline-block text-cyan-400 font-mono text-xs">
          Return to Syllabus
        </Link>
      </div>
    );
  }

  const lab = moduleData.labAssignment;

  // Start in-browser screen and audio recording
  const startRecording = async () => {
    setErrorMessage(null);
    try {
      // 1. Prompt user for screen share (Packet Tracer or whole screen)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as MediaTrackConstraints,
        audio: true,
      });

      // 2. Prompt user for mic audio
      let micStream: MediaStream | null = null;
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.log("No microphone audio stream, proceeding with screen audio only:", e);
      }

      // Combine tracks
      const tracks = [...screenStream.getVideoTracks()];
      if (micStream && micStream.getAudioTracks().length > 0) {
        tracks.push(...micStream.getAudioTracks());
      } else if (screenStream.getAudioTracks().length > 0) {
        tracks.push(...screenStream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : "video/webm",
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setMediaBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        combinedStream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Handle user stopping stream from browser share banner
      screenStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };
    } catch (err) {
      console.error("Recording start error:", err);
      setErrorMessage("Could not start recording. Ensure microphone and screen capture permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  // Direct Resumable Upload to Google Drive
  const handleUploadToDrive = async () => {
    const fileToUpload = selectedFile || (mediaBlob ? new File([mediaBlob], `module-${moduleData.number}-lab-demo.webm`, { type: mediaBlob.type }) : null);

    if (!fileToUpload) {
      setErrorMessage("Please record a video or choose a video file first.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setErrorMessage(null);

    try {
      // Step 1: Request resumable session from backend
      const initRes = await fetch("/api/drive/init-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileToUpload.name,
          mimeType: fileToUpload.type,
          fileSize: fileToUpload.size,
        }),
      });

      if (!initRes.ok) {
        throw new Error("Failed to initialize Google Drive upload session");
      }

      const initData = await initRes.json();
      setUploadProgress(35);

      // Step 2: Stream video bytes directly to the uploadUrl
      const uploadRes = await fetch(initData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileToUpload.type,
        },
        body: fileToUpload,
      });

      setUploadProgress(75);

      let finalDriveUrl = `https://drive.google.com/file/d/${initData.fileId}/view?usp=sharing`;
      if (uploadRes.ok) {
        try {
          const driveData = await uploadRes.json();
          if (driveData.webViewLink) finalDriveUrl = driveData.webViewLink;
        } catch {
          // Keep generated Drive link
        }
      }

      // Step 3: Record submission in Google Sheets
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.email || "guest-user",
          userEmail: session?.user?.email || "guest@ccna.academy",
          moduleId,
          driveFileId: initData.fileId,
          driveUrl: finalDriveUrl,
        }),
      });

      setUploadProgress(100);
      setDriveUrl(finalDriveUrl);
      setUploadComplete(true);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to upload video to Google Drive. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-800 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-xs mb-3">
          <Video className="w-3.5 h-3.5" />
          <span>Proof-of-Skill Verification Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {moduleData.title} Video Lab Submission
        </h1>
        <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
          Demonstrate that you can actually configure, verify, and explain Cisco networks. Uploads directly to your 5TB Google Drive account.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!uploadComplete ? (
        <div className="space-y-8">
          {/* Lab Requirements & Rubric Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Lab Task: {lab.title}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {lab.deliverable}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                Grading Rubric (Recorded Demonstration Checklist):
              </h4>
              <ul className="space-y-1.5">
                {lab.rubric.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Option A: In-Browser Screen Recorder */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                  <span>Option 1: In-Browser Screen &amp; Mic Recorder</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Share your Packet Tracer or Cisco CLI window and record your voice narration.
                </p>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>REC {formatTimer(recordingSeconds)}</span>
                </div>
              )}
            </div>

            {/* Video Playback Preview */}
            {videoUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-h-80 mx-auto flex items-center justify-center">
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              </div>
            )}

            {/* Recording Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg"
                >
                  <Monitor className="w-4 h-4" />
                  <span>{videoUrl ? "Re-record Screen & Mic" : "Start Screen Recording"}</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 border border-red-500/40 hover:bg-slate-700 text-red-400 transition-colors"
                >
                  <Square className="w-4 h-4 fill-red-400" />
                  <span>Stop Recording ({formatTimer(recordingSeconds)})</span>
                </button>
              )}

              {videoUrl && !isRecording && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Video captured ({Math.round(mediaBlob!.size / 1024 / 1024 * 10) / 10} MB)
                </span>
              )}
            </div>
          </div>

          {/* Option B: Upload Existing Video File */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <UploadCloud className="w-5 h-5 text-purple-400" />
              <span>Option 2: Upload Pre-recorded Video File</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Recorded with OBS, Zoom, or Loom? Select your .mp4, .webm, or .mov file directly.
            </p>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedFile(file);
                if (file) {
                  setVideoUrl(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          {/* Upload & Storage Action Section */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Target: Google Drive 5TB Account
                </span>
                <p className="text-[11px] text-slate-400 font-mono">
                  Direct client-to-Drive streaming • Logged to Google Sheets
                </p>
              </div>
            </div>

            <button
              onClick={handleUploadToDrive}
              disabled={(!videoUrl && !selectedFile) || isUploading || isRecording}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed glow-cyan shadow-xl"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Streaming to Google Drive ({uploadProgress}%)...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload &amp; Unlock Next Module</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Upload Success & Next Module Unlock Card */
        <div className="p-10 rounded-3xl bg-emerald-950/20 border border-emerald-500/40 text-center shadow-2xl space-y-6 glow-emerald">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-2xl font-black text-white">
            Lab Verification Submitted!
          </h2>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Your proof-of-skill video was streamed and safely stored into your Google Drive 5TB cloud storage. Your submission link and completion timestamp have been logged to Google Sheets.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md mx-auto flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="truncate mr-2">Drive View Link:</span>
            <a
              href={driveUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Open in Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            {nextModule ? (
              <Link
                href={`/modules/${nextModule.id}`}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:opacity-90 glow-cyan shadow-xl"
              >
                <span>Unlock Module 0{nextModule.number}: {nextModule.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                <span>Return to Student Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
