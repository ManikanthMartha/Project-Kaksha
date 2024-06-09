"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { fetchSummary } from '@/services/data-fetch';
import { Button } from '@/components/ui/button';

interface SummaryProps {
    pdfUrl: string;
    moduleName: string;
}

const Summary: React.FC<SummaryProps> = ({ pdfUrl, moduleName }) => {
    const [summary, setSummary] = useState<string>('');

    useEffect(() => {
        const getSummary = async () => {
            try {
                const fetchedSummary = await fetchSummary(pdfUrl);
                setSummary(fetchedSummary.join(' ')); // Join the summary array into a single string
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };

        getSummary();
    }, [pdfUrl]);

    return (
        <Dialog>
            <DialogTrigger>
                <Button>Summary</Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <h2 className="text-lg font-semibold">Summary for {moduleName}</h2>
                    <p>{summary}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Summary;
