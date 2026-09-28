/*
  Aktualności prawa podatkowego i kadrowego.
  Aby dodać wpis, dopisz obiekt na POCZĄTKU tablicy (najnowsze u góry).
  Pola: date (RRRR-MM-DD), category (jedna z NEWS_CATEGORIES), title, summary,
        points (lista szczegółów), source (podstawa prawna), link (adres źródła, opcjonalnie).
*/
window.NEWS_CATEGORIES = {
  vat: "VAT i KSeF",
  cit: "CIT i grupy",
  kadry: "Kadry i płace",
  sprawozdawczosc: "Sprawozdawczość"
};

window.NEWS = [
  {
    date: "2026-06-30",
    category: "cit",
    title: "Globalny podatek minimalny: termin pierwszej informacji GloBE",
    summary: "Grupy z przychodami od 750 mln euro składają pierwszą informację o opodatkowaniu wyrównawczym (GIR) za 2024 rok.",
    points: [
      "Ustawa o opodatkowaniu wyrównawczym obowiązuje od 1 stycznia 2025 r.",
      "Dotyczy grup międzynarodowych i krajowych z przychodem skonsolidowanym co najmniej 750 mln euro w dwóch z czterech poprzednich lat.",
      "Dla roku obrotowego zakończonego 31 grudnia 2024 r. termin złożenia GIR minął 30 czerwca 2026 r.; w kolejnych latach obowiązuje 15 miesięcy od końca roku."
    ],
    source: "Ustawa z 6 listopada 2024 r. o opodatkowaniu wyrównawczym jednostek składowych grup międzynarodowych i krajowych", link: "https://www.ey.com/pl_pl/insights/tax/podatek-wyrownawczy-w-pytaniach-i-odpowiedziach"
  },
  {
    date: "2026-05-01",
    category: "kadry",
    title: "Nowe zasady liczenia stażu pracy u pracodawców prywatnych",
    summary: "Do stażu pracy wlicza się m.in. okresy prowadzenia działalności gospodarczej i wykonywania umów zlecenia.",
    points: [
      "Zmiana wpływa na wymiar urlopu, dodatki stażowe i nagrody jubileuszowe.",
      "Do stażu wlicza się okresy, za które opłacano składki ZUS; pracownik ma 24 miesiące na dostarczenie dokumentów.",
      "W sektorze publicznym zasady obowiązują od 1 stycznia 2026 r."
    ],
    source: "Nowelizacja Kodeksu pracy w zakresie stażu pracy (sektor prywatny od 1 maja 2026 r.)", link: "https://gdansk.pip.gov.pl/aktualnosci/od-1-maja-2026-r-staz-trzeba-przeliczyc-takze-w-firmach-prywatnych"
  },
  {
    date: "2026-04-01",
    category: "vat",
    title: "KSeF obowiązkowy dla pozostałych podatników VAT",
    summary: "Od 1 kwietnia 2026 r. faktury ustrukturyzowane w KSeF wystawiają wszyscy podatnicy, poza najmniejszymi.",
    points: [
      "Największe firmy (sprzedaż powyżej 200 mln zł w 2024 r.) wystawiają e-faktury od 1 lutego 2026 r.",
      "Od 1 lutego 2026 r. wszyscy podatnicy odbierają faktury przez KSeF.",
      "Podatnicy z miesięczną sprzedażą fakturową do 10 000 zł mają czas do końca 2026 r.",
      "Od 1 stycznia 2027 r. KSeF obejmuje także najmniejsze firmy, a za brak e-faktury grożą kary do 100% kwoty VAT."
    ],
    source: "Ustawa o VAT, przepisy o Krajowym Systemie e-Faktur", link: "https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/podstawy-prawne-oraz-kluczowe-terminy/"
  },
  {
    date: "2026-01-01",
    category: "sprawozdawczosc",
    title: "JPK_CIT: kolejna grupa podatników prowadzi księgi w formie elektronicznej",
    summary: "Obowiązek przesyłania ksiąg rachunkowych w strukturze JPK obejmuje od 2026 r. pozostałych podatników CIT składających JPK_VAT.",
    points: [
      "Od 2025 r. obowiązek dotyczy największych podatników (przychody powyżej 50 mln euro).",
      "Księgi przesyła się razem z zestawieniem mapującym, po zakończeniu roku podatkowego.",
      "Pierwsze pliki za 2026 r. składa się do 31 marca 2027 r., razem z CIT-8.",
      "Podatnicy rozliczający VAT kwartalnie i pozostali podatnicy CIT dołączą od 2027 r."
    ],
    source: "Ustawa o CIT, struktury JPK_KR_PD i JPK_ST_KR", link: "https://www.gofin.pl/podatki/podatek-dochodowy/39276/od-1-stycznia-2026-r-obowiazek-przeslania-plikow-jpk-pd-nie-bedzie-dotyczyl-podatnikow-rozliczajacych-vat-kwartalnie"
  },
  {
    date: "2026-01-01",
    category: "kadry",
    title: "Płaca minimalna w 2026 roku: 4806 zł brutto",
    summary: "Minimalne wynagrodzenie wynosi 4806 zł brutto, a minimalna stawka godzinowa 31,40 zł.",
    points: [
      "Wzrost wpływa na wynagrodzenie za przestój, dodatek za pracę w nocy i limity potrąceń.",
      "Warto sprawdzić umowy zlecenia i siatki płac w całej grupie."
    ],
    source: "Rozporządzenie Rady Ministrów z 11 września 2025 r. (Dz.U. 2025 poz. 1242)", link: "https://dziennikustaw.gov.pl/D2025000124201.pdf"
  },
  {
    date: "2025-12-24",
    category: "kadry",
    title: "Jawność wynagrodzeń w rekrutacji",
    summary: "Pracodawca informuje kandydatów o wynagrodzeniu lub jego widełkach i nie pyta o zarobki w poprzedniej pracy.",
    points: [
      "Informację przekazuje się w ogłoszeniu albo przed rozmową kwalifikacyjną.",
      "Ogłoszenia i nazwy stanowisk muszą być neutralne płciowo.",
      "To pierwszy etap wdrożenia unijnej dyrektywy o przejrzystości wynagrodzeń."
    ],
    source: "Ustawa z 4 czerwca 2025 r. o zmianie Kodeksu pracy", link: "https://bialystok.pip.gov.pl/aktualnosci/jawnosc-wynagrodzen-i-rownosc-szans-nowe-obowiazki-pracodawcow-na-przelomie-roku-2025-2026"
  }
];
