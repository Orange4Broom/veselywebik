import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

/**
 * Vlastní React hook pro načítání dat z kolekce Firestore.
 *
 * @param {string} collectionName - Název kolekce Firestore, ze které se mají načítat data.
 * @returns {{
 *   data: T[]; // Načtená data z kolekce Firestore.
 *   isPending: boolean; // Vlajka indikující, zda jsou data stále načítána (true) nebo ne (false).
 *   error: string | null; // Pokud dojde k chybě během načítání, obsahuje chybovou zprávu, jinak je null.
 * }}
 *
 * @example
 * Příklad použití:
 * const { data, isPending, error } = useFetchFirestore<Training>('trainings');
 *
 * useEffect(() => {
 *  if (data) {
 *   setTrainings(data);
 * }
 * }, [data]);
 *
 * Object.values(trainings).map((training) => (
 * <TrainingCard
 *  key={training.id}
 * training={training}
 * handleSignin={handleSignin}
 * handleSignout={handleSignout}
 * />
 * ));
 *
 */
export const useFetchFirestore = <T extends object>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsPending(true);

    projectFirestore
      .collection(collectionName)
      .get()
      .then((snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setData(result as T[]);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  }, [collectionName]);

  return { data, isPending, error };
};
