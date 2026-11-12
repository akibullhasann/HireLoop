import { getJobs } from '@/lib/api/jobs';
import React from 'react';

const BrowseJobPage = async ({searchParams,}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {

    const search = await searchParams;
    const urlSearch = new URLSearchParams(search as Record<string, string>);
    const query = urlSearch.toString();

    console.log('search Params', query)

    const job = await getJobs(query)
    return (
        <div>
            <h1>Browse JObs</h1>
        </div>
    );
};

export default BrowseJobPage;