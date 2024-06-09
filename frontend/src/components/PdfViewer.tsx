'use client';
import React, { useState, useEffect } from 'react';
import { fetchPdfText } from '@/services/data-fetch';
import { Button } from '@/components/ui/button';

const PdfViewer = ({ url }: { url: string }) => {
    const [text, setText] = useState<string>('');
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    useEffect(() => {
        const getText = async () => {
            try {
                const extractedText = await fetchPdfText(url);
                setText(extractedText);
            } catch (error) {
                console.error('Error fetching PDF text:', error);
            }
        };
        getText();
    }, [url]);

    const handleReadAloud = () => {
        if ('speechSynthesis' in window && text) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Text-to-speech is not supported in this browser.');
        }
    };

    const handleStopReading = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div>
          <div style={{ margin: '10px', right: '0px' }}>
                <Button onClick={isSpeaking ? handleStopReading : handleReadAloud}>
                    {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                </Button>
            </div>
            <iframe src={'https://docs.google.com/gview?url=' + url + '&embedded=true'} 
            style={{ width: '100%', height: '90%' }} />
            
        </div>
    );
};

export default PdfViewer;
