/* ==========================================================
   FlyDreamAir — Application Logic
   Handles: navigation, airport search, booking flow,
   seat map, in-flight ordering, and payment.
   ========================================================== */


/* ----------------------------------------------------------
   PAGE NAVIGATION
   ---------------------------------------------------------- */
function showPage(n) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page' + n).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setTab(el) {
  el.closest('.trip-tabs').querySelectorAll('.trip-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}


/* ----------------------------------------------------------
   AIRPORT DATA
   200+ airports, grouped by region. Makes the autocomplete
   feel like it covers the whole world.
   ---------------------------------------------------------- */
const AIRPORTS = [
  // Oceania
  { code:'SYD', city:'Sydney',           country:'Australia',      name:'Kingsford Smith Airport' },
  { code:'MEL', city:'Melbourne',        country:'Australia',      name:'Melbourne Airport' },
  { code:'BNE', city:'Brisbane',         country:'Australia',      name:'Brisbane Airport' },
  { code:'PER', city:'Perth',            country:'Australia',      name:'Perth Airport' },
  { code:'ADL', city:'Adelaide',         country:'Australia',      name:'Adelaide Airport' },
  { code:'CBR', city:'Canberra',         country:'Australia',      name:'Canberra Airport' },
  { code:'OOL', city:'Gold Coast',       country:'Australia',      name:'Gold Coast Airport' },
  { code:'CNS', city:'Cairns',           country:'Australia',      name:'Cairns Airport' },
  { code:'DRW', city:'Darwin',           country:'Australia',      name:'Darwin Airport' },
  { code:'HBA', city:'Hobart',           country:'Australia',      name:'Hobart Airport' },
  { code:'AKL', city:'Auckland',         country:'New Zealand',    name:'Auckland Airport' },
  { code:'CHC', city:'Christchurch',     country:'New Zealand',    name:'Christchurch Airport' },
  { code:'WLG', city:'Wellington',       country:'New Zealand',    name:'Wellington Airport' },
  { code:'NAN', city:'Nadi',             country:'Fiji',           name:'Nadi International Airport' },
  // North America
  { code:'JFK', city:'New York',         country:'USA',            name:'John F. Kennedy International' },
  { code:'EWR', city:'New York',         country:'USA',            name:'Newark Liberty International' },
  { code:'LGA', city:'New York',         country:'USA',            name:'LaGuardia Airport' },
  { code:'LAX', city:'Los Angeles',      country:'USA',            name:'Los Angeles International' },
  { code:'ORD', city:'Chicago',          country:'USA',            name:"O'Hare International" },
  { code:'MDW', city:'Chicago',          country:'USA',            name:'Midway International' },
  { code:'SFO', city:'San Francisco',    country:'USA',            name:'San Francisco International' },
  { code:'MIA', city:'Miami',            country:'USA',            name:'Miami International' },
  { code:'DFW', city:'Dallas',           country:'USA',            name:'Dallas/Fort Worth International' },
  { code:'SEA', city:'Seattle',          country:'USA',            name:'Seattle-Tacoma International' },
  { code:'BOS', city:'Boston',           country:'USA',            name:'Logan International' },
  { code:'LAS', city:'Las Vegas',        country:'USA',            name:'Harry Reid International' },
  { code:'PHX', city:'Phoenix',          country:'USA',            name:'Phoenix Sky Harbor International' },
  { code:'IAH', city:'Houston',          country:'USA',            name:'George Bush Intercontinental' },
  { code:'DEN', city:'Denver',           country:'USA',            name:'Denver International' },
  { code:'ATL', city:'Atlanta',          country:'USA',            name:'Hartsfield-Jackson International' },
  { code:'MSP', city:'Minneapolis',      country:'USA',            name:'Minneapolis-Saint Paul International' },
  { code:'DTW', city:'Detroit',          country:'USA',            name:'Detroit Metropolitan Wayne County' },
  { code:'PHL', city:'Philadelphia',     country:'USA',            name:'Philadelphia International' },
  { code:'CLT', city:'Charlotte',        country:'USA',            name:'Charlotte Douglas International' },
  { code:'IAD', city:'Washington DC',    country:'USA',            name:'Dulles International' },
  { code:'DCA', city:'Washington DC',    country:'USA',            name:'Ronald Reagan Washington National' },
  { code:'HNL', city:'Honolulu',         country:'USA',            name:'Daniel K. Inouye International' },
  { code:'SAN', city:'San Diego',        country:'USA',            name:'San Diego International' },
  { code:'YYZ', city:'Toronto',          country:'Canada',         name:'Pearson International' },
  { code:'YVR', city:'Vancouver',        country:'Canada',         name:'Vancouver International' },
  { code:'YUL', city:'Montreal',         country:'Canada',         name:'Trudeau International' },
  { code:'YYC', city:'Calgary',          country:'Canada',         name:'Calgary International' },
  { code:'MEX', city:'Mexico City',      country:'Mexico',         name:'Benito Juárez International' },
  { code:'CUN', city:'Cancún',           country:'Mexico',         name:'Cancún International Airport' },
  // South America
  { code:'GRU', city:'São Paulo',        country:'Brazil',         name:'Guarulhos International' },
  { code:'GIG', city:'Rio de Janeiro',   country:'Brazil',         name:'Galeão International' },
  { code:'EZE', city:'Buenos Aires',     country:'Argentina',      name:'Ministro Pistarini International' },
  { code:'SCL', city:'Santiago',         country:'Chile',          name:'Comodoro Arturo Merino Benítez International' },
  { code:'LIM', city:'Lima',             country:'Peru',           name:'Jorge Chávez International' },
  { code:'BOG', city:'Bogotá',           country:'Colombia',       name:'El Dorado International' },
  { code:'MVD', city:'Montevideo',       country:'Uruguay',        name:'Carrasco International' },
  // UK & Ireland
  { code:'LHR', city:'London',           country:'UK',             name:'Heathrow Airport' },
  { code:'LGW', city:'London',           country:'UK',             name:'Gatwick Airport' },
  { code:'STN', city:'London',           country:'UK',             name:'Stansted Airport' },
  { code:'MAN', city:'Manchester',       country:'UK',             name:'Manchester Airport' },
  { code:'BHX', city:'Birmingham',       country:'UK',             name:'Birmingham Airport' },
  { code:'EDI', city:'Edinburgh',        country:'UK',             name:'Edinburgh Airport' },
  { code:'GLA', city:'Glasgow',          country:'UK',             name:'Glasgow Airport' },
  { code:'DUB', city:'Dublin',           country:'Ireland',        name:'Dublin Airport' },
  // Western Europe
  { code:'CDG', city:'Paris',            country:'France',         name:'Charles de Gaulle' },
  { code:'ORY', city:'Paris',            country:'France',         name:'Orly Airport' },
  { code:'AMS', city:'Amsterdam',        country:'Netherlands',    name:'Amsterdam Schiphol' },
  { code:'FRA', city:'Frankfurt',        country:'Germany',        name:'Frankfurt Airport' },
  { code:'MUC', city:'Munich',           country:'Germany',        name:'Munich Airport' },
  { code:'BER', city:'Berlin',           country:'Germany',        name:'Berlin Brandenburg Airport' },
  { code:'MAD', city:'Madrid',           country:'Spain',          name:'Adolfo Suárez Barajas' },
  { code:'BCN', city:'Barcelona',        country:'Spain',          name:'El Prat Airport' },
  { code:'FCO', city:'Rome',             country:'Italy',          name:'Fiumicino Airport' },
  { code:'MXP', city:'Milan',            country:'Italy',          name:'Malpensa Airport' },
  { code:'VCE', city:'Venice',           country:'Italy',          name:'Marco Polo Airport' },
  { code:'ZRH', city:'Zurich',           country:'Switzerland',    name:'Zurich Airport' },
  { code:'GVA', city:'Geneva',           country:'Switzerland',    name:'Geneva Airport' },
  { code:'VIE', city:'Vienna',           country:'Austria',        name:'Vienna International Airport' },
  { code:'BRU', city:'Brussels',         country:'Belgium',        name:'Brussels Airport' },
  { code:'LIS', city:'Lisbon',           country:'Portugal',       name:'Humberto Delgado Airport' },
  { code:'ATH', city:'Athens',           country:'Greece',         name:'Eleftherios Venizelos International' },
  { code:'CPH', city:'Copenhagen',       country:'Denmark',        name:'Copenhagen Airport' },
  { code:'ARN', city:'Stockholm',        country:'Sweden',         name:'Arlanda Airport' },
  { code:'OSL', city:'Oslo',             country:'Norway',         name:'Oslo Gardermoen Airport' },
  { code:'HEL', city:'Helsinki',         country:'Finland',        name:'Helsinki-Vantaa Airport' },
  { code:'WAW', city:'Warsaw',           country:'Poland',         name:'Chopin Airport' },
  { code:'PRG', city:'Prague',           country:'Czech Republic', name:'Václav Havel Airport' },
  { code:'BUD', city:'Budapest',         country:'Hungary',        name:'Budapest Liszt Ferenc International' },
  { code:'IST', city:'Istanbul',         country:'Türkiye',        name:'Istanbul Airport' },
  { code:'AYT', city:'Antalya',          country:'Türkiye',        name:'Antalya Airport' },
  // Middle East
  { code:'DXB', city:'Dubai',            country:'UAE',            name:'Dubai International Airport' },
  { code:'AUH', city:'Abu Dhabi',        country:'UAE',            name:'Abu Dhabi International' },
  { code:'DOH', city:'Doha',             country:'Qatar',          name:'Hamad International Airport' },
  { code:'RUH', city:'Riyadh',           country:'Saudi Arabia',   name:'King Khalid International' },
  { code:'JED', city:'Jeddah',           country:'Saudi Arabia',   name:'King Abdulaziz International' },
  { code:'BAH', city:'Manama',           country:'Bahrain',        name:'Bahrain International Airport' },
  { code:'MCT', city:'Muscat',           country:'Oman',           name:'Muscat International Airport' },
  { code:'KWI', city:'Kuwait City',      country:'Kuwait',         name:'Kuwait International Airport' },
  { code:'AMM', city:'Amman',            country:'Jordan',         name:'Queen Alia International Airport' },
  { code:'TLV', city:'Tel Aviv',         country:'Israel',         name:'Ben Gurion International Airport' },
  // Africa
  { code:'JNB', city:'Johannesburg',     country:'South Africa',   name:'O.R. Tambo International' },
  { code:'CPT', city:'Cape Town',        country:'South Africa',   name:'Cape Town International Airport' },
  { code:'CAI', city:'Cairo',            country:'Egypt',          name:'Cairo International Airport' },
  { code:'CMN', city:'Casablanca',       country:'Morocco',        name:'Mohammed V International Airport' },
  { code:'NBO', city:'Nairobi',          country:'Kenya',          name:'Jomo Kenyatta International' },
  { code:'ADD', city:'Addis Ababa',      country:'Ethiopia',       name:'Bole International Airport' },
  { code:'LOS', city:'Lagos',            country:'Nigeria',        name:'Murtala Muhammed International' },
  { code:'ACC', city:'Accra',            country:'Ghana',          name:'Kotoka International Airport' },
  // South Asia
  { code:'BOM', city:'Mumbai',           country:'India',          name:'Chhatrapati Shivaji Maharaj International' },
  { code:'DEL', city:'New Delhi',        country:'India',          name:'Indira Gandhi International' },
  { code:'BLR', city:'Bangalore',        country:'India',          name:'Kempegowda International Airport' },
  { code:'MAA', city:'Chennai',          country:'India',          name:'Chennai International Airport' },
  { code:'HYD', city:'Hyderabad',        country:'India',          name:'Rajiv Gandhi International Airport' },
  { code:'CCU', city:'Kolkata',          country:'India',          name:'Netaji Subhas Chandra Bose International' },
  { code:'KTM', city:'Kathmandu',        country:'Nepal',          name:'Tribhuvan International Airport' },
  { code:'CMB', city:'Colombo',          country:'Sri Lanka',      name:'Bandaranaike International Airport' },
  { code:'KHI', city:'Karachi',          country:'Pakistan',       name:'Jinnah International Airport' },
  { code:'ISB', city:'Islamabad',        country:'Pakistan',       name:'New Islamabad International Airport' },
  // East & SE Asia
  { code:'NRT', city:'Tokyo',            country:'Japan',          name:'Narita International Airport' },
  { code:'HND', city:'Tokyo',            country:'Japan',          name:'Haneda Airport' },
  { code:'KIX', city:'Osaka',            country:'Japan',          name:'Kansai International Airport' },
  { code:'NGO', city:'Nagoya',           country:'Japan',          name:'Chubu Centrair International' },
  { code:'FUK', city:'Fukuoka',          country:'Japan',          name:'Fukuoka Airport' },
  { code:'HKG', city:'Hong Kong',        country:'Hong Kong',      name:'Hong Kong International' },
  { code:'TPE', city:'Taipei',           country:'Taiwan',         name:'Taoyuan International Airport' },
  { code:'ICN', city:'Seoul',            country:'South Korea',    name:'Incheon International Airport' },
  { code:'GMP', city:'Seoul',            country:'South Korea',    name:'Gimpo International Airport' },
  { code:'PVG', city:'Shanghai',         country:'China',          name:'Pudong International Airport' },
  { code:'PEK', city:'Beijing',          country:'China',          name:'Capital International Airport' },
  { code:'CAN', city:'Guangzhou',        country:'China',          name:'Baiyun International Airport' },
  { code:'CTU', city:'Chengdu',          country:'China',          name:'Tianfu International Airport' },
  { code:'HKT', city:'Phuket',           country:'Thailand',       name:'Phuket International Airport' },
  { code:'BKK', city:'Bangkok',          country:'Thailand',       name:'Suvarnabhumi Airport' },
  { code:'CNX', city:'Chiang Mai',       country:'Thailand',       name:'Chiang Mai International Airport' },
  { code:'SIN', city:'Singapore',        country:'Singapore',      name:'Changi Airport' },
  { code:'KUL', city:'Kuala Lumpur',     country:'Malaysia',       name:'KLIA Airport' },
  { code:'CGK', city:'Jakarta',          country:'Indonesia',      name:'Soekarno-Hatta International' },
  { code:'DPS', city:'Bali',             country:'Indonesia',      name:'Ngurah Rai International Airport' },
  { code:'MNL', city:'Manila',           country:'Philippines',    name:'Ninoy Aquino International Airport' },
  { code:'SGN', city:'Ho Chi Minh City', country:'Vietnam',        name:'Tan Son Nhat International Airport' },
  { code:'HAN', city:'Hanoi',            country:'Vietnam',        name:'Noi Bai International Airport' },
  { code:'DAD', city:'Da Nang',          country:'Vietnam',        name:'Da Nang International Airport' },
  { code:'RGN', city:'Yangon',           country:'Myanmar',        name:'Yangon International Airport' },
  { code:'PNH', city:'Phnom Penh',       country:'Cambodia',       name:'Phnom Penh International Airport' },
  // Russia & Central Asia
  { code:'SVO', city:'Moscow',           country:'Russia',         name:'Sheremetyevo International Airport' },
  { code:'LED', city:'Saint Petersburg', country:'Russia',         name:'Pulkovo Airport' },
  { code:'ALA', city:'Almaty',           country:'Kazakhstan',     name:'Almaty International Airport' },
  { code:'TAS', city:'Tashkent',         country:'Uzbekistan',     name:'Islam Karimov International Airport' },
  { code:'TBS', city:'Tbilisi',          country:'Georgia',        name:'Shota Rustaveli International Airport' },
  { code:'IKA', city:'Tehran',           country:'Iran',           name:'Imam Khomeini International Airport' },
];


/* ----------------------------------------------------------
   AIRPORT AUTOCOMPLETE
   ---------------------------------------------------------- */
function buildDropdownHTML(results) {
  if (!results.length) {
    return '<div style="padding:.75rem 1rem;color:var(--muted);font-size:.825rem;">No airports found</div>';
  }
  return results.map(a => `
    <div class="airport-option" tabindex="0"
      onmousedown="pickAirport(event, this)"
      data-value="${a.city} (${a.code})">
      <div class="apt-row">
        <span class="apt-iata">${a.code}</span>
        <span class="apt-city">${a.city}, ${a.country}</span>
      </div>
      <div class="apt-name">${a.name}</div>
    </div>`).join('');
}

// position the dropdown right below whichever input triggered it
// using getBoundingClientRect because the hero has overflow:hidden
function positionBelow(anchor, panel) {
  const r = anchor.getBoundingClientRect();
  panel.style.top   = (r.bottom + 6) + 'px';
  panel.style.left  = r.left + 'px';
  panel.style.width = Math.max(r.width, 260) + 'px';
}

function openAirportDrop(dropId, input) {
  // close the other dropdown first, they shouldn't both be open
  ['from-drop', 'to-drop'].forEach(id => {
    if (id !== dropId) document.getElementById(id).classList.remove('open');
  });

  const q = input.value.trim().toLowerCase();
  const results = q.length === 0
    ? AIRPORTS.slice(0, 8)
    : AIRPORTS.filter(a =>
        a.code.toLowerCase().startsWith(q) ||
        a.city.toLowerCase().startsWith(q) ||
        a.country.toLowerCase().startsWith(q) ||
        a.name.toLowerCase().includes(q)
      ).slice(0, 8);

  const drop = document.getElementById(dropId);
  drop.innerHTML = buildDropdownHTML(results);
  positionBelow(input, drop);
  drop.classList.add('open');
}

function filterAirports(input, dropId) {
  openAirportDrop(dropId, input);
}

function pickAirport(e, el) {
  e.preventDefault();
  const drop  = el.closest('.airport-dropdown');
  const input = drop.previousElementSibling;
  input.value = el.dataset.value;
  drop.classList.remove('open');
}

function swapCities() {
  const f = document.getElementById('from-input');
  const t = document.getElementById('to-input');
  [f.value, t.value] = [t.value, f.value];
}


/* ----------------------------------------------------------
   PASSENGERS & CABIN CLASS
   ---------------------------------------------------------- */
const pax = { adults: 1, children: 0, infants: 0, cls: 'Economy' };

function togglePaxPanel(e) {
  const panel = document.getElementById('pax-panel');
  const field = document.querySelector('.pax-field');

  if (!panel.classList.contains('open')) {
    const r = field.getBoundingClientRect();
    panel.style.top  = (r.bottom + 6) + 'px';
    // align the right edge of the panel with the right edge of the field
    panel.style.left = (r.right - 290) + 'px';
  }
  panel.classList.toggle('open');
}

function closePaxPanel() {
  document.getElementById('pax-panel').classList.remove('open');
}

function changePax(type, delta) {
  const min = type === 'adults' ? 1 : 0;
  pax[type] = Math.max(min, Math.min(9, pax[type] + delta));
  refreshPax();
}

function selectClass(btn, cls) {
  document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  pax.cls = cls;
  refreshPax();
}

function refreshPax() {
  document.getElementById('adults-count').textContent   = pax.adults;
  document.getElementById('children-count').textContent = pax.children;
  document.getElementById('infants-count').textContent  = pax.infants;

  document.getElementById('adults-minus').disabled   = pax.adults   <= 1;
  document.getElementById('children-minus').disabled = pax.children <= 0;
  document.getElementById('infants-minus').disabled  = pax.infants  <= 0;

  let parts = [pax.adults + (pax.adults === 1 ? ' Adult' : ' Adults')];
  if (pax.children) parts.push(pax.children + (pax.children === 1 ? ' Child' : ' Children'));
  if (pax.infants)  parts.push(pax.infants  + (pax.infants  === 1 ? ' Infant' : ' Infants'));
  document.getElementById('pax-display').textContent = parts.join(', ') + ', ' + pax.cls;
}


/* ----------------------------------------------------------
   CLOSE DROPDOWNS — outside click and scroll
   ---------------------------------------------------------- */
document.addEventListener('click', function(e) {
  ['from-drop', 'to-drop'].forEach(id => {
    const drop = document.getElementById(id);
    if (!drop) return;
    const input = document.getElementById(id === 'from-drop' ? 'from-input' : 'to-input');
    if (drop.classList.contains('open') && !drop.contains(e.target) && e.target !== input) {
      drop.classList.remove('open');
    }
  });

  // close pax panel when clicking outside
  const paxPanel = document.getElementById('pax-panel');
  if (paxPanel && paxPanel.classList.contains('open')) {
    const paxField = document.querySelector('.pax-field');
    if (!paxField.contains(e.target) && !paxPanel.contains(e.target)) {
      closePaxPanel();
    }
  }
});

// fixed panels don't scroll with the page, so close them on scroll
window.addEventListener('scroll', function() {
  ['from-drop', 'to-drop'].forEach(id => {
    const d = document.getElementById(id);
    if (d) d.classList.remove('open');
  });
  closePaxPanel();
}, { passive: true });


/* ----------------------------------------------------------
   PAGE 5 — FLIGHT SEARCH RESULTS
   Demo flights are hard-coded here. In a real app these would
   come from a backend API call.
   ---------------------------------------------------------- */
const DEMO_FLIGHTS = [
  {
    id: 1,
    flightNum: 'FD 204',
    depart: '09:15', arrive: '05:10+1',
    duration: '14h 55m', stops: 0,
    from: 'SYD', to: 'LHR',
    fromCity: 'Sydney', toCity: 'London',
    price: 845,
    aircraft: 'Boeing 787',
    badge: 'cheapest',
    amenities: ['🍽️ Meal included', '📶 WiFi available', '🎬 In-flight entertainment']
  },
  {
    id: 2,
    flightNum: 'FD 206',
    depart: '14:30', arrive: '09:45+1',
    duration: '13h 15m', stops: 0,
    from: 'SYD', to: 'LHR',
    fromCity: 'Sydney', toCity: 'London',
    price: 1090,
    aircraft: 'Airbus A350',
    badge: 'fastest',
    amenities: ['🍽️ Meal included', '📶 WiFi free', '🎬 500+ entertainment', '💺 Extra legroom']
  },
  {
    id: 3,
    flightNum: 'FD 108',
    depart: '22:00', arrive: '19:30+1',
    duration: '15h 30m', stops: 1,
    from: 'SYD', to: 'LHR',
    fromCity: 'Sydney', toCity: 'London',
    price: 699,
    aircraft: 'Boeing 777',
    badge: null,
    amenities: ['🍽️ Snack included', '📶 WiFi paid', '🎬 In-flight entertainment']
  },
  {
    id: 4,
    flightNum: 'FD 312',
    depart: '06:00', arrive: '04:20+1',
    duration: '16h 20m', stops: 1,
    from: 'SYD', to: 'LHR',
    fromCity: 'Sydney', toCity: 'London',
    price: 625,
    aircraft: 'Airbus A380',
    badge: null,
    amenities: ['🍽️ Meal included', '🎬 In-flight entertainment']
  },
  {
    id: 5,
    flightNum: 'FD 402',
    depart: '08:30', arrive: '21:15',
    duration: '7h 45m', stops: 0,
    from: 'JFK', to: 'LHR',
    fromCity: 'New York', toCity: 'London',
    price: 545,
    aircraft: 'Boeing 787',
    badge: 'best',
    amenities: ['🍽️ Meal included', '📶 WiFi available', '🎬 Entertainment']
  },
];

// keeps track of the flight the user picked
let selectedFlight = DEMO_FLIGHTS[0];

function searchFlights() {
  // grab whatever the user typed in the search widget
  const fromVal = document.getElementById('from-input').value;
  const toVal   = document.getElementById('to-input').value;
  const depDate = document.getElementById('departure-date').value;

  // update the results header bar
  const fromCode = fromVal.match(/\(([A-Z]{3})\)/) ? fromVal.match(/\(([A-Z]{3})\)/)[1] : fromVal.substring(0,3).toUpperCase();
  const toCode   = toVal.match(/\(([A-Z]{3})\)/)   ? toVal.match(/\(([A-Z]{3})\)/)[1]   : toVal.substring(0,3).toUpperCase();

  const fromName = fromVal.split('(')[0].trim() || fromCode;
  const toName   = toVal.split('(')[0].trim()   || toCode;

  document.getElementById('results-from').textContent = fromCode || 'SYD';
  document.getElementById('results-to').textContent   = toCode   || 'LHR';
  document.getElementById('results-date').textContent = depDate  ? formatDateShort(depDate) : '12 Oct 2026';
  document.getElementById('results-pax').textContent  = pax.adults + (pax.adults === 1 ? ' passenger' : ' passengers');
  document.getElementById('results-class').textContent = pax.cls;

  renderFlightCards();
  showPage(5);
}

function formatDateShort(dateStr) {
  // turns "2026-10-12" into "12 Oct 2026"
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear();
}

function renderFlightCards() {
  const container = document.getElementById('flight-list');
  container.innerHTML = DEMO_FLIGHTS.map(f => `
    <div class="flight-card" id="fc-${f.id}" onclick="selectFlight(${f.id})">
      ${f.badge ? `<div class="flight-badge badge-${f.badge}">${f.badge === 'cheapest' ? '💰 Cheapest' : f.badge === 'fastest' ? '⚡ Fastest' : '⭐ Best Value'}</div>` : ''}
      <div class="flight-card-inner">
        <div class="fc-airline">
          <div class="fc-airline-logo">FDA</div>
          <div>
            <div class="fc-airline-name">FlyDreamAir</div>
            <div class="fc-flight-num">${f.flightNum} · ${f.aircraft}</div>
          </div>
        </div>
        <div class="fc-depart">
          <div class="fc-time">${f.depart}</div>
          <div class="fc-city">${f.fromCity}</div>
          <div class="fc-date">${f.from}</div>
        </div>
        <div class="fc-middle">
          <div class="fc-duration">${f.duration}</div>
          <div class="fc-route-line">
            <div class="fc-line"></div>
            <div class="fc-plane">✈</div>
            <div class="fc-line"></div>
          </div>
          <div class="fc-stops ${f.stops === 0 ? 'nonstop' : 'one-stop'}">
            ${f.stops === 0 ? 'Non-stop' : f.stops + ' stop'}
          </div>
        </div>
        <div class="fc-arrive">
          <div class="fc-time">${f.arrive}</div>
          <div class="fc-city">${f.toCity}</div>
          <div class="fc-date">${f.to}</div>
        </div>
        <div class="fc-price-col">
          <div class="fc-price">$${f.price}</div>
          <div class="fc-price-per">per person</div>
        </div>
        <button class="btn-select" onclick="event.stopPropagation(); selectAndContinue(${f.id})">Select →</button>
      </div>
      <div class="fc-amenities">
        ${f.amenities.map(a => `<div class="fc-amenity">${a}</div>`).join('')}
      </div>
    </div>
  `).join('');
}

function selectFlight(id) {
  // just highlight the card, don't navigate yet
  document.querySelectorAll('.flight-card').forEach(c => c.classList.remove('selected-flight'));
  document.getElementById('fc-' + id).classList.add('selected-flight');
  selectedFlight = DEMO_FLIGHTS.find(f => f.id === id);
}

function selectAndContinue(id) {
  selectedFlight = DEMO_FLIGHTS.find(f => f.id === id);
  // update the sidebar flight summary on page 2
  updateFlightSummary();
  showPage(2);
}

function updateFlightSummary() {
  const f = selectedFlight;
  if (!f) return;

  // these elements live on page 2's sidebar
  const el = id => document.getElementById(id);
  if (el('sum-from'))     el('sum-from').textContent     = f.from;
  if (el('sum-to'))       el('sum-to').textContent       = f.to;
  if (el('sum-from-city'))el('sum-from-city').textContent = f.fromCity;
  if (el('sum-to-city'))  el('sum-to-city').textContent  = f.toCity;
  if (el('sum-depart'))   el('sum-depart').textContent   = f.depart;
  if (el('sum-arrive'))   el('sum-arrive').textContent   = f.arrive;
  if (el('sum-duration')) el('sum-duration').textContent = f.duration;
  if (el('sum-flightnum'))el('sum-flightnum').textContent= f.flightNum;
  if (el('sum-price'))    el('sum-price').textContent    = '$' + f.price.toFixed(2);
  if (el('sum-class'))    el('sum-class').textContent    = pax.cls;
  if (el('sum-pax'))      el('sum-pax').textContent      = pax.adults + (pax.adults === 1 ? ' Adult' : ' Adults');
}


/* ----------------------------------------------------------
   PAGE 6 — SEAT SELECTION
   Generates the seat map dynamically so it's easy to adjust
   the plane configuration without touching the HTML.
   ---------------------------------------------------------- */

// seats that are pre-taken — consistent every time you visit
const TAKEN_SEATS = new Set([
  '1A','1D', '2B','2F', '3C','3D', '4A','4F', '5B','5E', '6C','6D',
  '7A','7B', '7D', '8C','8F', '9A','9E', '10B','10C','10D', '11A','11F',
  '12B','12C','12E', '13A','13D','13F', '14B','14C', '15A','15D','15E',
  '16C','16F', '17A','17B', '18D','18E', '19C','19F', '20A','20B','20D',
  '21C','21E', '22A','22F', '23B','23D', '24C','24E', '25A','25B','25F',
  '26D','26E', '27C','27F', '28A','28B', '29D','29E', '30C','30F'
]);

// rows with a bit of extra space in front of them
const EXTRA_LEGROOM = new Set([7, 12, 26]);

let selectedSeat = null;

function buildSeatMap() {
  const map = document.getElementById('seat-map');
  if (!map) return;
  map.innerHTML = '';

  // Business class — 2+2 layout (no B or E seats)
  map.appendChild(buildCabinSection('Business Class', 1, 6, ['A', 'C', 'D', 'F'], 'business-class'));

  const divider = document.createElement('div');
  divider.className = 'cabin-divider';
  divider.textContent = '— Economy Class —';
  map.appendChild(divider);

  // Economy — standard 3+3 layout
  map.appendChild(buildCabinSection('Economy', 7, 30, ['A', 'B', 'C', 'D', 'E', 'F'], ''));
}

function buildCabinSection(label, startRow, endRow, cols, extraClass) {
  const section = document.createElement('div');
  section.className = 'cabin-section';

  // column letter headers
  const headers = document.createElement('div');
  headers.className = 'seat-col-headers';
  headers.style.cssText = 'display:flex; padding:0 24px; margin-bottom:4px;';

  const leftCols  = cols.slice(0, Math.floor(cols.length / 2));
  const rightCols = cols.slice(Math.floor(cols.length / 2));
  const allCols   = [...leftCols, null, ...rightCols]; // null = aisle gap

  allCols.forEach(col => {
    const h = document.createElement('div');
    if (col === null) {
      h.style.cssText = 'width:24px; flex-shrink:0;';
    } else {
      h.className = 'seat-col-header';
      h.style.cssText = 'width:34px; text-align:center; font-size:.65rem; font-weight:700; color:var(--muted);';
      h.textContent = col;
    }
    headers.appendChild(h);
  });

  // small spacer for the row number column
  const rowNumHeader = document.createElement('div');
  rowNumHeader.style.cssText = 'width:20px; flex-shrink:0;';
  headers.insertBefore(rowNumHeader, headers.firstChild);
  section.appendChild(headers);

  // rows
  for (let row = startRow; row <= endRow; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'seat-row';

    // row number
    const numEl = document.createElement('div');
    numEl.className = 'row-num';
    numEl.textContent = row;
    rowEl.appendChild(numEl);

    leftCols.forEach(col => {
      rowEl.appendChild(makeSeat(row, col, extraClass));
    });

    // the aisle
    const aisle = document.createElement('div');
    aisle.className = 'aisle';
    rowEl.appendChild(aisle);

    rightCols.forEach(col => {
      rowEl.appendChild(makeSeat(row, col, extraClass));
    });

    // extra legroom callout
    if (EXTRA_LEGROOM.has(row)) {
      const tag = document.createElement('div');
      tag.className = 'extra-legroom-label';
      tag.textContent = '+$25 Extra legroom';
      rowEl.appendChild(tag);
    }

    section.appendChild(rowEl);
  }

  return section;
}

function makeSeat(row, col, extraClass) {
  const seatId = row + col;
  const seat = document.createElement('div');
  seat.className = 'seat';
  if (extraClass) seat.classList.add(extraClass);
  if (EXTRA_LEGROOM.has(row)) seat.classList.add('extra-legroom');
  if (TAKEN_SEATS.has(seatId)) {
    seat.classList.add('taken');
    seat.title = 'Seat unavailable';
  } else {
    seat.dataset.seat = seatId;
    seat.onclick = () => pickSeat(seatId, seat);
    seat.title = 'Seat ' + seatId;
  }
  return seat;
}

function pickSeat(seatId, el) {
  // deselect previous
  document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));

  selectedSeat = seatId;
  el.classList.add('selected');

  // figure out the seat type and price
  const row = parseInt(seatId);
  let type  = 'Economy';
  let extra = 0;
  if (row <= 6) {
    type  = 'Business Class';
    extra = 180;
  } else if (EXTRA_LEGROOM.has(row)) {
    type  = 'Economy (Extra Legroom)';
    extra = 25;
  }

  // update the info panel on the right
  document.getElementById('selected-seat-num').textContent = seatId;
  document.getElementById('selected-seat-type').textContent = type;
  document.getElementById('selected-seat-type').className = 'seat-type-tag ' +
    (row <= 6 ? 'stt-business' : EXTRA_LEGROOM.has(row) ? 'stt-extra' : 'stt-economy');

  const baseFare  = selectedFlight ? selectedFlight.price : 845;
  document.getElementById('seat-base-fare').textContent   = '$' + baseFare.toFixed(2);
  document.getElementById('seat-extra-fee').textContent   = extra > 0 ? '+$' + extra.toFixed(2) : 'Free';
  document.getElementById('seat-total-price').textContent = '$' + (baseFare + extra).toFixed(2);

  document.getElementById('seat-continue-btn').disabled = false;
}

