import { createApi } from 'unsplash-js';
const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
});

export async function fetchCourseImage(courseName: string): Promise<string> {
    try {
        const response = await unsplash.search.getPhotos({
            query: courseName,
            page: 1,
            perPage: 1,
        });

        if (response.response && response.response.results.length > 0) {
            return response.response.results[0].urls.small;
        } else {
            // Fallback image if no results are found
            return '/fallback-image.svg';
        }
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return '/fallback-image.svg';
    }
}
