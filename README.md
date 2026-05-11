# Los Santos EMS Kalkulačka

Rychlý mobilní web pro výpočet ceny ošetření a služeb. Připraveno pro nasazení na Vercel.

## Co umí

- výběr typu zásahu a převozu
- diagnostika
- zdravotní úkony
- doplňkové služby
- počet lékárniček
- volitelná náročná operace s ruční cenou
- okamžitý výpočet celkové ceny
- zkopírování souhrnu do schránky

## Spuštění lokálně

```bash
npm install
npm run dev
```

Potom otevři:

```bash
http://localhost:3000
```

## Nasazení na Vercel

1. Nahraj projekt na GitHub.
2. Ve Vercelu dej `Add New Project`.
3. Vyber repozitář.
4. Framework nech na `Next.js`.
5. Dej `Deploy`.

Není potřeba žádná databáze ani environment proměnné.

## Struktura

- `app/page.js` hlavní kalkulačka
- `app/layout.js` layout a metadata
- `app/globals.css` stylování

## Poznámka

Projekt je záměrně jednoduchý a rychlý pro použití na telefonu. Není v něm backend ani přihlášení.