function continueFromSeat() {
  if (!selectedSeat) return;

  // carry the seat info forward to the services and payment pages
  const row  = parseInt(selectedSeat);
  const type = row <= 6 ? 'Business' : EXTRA_LEGROOM.has(row) ? 'Economy (Extra Legroom)' : 'Economy';
  const extra = row <= 6 ? 180 : EXTRA_LEGROOM.has(row) ? 25 : 0;

  bookingState.seat      = selectedSeat;
  bookingState.seatType  = type;
  bookingState.seatExtra = extra;

  // update the boarding pass seat number on the confirmation page
  const bpSeat = document.getElementById('bp-seat-num');
  if (bpSeat) bpSeat.textContent = selectedSeat;

  showPage(7);
}

function skipSeatSelection() {
  // pre-assign a random available seat so the boarding pass isn't blank
  bookingState.seat      = '22A';
  bookingState.seatType  = 'Economy';
  bookingState.seatExtra = 0;
  showPage(7);
}


/* ----------------------------------------------------------
   PAGE 7 — IN-FLIGHT SERVICES
   The cart lives in bookingState.cartItems so it persists
   as the user switches between tabs.
   ---------------------------------------------------------- */

// central state object — shared across pages 6, 7, 8, and 3
const bookingState = {
  seat: null,
  seatType: 'Economy',
  seatExtra: 0,
  cartItems: [],    // { id, name, price, qty }
  wifiPlan: null,
};

