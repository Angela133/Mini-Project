"use client"

import PersonList, { Profile } from './components/PersonList';
import { useEffect, useState } from 'react';

export default function Home() {

  const [profiles, setProfiles] = useState<Array<Profile>>([]);

  useEffect(() => {
    let url = `http://localhost:3002/story`;

    let options = {
      method: 'GET',
      headers: { Accept: '*/*' }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json && typeof json === typeof []) {
          const _profiles: Profile[] = json.map((r: any) => {
            console.log(r);
            
            return {
              id: r?.id,
              name: r?.name,
              bio: r?.occupation
            }
          })
          setProfiles(_profiles);
        }
      })
      .catch(err => console.error('error:' + err));
  }, []);

  return (
    <PersonList profiles={profiles} />
  )
}
