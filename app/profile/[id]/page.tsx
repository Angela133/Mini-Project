"use client"

import { useEffect, useState } from "react"

interface profileData {
    id: number,
    name: string,
    scribble: string,
    generated: {
        name: string,
        age: string,
        occupation: string,
        place: string,
        top_achievements: string[] | string
        biography: string
    }
}

export default function ProfilePage({ params }: { params?: { id: string } }) {

    const [profileData, setProfileData] = useState<profileData | null>(null);

    useEffect(() => {

        /*
                const dummyData = {
                    "name": "Sumy Cyriac",
                    "age": 41,
                    "occupation": "TTE (Train Ticket Examiner)",
                    "place": "Pala",
                    "top_achievements": [
                        "Participated in national and international level swimming championships",
                        "Individual champion since 1995",
                        "Holds 10 national records"
                    ],
                    "biography": "Sumy Cyriac, born in 1980, is a renowned swimmer hailing from Pala. He started swimming at the age of 13 in 1993 and quickly rose to prominence in the sport. Sumy has participated in numerous national and international level swimming championships, showcasing his exceptional skills and dedication. In 2003, he joined the Railways as a TTE (Train Ticket Examiner) while continuing his swimming career. Sumy's remarkable talent and consistent performance have earned him the title of individual champion since 1995. His extraordinary achievements include holding 10 national records, further solidifying his position as one of the most accomplished swimmers in the country."
                };
            
                setProfileData(dummyData);
                */
        let url = `http://localhost:3002/story/${params?.id}`;

        let options = {
            method: 'GET',
            headers: { Accept: '*/*' }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setProfileData(json);
            })
            .catch(err => console.error('error:' + err));


    }, [])

    return (<div className="flex p-8">
        {/* Left side - Photo and Basic Details */}
        <div className="w-1/5">
            <img
                src={`http://localhost:3002/dp/${params?.id}.jpg`} // Replace with the actual photo URL
                alt="Person's Photo"
                className="rounded-full w-32 h-32 mb-4"
            />
            <p className="text-gray-600"><b>Name</b> : {profileData?.generated?.name}</p>
            <p className="text-gray-600"><b>Age</b> : {profileData?.generated?.age}</p>
            <p className="text-gray-600"><b>Occupation</b> : {profileData?.generated?.occupation}</p>
            <p className="text-gray-600"><b>Place</b> : {profileData?.generated?.place}</p>
            <p className="text-gray-600"><b>Top Achievements</b> :
                {
                    (profileData?.generated?.top_achievements) ?
                        (typeof profileData?.generated?.top_achievements === typeof []) ?
                            < ul className="list-disc">
                                {

                                    profileData?.generated?.top_achievements?.map(r => <li>{r}</li>)
                                }
                            </ul>
                            : profileData?.generated?.top_achievements : "-"
                }
            </p>
        </div>

        {/* Right side - Story/Content */}
        <div className="w-4/5 ml-8">
            <h1 className="text-3xl font-bold mb-4">{profileData?.name}</h1>
            <p className="text-gray-700">
                {profileData?.generated?.biography}            </p>
            {/* Add more content as needed */}
        </div>
    </div >)
}