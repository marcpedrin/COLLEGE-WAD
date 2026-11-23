function Hero({ title, subtitle }) {
  return (
    <section className="hero">
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <a href="#matches"><button>View Schedule</button></a>
    </section>
  )
}

export default Hero