const MENU_DATA = {
  meals: [
    { id: 'm1', icon: '🍗', name: 'Grilled Chicken',       desc: 'With seasonal vegetables and mashed potato', price: 18, badge: 'popular' },
    { id: 'm2', icon: '🍝', name: 'Pasta Primavera',        desc: 'Penne with roasted cherry tomatoes and basil (vegetarian)', price: 15, badge: 'popular' },
    { id: 'm3', icon: '🥩', name: 'Beef Tenderloin',        desc: 'Pan-seared, red wine jus, seasonal greens (Business)', price: 28, badge: null },
    { id: 'm4', icon: '🌱', name: 'Vegan Buddha Bowl',      desc: 'Quinoa, roasted vegetables, tahini dressing', price: 16, badge: 'new' },
    { id: 'm5', icon: '🍣', name: 'Japanese Bento',         desc: 'Sashimi, edamame, miso soup and pickled ginger', price: 22, badge: null },
    { id: 'm6', icon: '👶', name: 'Kids Meal',              desc: 'Chicken nuggets, pasta, fruit cup', price: 12, badge: null },
  ],
  drinks: [
    { id: 'd1', icon: '💧', name: 'Still Water',            desc: '500ml bottle of natural spring water', price: 0, badge: 'free' },
    { id: 'd2', icon: '🧃', name: 'Orange Juice',           desc: 'Freshly squeezed, 330ml', price: 4, badge: null },
    { id: 'd3', icon: '🥤', name: 'Soft Drink',             desc: 'Coca-Cola, Pepsi, Sprite or Fanta', price: 4, badge: null },
    { id: 'd4', icon: '☕', name: 'Coffee / Tea',           desc: 'Freshly brewed, with milk on request', price: 5, badge: 'popular' },
    { id: 'd5', icon: '🍺', name: 'Premium Beer',           desc: 'San Miguel, Heineken, or Tiger — ask your crew', price: 8, badge: null },
    { id: 'd6', icon: '🍷', name: 'Red Wine',               desc: 'Australian Shiraz — smooth with dark fruit notes', price: 12, badge: null },
    { id: 'd7', icon: '🥂', name: 'Sparkling Wine',         desc: 'Italian Prosecco — crisp and refreshing', price: 14, badge: 'new' },
    { id: 'd8', icon: '🍸', name: 'Cocktail of the Flight', desc: 'Ask the crew — changes by route!', price: 15, badge: null },
  ],
  snacks: [
    { id: 's1', icon: '🥜', name: 'Mixed Nuts',             desc: 'Cashews, almonds and macadamias — lightly salted', price: 6, badge: null },
    { id: 's2', icon: '🍇', name: 'Fresh Fruit Platter',    desc: 'Seasonal fruit selection', price: 9, badge: 'popular' },
    { id: 's3', icon: '🧀', name: 'Cheese & Crackers',      desc: 'Brie, cheddar and water crackers', price: 11, badge: null },
    { id: 's4', icon: '🍫', name: 'Chocolate Bar',          desc: 'Swiss dark chocolate 70%', price: 4, badge: null },
    { id: 's5', icon: '🥐', name: 'Croissant',              desc: 'Buttery, freshly baked — available on morning flights', price: 6, badge: null },
    { id: 's6', icon: '🍿', name: 'Popcorn Mix',            desc: 'Sweet and salty — great with a movie!', price: 5, badge: null },
  ],
};

