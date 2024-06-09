import Link from 'next/link';
import React from 'react';

import PdfViewer from '@/components/PdfViewer';
import VideoPlayer from '@/components/VideoPlayer';
import Summary from '@/components/Summary';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { getCourse, getCourseModules, fetchSummary } from '@/services/data-fetch';


export default async function Page({ params }: { params: { id: string } }) {
    const courseId = params.id;
    const modules = await getCourseModules({ cid: courseId });
    const cname = await getCourse({ cid: courseId });

    return (
        <div className='px-10 bg-gray-100 dark:bg-gray-800'>
            <div className="w-full max-w-6xl mx-auto py-8 px-4 md:px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">{cname?.courseName}</h1>
                </header>
                <div className=' text-2xl text-gray-600'>PDF Resources</div>
                <br></br>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {modules?.map((module) => (
                        <div className='flex flex-row justify-between' key={module.module_id}>
                            <div className='flex flex-col gap-3'>
                                <Dialog>
                                    <DialogTrigger>
                                        <Card>
                                            <CardContent className="flex flex-col gap-4">
                                                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    PDF
                                                </div>
                                                <h3 className="text-lg font-semibold">{module.module_name}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                    {module.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <PdfViewer url={module.pdfurl} />
                                    </DialogContent>
                                </Dialog>
                                <Summary pdfUrl={module.pdfurl} moduleName={module.module_name} />
                            </div>
                        </div>
                    ))}
                </div>
                <br></br>
                <br></br>
                <br></br>
                <div className=' text-2xl text-gray-600'>Video Resources</div>
                <br></br>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {modules?.map((module) => (
                        <div className='flex flex-row justify-between' key={module.module_id}>
                            <Dialog>
                                <DialogTrigger>
                                    <Card>
                                        <CardContent className="flex flex-col gap-4">
                                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Video
                                            </div>
                                            <h3 className="text-lg font-semibold">{module.module_name}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                {module.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent>
                                    <VideoPlayer videoUrl={module.videourl} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}