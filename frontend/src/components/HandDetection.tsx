// components/HandDetection.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_'];

export default function HandDetection() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [prediction, setPrediction] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.3,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        if (webcamRef.current) {
            const camera = new cam.Camera(webcamRef.current.video!, {
                onFrame: async () => {
                    await hands.send({ image: webcamRef.current!.video! });
                },
                width: 640,
                height: 480
            });
            camera.start();
        }

        async function onResults(results: any) {
            if (!canvasRef.current || !webcamRef.current) return;

            const canvasCtx = canvasRef.current.getContext('2d')!;
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
                    drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

                    const dataAux = [];
                    const x_ = [];
                    const y_ = [];

                    for (let i = 0; i < landmarks.length; i++) {
                        const x = landmarks[i].x;
                        const y = landmarks[i].y;
                        x_.push(x);
                        y_.push(y);
                    }

                    for (let i = 0; i < landmarks.length; i++) {
                        const x = landmarks[i].x;
                        const y = landmarks[i].y;
                        dataAux.push(x - Math.min(...x_));
                        dataAux.push(y - Math.min(...y_));
                    }

                    try {
                        const response = await fetch('http://localhost:8000/translate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ data: dataAux.slice(0, 42) })
                        });
                        const data = await response.json();
                        setPrediction(data.translation);
                        setText(prevText => prevText + data.translation);
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            }
            canvasCtx.restore();
        }

    }, []);

    return (
        <div>
            <Webcam ref={webcamRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ width: '640px', height: '480px' }} />
            <p>Prediction: {prediction}</p>
            <p>Text: {text}</p>
        </div>
    );
}