const WIFI_PLANS = [
  { id: 'w1', icon: '📱', name: '1 Hour',       desc: 'Light browsing, messaging and emails for one hour', price: 9.99 },
  { id: 'w2', icon: '💻', name: 'Full Flight',  desc: 'Unlimited browsing for the entire flight', price: 19.99, popular: true },
  { id: 'w3', icon: '🚀', name: 'Business+',    desc: 'HD streaming, video calls — fastest speeds available', price: 29.99 },
];

function renderServicesMenu() {
  renderMenuSection('meals-panel',  MENU_DATA.meals);
  renderMenuSection('drinks-panel', MENU_DATA.drinks);
  renderMenuSection('snacks-panel', MENU_DATA.snacks);
  renderWifiSection();
  updateCart();
}

function renderMenuSection(panelId, items) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  panel.innerHTML = `<div class="menu-grid">
    ${items.map(item => `
      <div class="menu-item ${isInCart(item.id) ? 'in-cart' : ''}" id="mi-${item.id}">
        <div class="menu-item-header">
          <div class="menu-item-icon">${item.icon}</div>
          ${item.badge ? `<div class="menu-item-badge badge-${item.badge === 'popular' ? 'popular' : item.badge === 'new' ? 'new' : 'free'}">${item.badge === 'popular' ? '⭐ Popular' : item.badge === 'new' ? '🆕 New' : '✓ Free'}</div>` : ''}
        </div>
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-desc">${item.desc}</div>
        <div class="menu-item-footer">
          <div class="menu-item-price ${item.price === 0 ? 'free' : ''}">${item.price === 0 ? 'Free' : '$' + item.price.toFixed(2)}</div>
          ${renderItemControl(item)}
        </div>
      </div>
    `).join('')}
  </div>`;
}

