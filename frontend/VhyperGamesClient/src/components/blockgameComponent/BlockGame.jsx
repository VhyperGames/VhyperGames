import classes from "./BlockGame.module.css";
import GameCard from '../gameCardComponent/GameCard';

function BlockGame({ games, variant }) {
  
  return (
    <div className={`${classes.container} ${[classes[variant]]}`} >
      {games.map((game) => (
        <div key={game.id}>
          <GameCard title={game.title} stock={game.stock} price={game.price} imgUrl={game.imageUrl} avgRating={game.avgRating} />
        </div>
      ))}
    </div>
  );
}

export default BlockGame;
