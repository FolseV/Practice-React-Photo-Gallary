import { useEffect, useState } from "react";
import { Collection } from "./Collection";
import "./index.scss";

const categorys = [{ name: "Все" }, { name: "Море" }, { name: "Горы" }, { name: "Архитектура" }, { name: "Города" }];

interface ICard {
  category: number;
  name: string;
  photos: [string, string, string, string];
}

function App() {
  const [cards, setCards] = useState<[ICard]>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const pageUrl = page ? `page=${page}&limit=3` : "";
    const categoryUrl = categoryId ? `category=${categoryId}` : "";
    setIsLoading(true);
    fetch(`https://64e73ca6b0fd9648b78f9873.mockapi.io/collections?${pageUrl}&${categoryUrl}`)
      .then((res) => res.json())
      .then((data: [ICard]) => {
        setCards(data);
      })
      .catch((e) => {
        console.error(e);
        alert("no data from server");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [categoryId, page]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categorys.map((cat, i) => {
            return (
              <li onClick={() => setCategoryId(i)} className={categoryId === i ? "active" : ""} key={cat.name}>
                {cat.name}
              </li>
            );
          })}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Loading ...</h2>
        ) : cards ? (
          cards
            .filter((card) => {
              return card.name.toLowerCase().includes(searchValue.toLowerCase());
            })
            .map((card: ICard, index: number) => {
              return <Collection key={index} name={card?.name} images={card?.photos} />;
            })
        ) : (
          <h2>No cards</h2>
        )}
      </div>

      <ul className="pagination">
        {[...Array(5)].map((_, index) => {
          return (
            <li onClick={() => setPage(() => index + 1)} className={page === index + 1 ? "active" : ""} key={index}>
              {index + 1}
            </li>
          );
        })}
        {/* <li>1</li>
        <li className="active">2</li>
        <li>3</li> */}
      </ul>
    </div>
  );
}

export default App;
