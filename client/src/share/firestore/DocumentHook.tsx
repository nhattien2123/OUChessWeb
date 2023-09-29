import React, { useState } from 'react';
import { db } from '../../config/FirebaseConfig';
import { collection, query, where, doc, getDoc, orderBy, onSnapshot } from 'firebase/firestore';

type Props = {
    _collection: string;
    _id: string;
};

const useDocument = (props: Props) => {
    const [documents, setDocuments] = useState<any>([]);
    const { _collection, _id } = props;

    React.useEffect(() => {
        const unsubcribe = onSnapshot(doc(db, _collection, _id), (doc) => {
            if (doc.exists()) {
                const document = Object.keys(doc.data())
                    .map((key: string) => ({
                        ...doc.data()[key],
                        id: key,
                    }))
                    .sort((a: any, b: any) => a.createAt - b.createAt);
                setDocuments(document);
            }
        });
        return unsubcribe;
    }, [_id]);

    return documents;
};

export default useDocument;
