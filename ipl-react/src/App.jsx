import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'
import BookingForm from './components/BookingForm'
import { supabase } from './supabase'

function App() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // fetch matches from the database (replaces the hardcoded array)
    async function loadMatches() {
      const { data, error } = await supabase.from('matches').select('*').order('id')
      if (error) setError(error.message)
      else setMatches(data)
      setLoading(false)
    }
    loadMatches()

    // realtime: update the UI whenever a row in matches changes
    const channel = supabase
      .channel('matches-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches' }, (payload) => {
        const m = payload.new
        setMatches((prev) => prev.map((old) => (old.id === m.id ? m : old)))
        setMessage(`Live update: ${m.team1} vs ${m.team2} now has ${m.available_seats} seats left`)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const selected = matches.find((m) => m.id === selectedId)

  // booking: insert into bookings, then reduce available_seats on the match
  async function handleBook({ name, email, tickets }) {
    if (tickets > selected.available_seats) {
      setMessage('Not enough seats left')
      return
    }
    setBusy(true)

    const { error: insertError } = await supabase.from('bookings').insert({
      match_id: selected.id,
      customer_name: name,
      email,
      tickets,
      total_amount: selected.price * tickets,
    })

    if (insertError) {
      setMessage('Booking failed: ' + insertError.message)
      setBusy(false)
      return
    }

    const { error: updateError } = await supabase
      .from('matches')
      .update({ available_seats: selected.available_seats - tickets })
      .eq('id', selected.id)

    setMessage(updateError
      ? 'Seat update failed: ' + updateError.message
      : `Booked ${tickets} ticket(s) for ${selected.team1} vs ${selected.team2}!`)
    setBusy(false)
  }

  return (
    <>
      <Navbar />
      <Hero title="Experience The Stadium Energy Live!" subtitle="IPL 2026 tickets - live from Supabase" />

      <main>
        <section id="matches">
          <h2>Match Schedule</h2>
          {loading && <p>Loading matches from Supabase...</p>}
          {error && <p className="error">Error: {error}</p>}
          <div className="match-grid">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                matchNo={match.id}
                team1={match.team1}
                team2={match.team2}
                date={match.match_date}
                venue={match.venue}
                price={match.price}
                seats={match.available_seats}
                isSelected={match.id === selectedId}
                onBook={() => setSelectedId(match.id)}
              />
            ))}
          </div>
        </section>

        <section id="booking" className="card">
          <h2>Book Ticket</h2>
          {message && <p className="message">{message}</p>}
          <BookingForm match={selected} onBook={handleBook} busy={busy} />
        </section>
      </main>

      <footer>
        <p>&copy; 2026 IPL Ticket Booking. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
