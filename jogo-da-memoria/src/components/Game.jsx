import { useState } from "react";
import { Board } from "./Board";

const shuffleArray = (array) => {
  //Mistura o array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const generateCards = () => {
  //Cria os cards
  const values = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const cards = values.map((value) => ({
    value,
    isFlipped: false,
  }));

  //Duplica os cards
  const duplicatedCards = cards
    .concat([...cards])
    .map((card, index) => ({ ...card, id: index }));

  return shuffleArray(duplicatedCards);
};

export const Game = () => {
  const [cards, setCards] = useState(generateCards());

  const [flippedCards, setFlippedCards] = useState([]);
  
  const [chances, setChances] = useState(8);

  const result = cards.filter((card) => card.isFlipped).length;

  const handleCardClick = (clickedCard) => {
    if (chances === 0) return;

    if (flippedCards.length === 2) return;

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );

    setCards(newCards);
    setFlippedCards([...flippedCards, clickedCard]);

    if (flippedCards.length === 1) {
      setTimeout(() => {
        const [firstCard] = flippedCards;
        if (firstCard.value !== clickedCard.value) {

          const resetCards = cards.map((card) =>
            card.id === firstCard.id || card.id === clickedCard.id
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setChances((prev) => prev - 1);
        }
        setFlippedCards([]);
      }, 600);
    }
  };

  //Reseta o jogo
  const resetGame = () => {
    setChances(6);
    setFlippedCards([]);
    setCards(generateCards());
  };

  return (
    <div className="game">
      <Board cards={cards} onCardClick={handleCardClick} />
      {chances === 0 ? (
        <p>Suas tentativas acabaram</p>
      ) : result === cards.length ? (
        <h2>Parabéns, você ganhou!</h2>
      ) : (
        <p>Você possui {chances} tentativa(s)</p>
      )}
      <button className="btn" onClick={resetGame}>
        Reiniciar o Jogo
      </button>
    </div>
  );
};