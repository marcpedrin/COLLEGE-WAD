import { useState } from 'react'

function BookingForm({ match, onBook, busy }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [tickets, setTickets] = useState(1)

  if (!match) return <p>Click "Book" on a match card to select it.</p>

  const total = match.price * tickets

  const handleSubmit = (e) => {
    e.preventDefault()
    onBook({ name, email, tickets: Number(tickets) })
    setName('')
    setEmail('')
    setTickets(1)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <b>{match.team1} vs {match.team2}</b> - {match.venue}, {match.match_date}
        <br />Seats left: {match.available_seats}
      </p>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} required minLength={3} />
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label>Tickets (1-10)</label>
      <input type="number" min={1} max={Math.min(10, match.available_seats)} value={tickets}
             onChange={(e) => setTickets(e.target.value)} required />
      <p className="price">Total: ₹{total}</p>
      <button type="submit" disabled={busy}>{busy ? 'Booking...' : 'Confirm Booking'}</button>
    </form>
  )
}

export default BookingForm
