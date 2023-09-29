import React, { useState } from "react";
import { db } from "../../config/FirebaseConfig";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

type Props = {
  _collection: string;
  _condition: { [key: string]: any };
};

const useDocuments = (props: Props) => {
  const [documents, setDocuments] = useState<any>([]);
  const { _collection, _condition } = props;

  React.useEffect(() => {
    const collecctionRef = collection(db, _collection);
    if (_condition) {
      if (!_condition.value || !_condition.value.length) {
        return;
      }
      const q = query(
        collecctionRef,
        where(_condition.fieldName, _condition.operator, _condition.value)
      );

      const unsubcribe = onSnapshot(q, (snapshot: any) => {
        const documents = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDocuments(documents);
      });

      return unsubcribe;
    }
  }, [_collection, _condition]);

  return documents;
};

export default useDocuments;