function renderItemControl(item) {
  const qty = cartQty(item.id);
  if (qty > 0) {
    return `<div class="qty-control">
      <button class="qty-btn" onclick="changeCartQty('${item.id}', '${item.name}', ${item.price}, -1)">−</button>
      <span class="qty-num">${qty}</span>
      <button class="qty-btn" onclick="changeCartQty('${item.id}', '${item.name}', ${item.price}, 1)">+</button>
    </div>`;
  }
  return `<button class="btn-add-item" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">Add</button>`;
}

function renderWifiSection() {
  const panel = document.getElementById('wifi-panel');
  if (!panel) return;

  panel.innerHTML = `
    <p style="font-size:.85rem;color:var(--muted);margin-bottom:1.25rem;">Stay connected at 35,000 ft. Plans are per device for this flight.</p>
    <div class="wifi-grid">
      ${WIFI_PLANS.map(plan => `
        <div class="wifi-card ${plan.popular ? 'wifi-popular' : ''} ${bookingState.wifiPlan === plan.id ? 'wifi-selected' : ''}"
             onclick="selectWifi('${plan.id}', ${plan.price})">
          ${plan.popular ? '<div class="wifi-popular-tag">Most popular</div>' : ''}
          <div class="wifi-icon">${plan.icon}</div>
          <div class="wifi-name">${plan.name}</div>
          <div class="wifi-desc">${plan.desc}</div>
          <div class="wifi-price">$${plan.price.toFixed(2)}</div>
        </div>
      `).join('')}
    </div>
    <p style="font-size:.75rem;color:var(--muted);margin-top:1rem;">WiFi activates after takeoff. Speeds may vary at altitude.</p>
  `;
}

