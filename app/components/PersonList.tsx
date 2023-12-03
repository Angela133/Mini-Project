import Link from 'next/link';
import React from 'react';

export interface Profile {
    id: string;
    name: string;
    avatar: string;
}

interface PersonListProps {
    profiles: Profile[];
}

const PersonList: React.FC<PersonListProps> = ({ profiles }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                profiles.length < 1 ?
                    <div className='flex items-center justify-center h-screen w-screen'>
                        <h1>No stories found! <br /> <Link href='/login'>Login</Link> to create stories. </h1>
                    </div>
                    :
                    profiles.map((profile, index) => (
                        <a href={`/profile/${profile.id}`}>
                            <div key={index} className="bg-white p-4 rounded-md shadow-md">
                                <img
                                    src={`http://localhost:3002/dp/${profile.id}.jpg`}
                                    alt={profile.name}
                                    className="w-full h-48 rounded-md mb-4 object-scale-down max-h-full m-auto"
                                />
                                <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
                            </div>
                        </a>
                    ))}
        </div>
    );
};

export default PersonList;