import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'
import matches from './data/matches'

function App() {
  // state: which match the user clicked "Book" on
  const [selectedId, setSelectedId] = useState(null)
  const selected = matches.find((m) => m.id === selectedId)

  return (
    <>
      <Navbar />
      <Hero title="Experience The Stadium Energy Live!" subtitle="IPL 2026 tickets - built with React" />

      <main>
        <section id="matches">
          <h2>Match Schedule</h2>
          <div className="match-grid">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                matchNo={match.id}
                team1={match.team1}
                team2={match.team2}
                date={match.date}
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
          <h2>Booking Summary</h2>
          {selected ? (
            <p>You selected <b>{selected.team1} vs {selected.team2}</b> at {selected.venue} on {selected.date}.</p>
          ) : (
            <p>Click "Book" on a match card to select it.</p>
          )}
        </section>
      </main>

      <footer>
        <p>&copy; 2026 IPL Ticket Booking. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
