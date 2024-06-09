async function loginUser(email: string, password: string,){
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return res.json() as Promise<{ 
            id: string
        }>;
}



async function getStudentDetils({ sid }: { sid: string }) {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/studentdata/${sid}`,{
            method: 'GET',
        
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json() as Promise<{
            student_info: {
                student_id: string,
                first_name: string,
                last_name: string,
                email: string,
            }
            enrolled_courses: {
                course_id: string,
                course_name: string,
                description: string,
            }[],
        }>;
}
async function getCourseModules({ cid }: { cid: string }) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/modules/${cid}`,{
        method: 'GET',    
    });    
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
            module_id: string,
            module_name: string,
            description: string,
            pdfurl: string,
            videourl: string,
    }[]>;
}

async function getCourse({ cid }: { cid: string }) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/course/${cid}`,{
        method: 'GET',
    });    
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        courseName: string
    }>;
}

// const fetchCaptions = async (videoUrl: string) => {
//     try {
//       const response = await fetch('http://127.0.0.1:8000/transcribe', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ video_url: videoUrl }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
  
//       const data = await response.json();
//       return data.transcription;
//     } catch (error) {
//       console.error('Error fetching captions:', error);
//       return '';
//     }
//   };
  
  async function fetchSummary(pdfUrl: string) {
    try {
        const response = await fetch('http://127.0.0.1:8000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdf_url: pdfUrl }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Failed to fetch summary: ${errorDetails.error}`);
        }

        const data = await response.json();
        return data.summary;
    } catch (error) {
        console.error('Error fetching summary:', error);
        throw new Error('An error occurred while fetching the summary');
    }
}

async function fetchPdfText(pdfUrl: string): Promise<string> {
    const response = await fetch('http://127.0.0.1:8000/extract-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pdfUrl })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch PDF text');
    }

    const data = await response.json();
    return data.text;
}

export { loginUser, getStudentDetils, getCourseModules, getCourse,  fetchSummary, fetchPdfText };
