import { useRef, useState, useEffect } from "react";
import axios from "axios";

type Song = {
  _id: string;
  name: string;
  fileUrl: string;
};

export default function FloatingMusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const API_URL = "http://192.168.1.4:5000/api/songs";

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get<Song[]>(API_URL);
        setSongs(res.data);
      } catch (error) {
        console.error(">> Failed to fetch songs:", error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentIndex !== null && currentIndex < songs.length - 1) {
        playSong(currentIndex + 1);
      } else {
        setCurrentIndex(null);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentIndex, songs]);

  useEffect(() => {
    if (currentIndex !== null && audioRef.current) {
      const audio = audioRef.current;
      const playAudio = async () => {
        try {
          audio.load();
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Auto-play failed:", err);
        }
      };
      playAudio();
    }
  }, [currentIndex]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("song", file);

    try {
      const res = await axios.post<Song>(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSongs((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error(">> Upload failed:", error);
    }
  };

  const playSong = (index: number) => {
    setCurrentIndex(index);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 0);
  };

  const deleteSong = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSongs((prev) => prev.filter((song) => song._id !== id));
      if (currentIndex !== null && songs[currentIndex]?._id === id) {
        audioRef.current?.pause();
        setCurrentIndex(null);
      }
    } catch (err) {
      console.error("Failed to delete song", err);
    }
  };

  const containerClass =
    "fixed bottom-4 right-4 z-50 bg-zinc-300 transition-all duration-300 shadow-lg rounded-lg overflow-hidden z-99" +
    (isHovered ? " w-80 h-auto p-4" : " w-12 h-12");

  return (
    <>
      <div
        className={containerClass}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isHovered ? (
          <div className="flex items-center justify-center h-full text-xl">
            <svg
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 15.5V5s3 1 3 4m-7-3H4m9 4H4m4 4H4m13 2.4c0 1.326-1.343 2.4-3 2.4s-3-1.075-3-2.4 1.343-2.4 3-2.4 3 1.075 3 2.4Z"
              />
            </svg>
          </div>
        ) : (
          <>
            <h2 className="text-lg mb-2 font-mono text-zinc-700">music2play</h2>
            <div className="flex gap-3">
              <div className="mb-2 shadow-lg">
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="audio-upload"
                  className="flex items-center gap-1  cursor-pointer bg-zinc-500 text-white px-3 py-1 rounded hover:bg-zinc-600 text-sm"
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5V8s3 1 3 4m3-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-6 12c0 1.105-1.12 2-2.5 2S8 17.105 8 16s1.12-2 2.5-2 2.5.895 2.5 2Z"
                    />
                  </svg>
                  Upload Audio
                </label>
              </div>
              <button
                onClick={() => setIsDeleteMode((prev) => !prev)}
                className="text-xs mb-2 bg-zinc-500 hover:bg-zinc-600 text-white px-3 py-1 rounded"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M6 12h.01m6 0h.01m5.99 0h.01"
                  />
                </svg>
              </button>
            </div>

            <ul className="bg-zinc-400 p-2 rounded-lg max-h-40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] overflow-y-auto text-sm">
              {songs.map((song, index) => (
                <li
                  key={song._id}
                  className={`flex justify-between items-center px-3 py-2 mb-1 rounded-xl shadow-lg ${
                    currentIndex === index
                      ? "bg-zinc-200 font-semibold"
                      : "bg-zinc-100"
                  }`}
                >
                  <span className="truncate max-w-[60%]">{song.name}</span>
                  {isDeleteMode ? (
                    <button
                      onClick={() => deleteSong(song._id)}
                      className="text-xs bg-zinc-500 hover:bg-zinc-600 text-white px-2 py-0.5 rounded"
                    >
                      <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => playSong(index)}
                      className="text-xs bg-zinc-500 text-white px-2 py-0.5 rounded hover:bg-zinc-700"
                    >
                      {currentIndex === index && isPlaying ? (
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 16.5c0 1.38-1.12 2.5-2.5 2.5S7 17.88 7 16.5 8.12 14 9.5 14s2.5 1.12 2.5 2.5Zm0 0V5c2.5 0 6 2.5 4.5 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 18V6l8 6-8 6Z"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <audio
        ref={audioRef}
        src={currentIndex !== null ? songs[currentIndex]?.fileUrl : ""}
        className={`bg-zinc-300 rounded-xl p-1 fixed bottom-4 left-4 z-50 w-80 transition-opacity duration-300 ${
          currentIndex !== null
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </>
  );
}