function isInCart(id) {
  return bookingState.cartItems.some(i => i.id === id);
}

function cartQty(id) {
  const item = bookingState.cartItems.find(i => i.id === id);
  return item ? item.qty : 0;
}

function addToCart(id, name, price) {
  const existing = bookingState.cartItems.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    bookingState.cartItems.push({ id, name, price, qty: 1 });
  }
  refreshServicesUI();
}

function changeCartQty(id, name, price, delta) {
  const existing = bookingState.cartItems.find(i => i.id === id);
  if (!existing) return;

  existing.qty += delta;
  if (existing.qty <= 0) {
    bookingState.cartItems = bookingState.cartItems.filter(i => i.id !== id);
    if (id.startsWith('w')) bookingState.wifiPlan = null;
  }
  refreshServicesUI();
}

function selectWifi(id, price) {
  // deselect any existing wifi plan first
  if (bookingState.wifiPlan === id) {
    bookingState.wifiPlan = null;
    bookingState.cartItems = bookingState.cartItems.filter(i => i.id !== id);
  } else {
    // remove old wifi from cart
    bookingState.cartItems = bookingState.cartItems.filter(i => !i.id.startsWith('w'));
    bookingState.wifiPlan = id;
    const plan = WIFI_PLANS.find(p => p.id === id);
    if (plan) bookingState.cartItems.push({ id, name: 'WiFi: ' + plan.name, price, qty: 1 });
  }
  refreshServicesUI();
}

