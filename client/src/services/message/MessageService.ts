import React from 'react';
import { db, app } from '../../config/FirebaseConfig';
import { doc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';

export const MessageService = {
    add: async (_collection: string, _data: any) => {
        try {
            const ref = doc(collection(db, 'messages'));
            await setDoc(ref, {
                ..._data,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.log(error);
        }
    },
    update: async (_collection: string, id: string, _data: any) => {
        console.log(_data);
        try {
            await updateDoc(doc(db, _collection, id), _data);
        } catch (error) {
            return null;
        }
    },
};

export default MessageService;
