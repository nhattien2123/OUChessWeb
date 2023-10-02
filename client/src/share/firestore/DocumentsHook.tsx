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
  limit,
  OrderByDirection,
  startAfter,
  startAt,
  limitToLast,
} from "firebase/firestore";

type Props = {
  _collection: string;
  _condition: { [key: string]: any };
  _limit: number;
  _orderBy: {
    by: string;
    asc: "asc" | "desc";
  }
};

const useDocuments = (props: Props) => {
  const [documents, setDocuments] = useState<any>([]);
  const { _collection, _condition, _limit, _orderBy } = props;

  React.useEffect(() => {
    const collecctionRef = collection(db, _collection);
    if (_condition) {
      if (!_condition.value || !_condition.value.length) {
        return;
      }

      const q = query(
        collecctionRef,
        where(_condition.fieldName, _condition.operator, _condition.value),
        orderBy(_orderBy.by),
        limitToLast(_limit)
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
  }, [_collection, _condition, _limit]);

  return documents;
};

export default useDocuments;