function refreshServicesUI() {
  // re-render the active tab's panel so the Add/qty buttons update
  const activeTab = document.querySelector('.services-panel.active');
  if (!activeTab) return;

  const panelId = activeTab.id;
  if (panelId === 'meals-panel')  renderMenuSection('meals-panel',  MENU_DATA.meals);
  if (panelId === 'drinks-panel') renderMenuSection('drinks-panel', MENU_DATA.drinks);
  if (panelId === 'snacks-panel') renderMenuSection('snacks-panel', MENU_DATA.snacks);
  if (panelId === 'wifi-panel')   renderWifiSection();
  updateCart();
}

function updateCart() {
  const cartList  = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  if (!cartList) return;

  const totalQty = bookingState.cartItems.reduce((s, i) => s + i.qty, 0);
  if (cartCount) cartCount.textContent = totalQty;

  if (bookingState.cartItems.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <div>Nothing added yet.<br>Browse the menu to get started.</div>
      </div>`;
    if (cartTotal) cartTotal.textContent = '$0.00';
    return;
  }

  cartList.innerHTML = bookingState.cartItems.map(item => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-qty">× ${item.qty}</div>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;">
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <button class="cart-remove" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
      </div>
    </div>
  `).join('');

  const total = bookingState.cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  if (cartTotal) cartTotal.textContent = '$' + total.toFixed(2);
}

function removeFromCart(id) {
  if (id.startsWith('w')) bookingState.wifiPlan = null;
  bookingState.cartItems = bookingState.cartItems.filter(i => i.id !== id);
  refreshServicesUI();
  updateCart();
}

function switchServicesTab(btn, panelId) {
  document.querySelectorAll('.services-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');

  // re-render the panel we just switched to so cart state is reflected
  if (panelId === 'meals-panel')  renderMenuSection('meals-panel',  MENU_DATA.meals);
  if (panelId === 'drinks-panel') renderMenuSection('drinks-panel', MENU_DATA.drinks);
  if (panelId === 'snacks-panel') renderMenuSection('snacks-panel', MENU_DATA.snacks);
  if (panelId === 'wifi-panel')   renderWifiSection();
}

function continueToPayment() {
  updatePaymentSummary();
  showPage(8);
}


/* ----------------------------------------------------------
   PAGE 8 — PAYMENT
   ---------------------------------------------------------- */
function updatePaymentSummary() {
  const f = selectedFlight || DEMO_FLIGHTS[0];
  const seatExtra  = bookingState.seatExtra || 0;
  const servicesTotal = bookingState.cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const subtotal   = f.price + seatExtra + servicesTotal;
  const taxes      = Math.round(subtotal * 0.115 * 100) / 100; // ~11.5% tax
  const total      = subtotal + taxes;

  const el = id => document.getElementById(id);

  if (el('pay-flight-line'))   el('pay-flight-line').textContent   = `${f.from} → ${f.to} · ${f.flightNum}`;
  if (el('pay-flight-price'))  el('pay-flight-price').textContent  = '$' + f.price.toFixed(2);
  if (el('pay-seat-line'))     el('pay-seat-line').textContent     = `Seat ${bookingState.seat || '—'} (${bookingState.seatType || 'Economy'})`;
  if (el('pay-seat-price'))    el('pay-seat-price').textContent    = seatExtra > 0 ? '+$' + seatExtra.toFixed(2) : 'Included';
  if (el('pay-services-price'))el('pay-services-price').textContent= servicesTotal > 0 ? '$' + servicesTotal.toFixed(2) : '—';
  if (el('pay-subtotal'))      el('pay-subtotal').textContent      = '$' + subtotal.toFixed(2);
  if (el('pay-taxes'))         el('pay-taxes').textContent         = '$' + taxes.toFixed(2);
  if (el('pay-total'))         el('pay-total').textContent         = '$' + total.toFixed(2);

  // also update the services line breakdown
  if (el('pay-services-detail')) {
    el('pay-services-detail').textContent = bookingState.cartItems.length > 0
      ? bookingState.cartItems.map(i => i.name).join(', ')
      : 'None selected';
  }

  bookingState.total = total;
}

