'use client';

import { useMemo, useState } from 'react';

const CENIK = {
  zasahy: [
    { id: 'internal', label: 'Ošetření na interním', price: 6000 },
    { id: 'city_ambulance', label: 'Ošetření a převoz ve městě sanitkou', price: 10000 },
    { id: 'outside_ambulance', label: 'Ošetření a převoz mimo město sanitkou', price: 15000 },
    { id: 'helicopter', label: 'Ošetření a převoz vrtulníkem', price: 75000 },
    { id: 'special_helicopter', label: 'Speciální vrtulník a zásah ve špatném terénu', price: 100000 },
  ],
  diagnostika: [
    { id: 'rtg_ct', label: 'Použití RTG nebo CT', price: 10000 },
  ],
  ukony: [
    { id: 'stitches', label: 'Zašití rány', price: 800 },
    { id: 'burns', label: 'Ošetření popálenin', price: 1200 },
    { id: 'cpr', label: 'Resuscitace (CPR)', price: 2500 },
    { id: 'checkup', label: 'Kontrolní vyšetření', price: 5000 },
  ],
  doplnkove: [
    { id: 'pet_vaccine', label: 'Očkování a kontrola mazlíčka', price: 10000 },
    { id: 'gyno_onco', label: 'Gynekologické nebo onkologické vyšetření', price: 6500 },
  ],
  vybaveni: [
    { id: 'medkit', label: 'Lékárnička', price: 5000 },
  ],
};

function formatPrice(value) {
  return `${new Intl.NumberFormat('cs-CZ').format(value)} $`;
}

function SectionTitle({ children }) {
  return <h2 className="section-title">{children}</h2>;
}

function Card({ children }) {
  return <section className="card">{children}</section>;
}

function ChoiceButton({ active, onClick, title, subtitle, multi = false }) {
  return (
    <button type="button" onClick={onClick} className={`choice ${active ? 'choice--active' : ''}`}>
      <div className="choice__content">
        <div className="choice__title">{title}</div>
        {subtitle ? <div className="choice__subtitle">{subtitle}</div> : null}
      </div>
      <div className={`choice__badge ${active ? 'choice__badge--active' : ''}`}>{active ? '✓' : multi ? '+' : '•'}</div>
    </button>
  );
}

