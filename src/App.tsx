import { useFetchFirestore } from './hooks/useFetchFirestore';
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { projectFirestore } from './firebase/config';
import { v4 as uuidv4 } from 'uuid';

import { Icon } from '../src/components/icon/Icon';

import './table.scss';
import { useEffect, useState } from 'react';
interface Cinema {
  film_id: string;
  film_nazev: string;
  film_datum: string;
  film_delka: string;
  film_cena: string;
}

export const App = () => {
  const { data, isPending, error } = useFetchFirestore<Cinema>('kino');
  const [filmName, setFilmName] = useState<string>('');
  const [filmDate, setFilmDate] = useState<string>('');
  const [filmLength, setFilmLength] = useState<string>('');
  const [filmPrice, setFilmPrice] = useState<string>('');

  const [updatedId, setUpdatedId] = useState<string>('');
  const [newFilmName, setNewFilmName] = useState<string>('');
  const [newFilmDate, setNewFilmDate] = useState<string>('');
  const [newFilmLength, setNewFilmLength] = useState<string>('');
  const [newFilmPrice, setNewFilmPrice] = useState<string>('');

  const [films, setFilms] = useState<Cinema[]>([]);

  useEffect(() => {
    setFilms(data);

    console.log(films);
  }, [data]);

  console.log(isPending);
  console.log(error);

  const handleAddFilm = () => {
    const uuid = uuidv4();
    const newTraining = {
      film_id: uuid,
      film_nazev: filmName,
      film_datum: filmDate,
      film_delka: filmLength,
      film_cena: filmPrice,
    };

    const trainingRef = doc(collection(projectFirestore, 'kino'), uuid);

    setDoc(trainingRef, newTraining)
      .then(() => {
        console.log('success', 'Trénink byl úspěšně přidán');
        window.location.reload();
      })
      .catch((error) => {
        console.log('error', 'Trénink se nepodařilo přidat');
        console.error('Error adding training:', error);
      });
  };

  const handleSetValues = (
    id: string,
    name: string,
    date: string,
    length: string,
    price: string
  ) => {
    setUpdatedId(id);
    setNewFilmName(name);
    setNewFilmDate(date);
    setNewFilmLength(length);
    setNewFilmPrice(price);
  };

  const handleEditFilm = (id: string) => {
    const filmId = id;
    const filmRef = doc(collection(projectFirestore, 'kino'), filmId);

    const updatedFilm = {
      film_nazev: newFilmName,
      film_datum: newFilmDate,
      film_delka: newFilmLength,
      film_cena: newFilmPrice,
    };

    updateDoc(filmRef, updatedFilm)
      .then(() => {
        console.log('success', 'Film byl úspěšně upraven');
        window.location.reload();
      })
      .catch((error) => {
        console.log('error', 'Film se nepodařilo upravit');
        console.error('Error adding film:', error);
      });
  };

  const handleDeleteFilm = (id: string) => {
    const filmId = id;
    const filmRef = doc(collection(projectFirestore, 'kino'), filmId);
    deleteDoc(filmRef)
      .then(() => {
        console.log('success', 'Film byl úspěšně smazán');
        window.location.reload();
      })
      .catch((error) => {
        console.log('error', 'Film se nepodařilo smazat');
        console.error('Error adding film:', error);
      });
  };

  return (
    <>
      <div>
        <form>
          <h2>Přidat film</h2>
          <input
            type="text"
            placeholder="Název"
            value={filmName}
            onChange={(e) => setFilmName(e.target.value)}
          />
          <input
            type="date"
            placeholder="Datum"
            value={filmDate}
            onChange={(e) =>
              setFilmDate(e.target.value.toString().slice(0, 10))
            }
          />
          <input
            type="number"
            placeholder="Delka"
            value={filmLength}
            onChange={(e) => setFilmLength(e.target.value)}
          />
          <input
            type="text"
            placeholder="cena"
            value={filmPrice}
            onChange={(e) => setFilmPrice(e.target.value)}
          />
          <button type="button" onClick={() => handleAddFilm()}>
            Přidat Film
          </button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Název</th>
              <th>Datum</th>
              <th>Delka v minutách</th>
              <th>Cena</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {films
              ? Object.values(films).map((film) => (
                  <tr key={film.film_id}>
                    <td>{film.film_nazev}</td>
                    <td>{film.film_datum}</td>
                    <td>{film.film_delka} minut</td>
                    <td>{film.film_cena}</td>
                    <td>
                      <button onClick={() => handleDeleteFilm(film.film_id)}>
                        <Icon name="trash" type="fas" color="red" />
                      </button>
                      <button
                        onClick={() =>
                          handleSetValues(
                            film.film_id,
                            film.film_nazev,
                            film.film_datum,
                            film.film_delka,
                            film.film_cena
                          )
                        }
                      >
                        <Icon name="pen" type="fas" color="lightblue" />
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        <form>
          <h2>Upravit film</h2>
          <input
            type="text"
            placeholder="Název"
            value={newFilmName}
            onChange={(e) => setNewFilmName(e.target.value)}
          />
          <input
            type="date"
            placeholder="Datum"
            value={newFilmDate}
            onChange={(e) =>
              setNewFilmDate(e.target.value.toString().slice(0, 10))
            }
          />
          <input
            type="number"
            placeholder="Delka"
            value={newFilmLength}
            onChange={(e) => setNewFilmLength(e.target.value)}
          />
          <input
            type="text"
            placeholder="Název"
            value={newFilmPrice}
            onChange={(e) => setNewFilmPrice(e.target.value)}
          />
          <button type="button" onClick={() => handleEditFilm(updatedId)}>
            Upravit Film
          </button>
        </form>
      </div>
    </>
  );
};