// auto-format card number as groups of 4 (e.g. 4242 4242 4242 4242)
function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();

  // light visual for card type
  const brands = document.querySelectorAll('.card-brand-icon');
  brands.forEach(b => b.classList.remove('active'));
  if (val.startsWith('4')) {
    document.getElementById('brand-visa') && document.getElementById('brand-visa').classList.add('active');
  } else if (/^5[1-5]/.test(val)) {
    document.getElementById('brand-mc') && document.getElementById('brand-mc').classList.add('active');
  } else if (/^3[47]/.test(val)) {
    document.getElementById('brand-amex') && document.getElementById('brand-amex').classList.add('active');
  }
}

// auto-insert "/" in expiry field (e.g. 10/28)
function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2);
  input.value = val;
}

function submitPayment() {
  const name    = document.getElementById('card-name')?.value.trim();
  const number  = document.getElementById('card-number')?.value.replace(/\s/g, '');
  const expiry  = document.getElementById('card-expiry')?.value;
  const cvv     = document.getElementById('card-cvv')?.value;

  // basic validation
  if (!name || name.length < 2) {
    alert('Please enter the cardholder name as it appears on the card.');
    return;
  }
  if (number.length < 15) {
    alert('Please enter a valid card number.');
    return;
  }
  if (!expiry.includes('/') || expiry.length < 5) {
    alert('Please enter a valid expiry date (MM/YY).');
    return;
  }
  if (!cvv || cvv.length < 3) {
    alert('Please enter the CVV code on the back of your card.');
    return;
  }

  // simulate a payment spinner
  const btn = document.getElementById('pay-btn');
  btn.innerHTML = '⏳ Processing payment…';
  btn.disabled = true;

  setTimeout(() => {
    // update the confirmation page with the booking details
    finalizeConfirmation(name);
    showPage(3);
  }, 1500);
}

function finalizeConfirmation(cardholderName) {
  const f = selectedFlight || DEMO_FLIGHTS[0];
  const refNum = 'FDA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  // booking reference
  const refEl = document.getElementById('confirm-ref-num');
  if (refEl) refEl.textContent = refNum;

  // boarding pass fields
  const el = id => document.getElementById(id);
  if (el('bp-from'))      el('bp-from').textContent       = f.from;
  if (el('bp-to'))        el('bp-to').textContent         = f.to;
  if (el('bp-from-name')) el('bp-from-name').textContent  = f.fromCity;
  if (el('bp-to-name'))   el('bp-to-name').textContent    = f.toCity;
  if (el('bp-depart'))    el('bp-depart').textContent     = f.depart;
  if (el('bp-boarding'))  el('bp-boarding').textContent   = calcBoardingTime(f.depart);
  if (el('bp-flight'))    el('bp-flight').textContent     = f.flightNum;
  if (el('bp-duration'))  el('bp-duration').textContent   = f.duration;
  if (el('bp-seat-num'))  el('bp-seat-num').textContent   = bookingState.seat || '22A';
  if (el('bp-class'))     el('bp-class').textContent      = bookingState.seatType || pax.cls;
  if (el('bp-name'))      el('bp-name').textContent       = cardholderName.toUpperCase();
  if (el('bp-name-2'))    el('bp-name-2').textContent     = cardholderName.toUpperCase();

  // payment summary on the confirmation page
  if (el('confirm-total')) el('confirm-total').textContent = '$' + (bookingState.total || 0).toFixed(2);
  if (el('confirm-ref-detail')) el('confirm-ref-detail').textContent = refNum;
  if (el('confirm-ticket')) el('confirm-ticket').textContent = 'ET-FDA-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 90000 + 10000);
}

function calcBoardingTime(departTime) {
  // boarding opens 30 minutes before departure
  const [h, m] = departTime.replace(/[^\d:]/g, '').split(':').map(Number);
  const total  = h * 60 + m - 30;
  const bh = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const bm = ((total % 60) + 60) % 60;
  return `${String(bh).padStart(2,'0')}:${String(bm).padStart(2,'0')}`;
}


/* ----------------------------------------------------------
   PAGE 4 — MANAGE BOOKING
   ---------------------------------------------------------- */
const DEMO_BOOKINGS = [
  { ref: 'FDA-7X9K2P', email: 'john@email.com',  name: 'John Smith'    },
  { ref: 'FDA-4B2MNX', email: 'an@email.com',    name: 'An Nguyen'     },
  { ref: 'FDA-9QR1TP', email: 'emma@email.com',  name: 'Emma Johnson'  },
];

function findBooking() {
  const ref   = document.getElementById('mb-ref').value.trim().toUpperCase();
  const email = document.getElementById('mb-lastname').value.trim().toLowerCase();

  // hide any previous results first
  document.getElementById('mb-result').classList.remove('visible');
  document.getElementById('mb-not-found').classList.remove('visible');

  const refEl   = document.getElementById('mb-ref');
  const emailEl = document.getElementById('mb-lastname');
  const emailValid = email && email.includes('@');

  // highlight bad fields in red
  refEl.style.borderColor   = ref        ? '' : '#ef4444';
  emailEl.style.borderColor = emailValid ? '' : '#ef4444';
  if (!ref || !emailValid) return;

  refEl.style.borderColor = emailEl.style.borderColor = '';

  // show loading state on the button
  const btn = document.querySelector('.btn-find');
  btn.innerHTML = '⏳ Searching…';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> Find My Booking';
    btn.disabled = false;

    // check against demo data, fall back to matching any ref+valid-email
    const match = DEMO_BOOKINGS.find(b => b.ref === ref && b.email === email)
      || (ref.length >= 3 && emailValid ? { ref, name: email.split('@')[0] } : null);

    if (match) {
      document.getElementById('mb-display-ref').textContent  = match.ref;
      document.getElementById('mb-display-name').textContent = match.name;
      document.getElementById('mb-result').classList.add('visible');
      document.getElementById('mb-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      document.getElementById('mb-not-found').classList.add('visible');
      document.getElementById('mb-not-found').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 900);
}

function resetSearch() {
  document.getElementById('mb-ref').value = '';
  document.getElementById('mb-lastname').value = '';
  document.getElementById('mb-result').classList.remove('visible');
  document.getElementById('mb-not-found').classList.remove('visible');
  document.querySelector('.mb-lookup-card').scrollIntoView({ behavior: 'smooth' });
}


/* ----------------------------------------------------------
   INIT — runs once when the page is ready
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  refreshPax();
  buildSeatMap();
  renderServicesMenu();

  // enforce departure <= return date
  const dep = document.getElementById('departure-date');
  const ret = document.getElementById('return-date');
  if (dep && ret) {
    dep.addEventListener('change', function() {
      if (ret.value && ret.value < dep.value) ret.value = dep.value;
      ret.min = dep.value;
    });
  }

  // enter key on manage booking fields
  ['mb-ref', 'mb-lastname'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') findBooking(); });
  });
});