export default function Page() {
  const [selectedZasah, setSelectedZasah] = useState('internal');
  const [selectedDiagnostika, setSelectedDiagnostika] = useState([]);
  const [selectedUkony, setSelectedUkony] = useState([]);
  const [selectedDoplnkove, setSelectedDoplnkove] = useState([]);
  const [lekarnicky, setLekarnicky] = useState(0);
  const [narocnaOperace, setNarocnaOperace] = useState(false);
  const [cenaOperace, setCenaOperace] = useState('70000');
  const [jmenoPacienta, setJmenoPacienta] = useState('');
  const [poznamka, setPoznamka] = useState('');

  const toggleItem = (setter, value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const souhrn = useMemo(() => {
    const zasahItem = CENIK.zasahy.find((item) => item.id === selectedZasah);
    const diagnostikaItems = CENIK.diagnostika.filter((item) => selectedDiagnostika.includes(item.id));
    const ukonyItems = CENIK.ukony.filter((item) => selectedUkony.includes(item.id));
    const doplnkoveItems = CENIK.doplnkove.filter((item) => selectedDoplnkove.includes(item.id));
    const lekarnickyTotal = lekarnicky * CENIK.vybaveni[0].price;
    const operacePrice = narocnaOperace ? Math.max(70000, Math.min(200000, Number(cenaOperace) || 70000)) : 0;

    const items = [
      zasahItem,
      ...diagnostikaItems,
      ...ukonyItems,
      ...doplnkoveItems,
      ...(lekarnicky > 0 ? [{ id: 'medkit_count', label: `Lékárnička x${lekarnicky}`, price: lekarnickyTotal }] : []),
      ...(narocnaOperace ? [{ id: 'operation', label: 'Náročná operace', price: operacePrice }] : []),
    ].filter(Boolean);

    return {
      items,
      total: items.reduce((sum, item) => sum + item.price, 0),
    };
  }, [selectedZasah, selectedDiagnostika, selectedUkony, selectedDoplnkove, lekarnicky, narocnaOperace, cenaOperace]);

  const resetAll = () => {
    setSelectedZasah('internal');
    setSelectedDiagnostika([]);
    setSelectedUkony([]);
    setSelectedDoplnkove([]);
    setLekarnicky(0);
    setNarocnaOperace(false);
    setCenaOperace('70000');
    setJmenoPacienta('');
    setPoznamka('');
  };

  const copySummary = async () => {
    const lines = [
      'LOS SANTOS EMS - VÝSLEDNÁ CENA',
      jmenoPacienta ? `Pacient: ${jmenoPacienta}` : null,
      '',
      ...souhrn.items.map((item) => `- ${item.label}: ${formatPrice(item.price)}`),
      '',
      `CELKEM: ${formatPrice(souhrn.total)}`,
      poznamka ? `Poznámka: ${poznamka}` : null,
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      window.alert('Souhrn byl zkopírován.');
    } catch {
      window.alert('Souhrn se nepodařilo zkopírovat.');
    }
  };

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="hero">
          <div className="hero__eyebrow">Los Santos EMS</div>
          <h1 className="hero__title">Rychlá kalkulačka ošetření</h1>
          <p className="hero__text">Mobilní web pro rychlé spočítání ceny během služby. Velká tlačítka, minimum klikání, okamžitý výsledek.</p>
        </header>

        <Card>
          <SectionTitle>Pacient</SectionTitle>
          <div className="stack">
            <input
              value={jmenoPacienta}
              onChange={(event) => setJmenoPacienta(event.target.value)}
              placeholder="Jméno pacienta"
              className="input"
            />
            <textarea
              value={poznamka}
              onChange={(event) => setPoznamka(event.target.value)}
              placeholder="Poznámka"
              rows={3}
              className="input input--textarea"
            />
          </div>
        </Card>

        <Card>
          <SectionTitle>Zásah a převoz</SectionTitle>
          <div className="stack">
            {CENIK.zasahy.map((item) => (
              <ChoiceButton
                key={item.id}
                active={selectedZasah === item.id}
                onClick={() => setSelectedZasah(item.id)}
                title={item.label}
                subtitle={formatPrice(item.price)}
              />
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Diagnostika</SectionTitle>
          <div className="stack">
            {CENIK.diagnostika.map((item) => (
              <ChoiceButton
                key={item.id}
                active={selectedDiagnostika.includes(item.id)}
                onClick={() => toggleItem(setSelectedDiagnostika, item.id)}
                title={item.label}
                subtitle={formatPrice(item.price)}
                multi
              />
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Zdravotní úkony</SectionTitle>
          <div className="stack">
            {CENIK.ukony.map((item) => (
              <ChoiceButton
                key={item.id}
                active={selectedUkony.includes(item.id)}
                onClick={() => toggleItem(setSelectedUkony, item.id)}
                title={item.label}
                subtitle={formatPrice(item.price)}
                multi
              />
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Doplňkové služby</SectionTitle>
          <div className="stack">
            {CENIK.doplnkove.map((item) => (
              <ChoiceButton
                key={item.id}
                active={selectedDoplnkove.includes(item.id)}
                onClick={() => toggleItem(setSelectedDoplnkove, item.id)}
                title={item.label}
                subtitle={formatPrice(item.price)}
                multi
              />
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Vybavení a operace</SectionTitle>
          <div className="stack">
            <div>
              <label className="label">Počet lékárniček</label>
              <input
                type="number"
                min="0"
                value={lekarnicky}
                onChange={(event) => setLekarnicky(Math.max(0, Number(event.target.value) || 0))}
                className="input"
              />
            </div>

            <label className="toggle-row">
              <input
                type="checkbox"
                checked={narocnaOperace}
                onChange={(event) => setNarocnaOperace(event.target.checked)}
              />
              <span>Přidat náročnou operaci</span>
            </label>

            {narocnaOperace ? (
              <div>
                <label className="label">Cena náročné operace od 70 000 do 200 000 $</label>
                <input
                  type="number"
                  min="70000"
                  max="200000"
                  step="1000"
                  value={cenaOperace}
                  onChange={(event) => setCenaOperace(event.target.value)}
                  className="input"
                />
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <SectionTitle>Souhrn</SectionTitle>
          <div className="stack">
            {souhrn.items.length > 0 ? (
              souhrn.items.map((item) => (
                <div key={item.id} className="summary-row">
                  <span>{item.label}</span>
                  <strong>{formatPrice(item.price)}</strong>
                </div>
              ))
            ) : (
              <div className="summary-empty">Zatím není vybrána žádná položka.</div>
            )}

            <div className="total-box">
              <div className="total-box__label">Celková cena</div>
              <div className="total-box__value">{formatPrice(souhrn.total)}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bottom-bar">
        <div className="bottom-bar__inner">
          <button type="button" onClick={resetAll} className="button button--secondary">
            Vymazat
          </button>
          <button type="button" onClick={copySummary} className="button button--primary">
            Kopírovat
          </button>
        </div>
      </div>
    </main>
  );
}
