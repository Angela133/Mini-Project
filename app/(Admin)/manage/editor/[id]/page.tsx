"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Editor({ params }: { params: { id: string } }) {
    const [scribbled, setScribbled] = useState("");
    const [storyGenerated, setStoryGenerated] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResponse, setGeneratedResponse] = useState<any>({});
    const [currentId, setCurrentId] = useState(params?.id);
    const [fullName, setFullName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const router = useRouter();

    if (localStorage.getItem('loggedIn') != "true") {
        router.replace("/login")
    }

    useEffect(() => {
        setCurrentId(params?.id)
    }, [])


    useEffect(() => {
        if (currentId !== 'new') {
            setEditMode(true);
            let url = `http://localhost:3002/story/${currentId}`;

            let options = {
                method: 'GET',
                headers: { Accept: '*/*' }
            };

            fetch(url, options)
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    setScribbled(json?.scribble);
                    setGeneratedResponse(json?.generated);
                    setStoryGenerated(json?.generated?.biography);
                    setSelectedImage(`http://localhost:3002/dp/${currentId}.jpg`)
                    setFullName(json?.name)
                })
                .catch(err => console.error('error:' + err));
        } else {
            setEditMode(false);
        }

    }, [currentId])



    const onGenerateClicked = (e: any) => {
        setIsGenerating(true);
        setStoryGenerated('Please wait while we generate the story..\n This may take a while.');
        e.preventDefault();
        const apiKey = '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';
        const endpoint = 'https://api.openai.com/v1/chat/completions';

        const PROMPT_OBJ = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a sports biography author who writes articles about sport persons."
                },
                {
                    role: "user",
                    content: `Identify the following parameters from the scribbled notes given below in between triple quotes(''') : name, age, occupation, place, top_achievements. Provide the extracted data in JSON format, including a "biography" property with a short biography in about 250 words based on the given scribbled notes.
                    
                    '''name : ${fullName} 
                    ${scribbled}'''.`
                }
            ],
            temperature: 0.6
        };

        console.log(PROMPT_OBJ);

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(PROMPT_OBJ),
        }).then(res => res.json()).then((response: any) => {
            console.log(response);
            console.log("res", response?.choices[0]?.message?.content)
            const res = JSON.parse(response?.choices[0]?.message?.content);
            setGeneratedResponse(res);
            setStoryGenerated(res?.biography || 'No response generated.');
            setIsGenerating(false);
        }).catch((error) => {
            console.error(error);
            setIsGenerating(false);
            setStoryGenerated("Something went wrong. Please try again.")
        });
    }


    const onSaveClicked = (e: any) => {
        e.preventDefault();
        if (editMode) {
            fetch(`http://localhost:3002/story/${currentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: fullName,
                    scribbled,
                    generatedObj: generatedResponse
                }),
            }).then(res => res.json()).then((response: any) => {
                console.log(response, response?.message?.split(":")[1]);
                handleUpload(response?.message?.split(":")[1].trim()).then(() => {
                    alert("Success!");
                })
            }).catch((error) => {
                console.error(error);
                alert("Something went wrong!")
            })
        } else {
            fetch('http://localhost:3002/story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: fullName,
                    scribbled,
                    generatedObj: generatedResponse
                }),
            }).then(res => res.json()).then((response: any) => {
                console.log(response);
                console.log(response?.message?.split(":")[1].trim());
                setCurrentId(response?.message?.split(":")[1].trim());
                handleUpload(response?.message?.split(":")[1].trim()).then(() => {
                    alert("Story created successfully!");
                })
            }).catch((error) => {
                console.error(error);
                alert("Something went wrong!")
            });
        }
    }

    const handleUpload = async (id = currentId) => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('avatar', selectedFile);
            console.log("id", id);

            try {
                const response = await fetch('http://localhost:3002/dpupload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': '*/*',
                    }
                });

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);

        }

    }

    return (
        <>
            <div className="flex justify-start">
                <div className="bg-white p-8 rounded-md w-1/2 text-center">
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Enter Full Name" value={fullName} onChange={e => setFullName(e?.target?.value)} />
                </div>
                <div className="bg-white p-8 rounded-md w-1/2 text-center">
                    <div className="bg-gray-200 rounded-full mb-4 h-32 w-32 flex items-center justify-center mx-auto">
                        <label className="text-gray-500">
                            {
                                selectedImage ?
                                    <img
                                        src={selectedImage}
                                        alt="Profile"
                                        className="rounded-full mb-4 h-32 w-32 object-cover mx-auto"
                                    />
                                    : <p>Upload DP</p>
                            }
                            <input
                                type="file"
                                accept="image/JPG"
                                name="avatar"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex h-screen">
                {/* Left Side */}
                <div className="flex-1 p-8">
                    <textarea
                        onChange={e => setScribbled(e.target.value)}
                        className="w-full h-4/6 border rounded-md p-2"
                        placeholder="Scribble here"
                        value={scribbled}
                    >
                    </textarea>
                </div>

                {/* Middle Button */}
                <div className="flex-none p-8 ">
                    <div className="h-4/6 flex items-center justify-center">
                        <button onClick={onGenerateClicked} disabled={isGenerating} className="bg-lime-500 text-white px-4 py-2 rounded-md align-middle">
                            Generate
                        </button>
                    </div>

                </div>

                {/* Right Side */}
                <div className="flex-1 p-8">
                    <textarea
                        className="w-full h-4/6 border rounded-md p-2"
                        value={storyGenerated}
                    >
                    </textarea>
                    <br />
                    <br />
                    <br />
                    <button className="float-right bg-blue-700 text-white px-4 py-2 rounded-md" onClick={onSaveClicked}>Save</button>
                </div>
            </div>
        </>
    )
}