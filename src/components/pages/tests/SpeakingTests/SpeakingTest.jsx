import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

export default function SpeakingMock() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAudioUpload = async (audioUrl) => {
        setLoading(true);
        try {
            const response = await fetch(audioUrl);
            const audioBlob = await response.blob();

            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.mp3");

            const res = await axios.post("http://192.168.1.11:5050/api/speaking-mock", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setResult(res.data);
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-xl font-bold">IELTS Speaking Mock</h1>
            <p className="text-gray-600">Record your voice and get feedback.</p>

            <ReactMediaRecorder
                audio
                onStart={() => setRecording(true)}  // ✅ Ovoz yozish boshlandi
                onStop={() => setRecording(false)}  // ✅ Ovoz yozish tugadi
                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                    <div>
                        <p className="text-gray-600">{status}</p>

                        <div className="flex space-x-4 items-center">
                            <button
                                onClick={() => {
                                    startRecording();
                                    setRecording(true);
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            >
                                Start
                            </button>

                            <button
                                onClick={() => {
                                    stopRecording();
                                    setRecording(false);
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Stop
                            </button>
                        </div>

                        {/* ✅ Ovoz yozilayotganda animatsiya */}
                        {recording && (
                            <div className="flex space-x-1 mt-3">
                                <div className="w-3 h-6 bg-green-500 animate-pulse"></div>
                                <div className="w-3 h-6 bg-green-500 animate-pulse delay-150"></div>
                                <div className="w-3 h-6 bg-green-500 animate-pulse delay-300"></div>
                            </div>
                        )}











                        {mediaBlobUrl && (
                            <div className="mt-4">
                                <audio src={mediaBlobUrl} controls className="w-full" />
                                <button
                                    onClick={() => handleAudioUpload(mediaBlobUrl)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                                >
                                    Upload
                                </button>
                            </div>
                        )}
                    </div>
                )}
            />

            {loading && <p className="text-blue-500">Processing...</p>}

            {result && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                    <h2 className="font-semibold">Score:</h2>
                    <p className="text-lg font-bold text-green-600">{result.score}</p>

                    <button
                        onClick={() => setShowFeedback(!showFeedback)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        Show Feedback
                    </button>

                    {showFeedback && (
                        <>
                            <h2 className="font-semibold mt-2">Transcript:</h2>
                            <p>{result.transcript}</p>

                            <h2 className="font-semibold mt-2">Assessment:</h2>
                            <p>{result.assessment}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
