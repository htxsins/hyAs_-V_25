'use client';

import { useState } from 'react';
import { db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import infrastructureData from "@/public/data/syllabus/cs.json"

export default function UploadDataButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const uploadData = async () => {
    setLoading(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'Syllabus', 'COMPS'), infrastructureData);
      setMessage('Data uploaded successfully!');
    } catch (error) {
      setMessage(`Error uploading data: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={uploadData} disabled={loading} className="p-2 bg-blue-500 text-white rounded">
        {loading ? 'Uploading...' : 'Upload Data'}
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
