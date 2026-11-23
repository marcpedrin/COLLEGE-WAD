// reusable card - all match details come in through props
function MatchCard({ matchNo, team1, team2, date, venue, price, seats, isSelected, onBook }) {
  return (
    <article className={isSelected ? 'match-card selected' : 'match-card'}>
      <span className="match-no">Match {matchNo}</span>
      <h3>{team1} vs {team2}</h3>
      <p>{date}</p>
      <p>{venue}</p>
      <p className="price">From ₹{price}</p>
      <p className="seats">{seats} seats available</p>
      <button onClick={onBook}>{isSelected ? 'Selected' : 'Book'}</button>
    </article>
  )
}

export default MatchCard
