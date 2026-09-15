const ITEMS = [
  'Backend Engineering',
  '✦',
  'Machine Learning',
  '✦',
  'Node.js',
  '✦',
  'Python',
  '✦',
  'React',
  '✦',
  'AWS Cloud',
  '✦',
  'Open to Work',
  '✦',
  'Computer Vision',
  '✦',
  'REST APIs',
  '✦',
  'MongoDB',
  '✦',
];

export default function Marquee() {
  // Duplicate for seamless loop
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <section className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item === '✦' ? <span>{item}</span> : item}
          </span>
        ))}
      </div>
    </section>
  );
}
