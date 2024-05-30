import Link from 'next/link';
import React from 'react'


export default async function Page({ params }: { params: { id: string } }) {
    const courseId = params.id;

    return (
        <div className='px-10'>
            <div className='flex flex-row justify-between'>
                <div className='text-lg'>
                    {/* {courseDetails.name} <br /> */}
                    ID : {courseId}
                </div>
                <div className=' mx-4'>
                    <Link href='../courses'>back</Link>
                </div>
            </div>

        </div>
    )

}