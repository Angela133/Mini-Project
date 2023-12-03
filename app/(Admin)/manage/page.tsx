"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import React and necessary components
import React, { useEffect, useState } from 'react';


// Table component
export default function AdminPage() {
    const [items, setItems] = useState([]);

    const router = useRouter();

    if (localStorage.getItem('loggedIn') != "true") {
        router.replace("/login")
    }

    useEffect(() => {

        let url = 'http://localhost:3002/story';

        let options = {
            method: 'GET',
            headers: { Accept: '*/*' }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setItems(json)
            })
            .catch(err => console.error('error:' + err));

    }, [])


    const handleDelete = (id: any) => {

        // Implement delete logic here
        let url = `http://localhost:3002/story/${id}`;

        let options = {
            method: 'DELETE',
            headers: { Accept: '*/*' }
        };

        fetch(url, options)
            .then((res) => {
                console.log(res);
                if (res.ok) {
                    setItems(items.filter((item: any) => item.id !== id));
                    alert("Deleted!")
                } else {
                    alert("Something went wrong!")
                }
            })
            .catch(err => console.error('error:' + err));

    };

    return (
        <div className="container mx-auto">
            <br />
            <Link href={"/manage/editor/new"} className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded float-right">+ Create new</Link>
            <br /><br />
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: { id: any; name: any; }) => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b">{item.id}</td>
                            <td className="py-2 px-4 border-b">{item.name}</td>
                            <td className="py-2 px-4 border-b">
                                <Link href={`/profile/${item?.id}`} className="mr-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded" target='_blank'>View</Link>
                                <Link href={`/manage/editor/${item?.id}`} className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Edit</Link>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={(e) => { e.preventDefault(); handleDelete(item.id); }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};