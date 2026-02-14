# Specyfikacja Projektu: Walentynkowy Escape Room

## Cel
Stworzenie prostej, responsywnej aplikacji webowej (Single Page Application) typu "Escape Room" na Walentynki. Użytkownik przechodzi przez serię zagadek. Poprawna odpowiedź odblokowuje kolejny etap. Użytkownik będzie miał kod QR, który przekeiruje go na te stronę.

## Technologia
- HTML5 (semantyczny)
- CSS3 (nowoczesny, Flexbox/Grid, responsywny - mobile first)
- Vanilla JavaScript (brak frameworków)

## Design (UI/UX)
- Klimat: Romantyczny, tajemniczy, ale czytelny.
- Kolorystyka: Ciemne tło (#1a1a1a), akcenty czerwieni/różu (#e91e63), biały tekst.
- Animacje: Płynne przejścia (fade-in/fade-out) między etapami.
- Elementy: Na środku kontener z zagadką, polem tekstowym i przyciskiem "Sprawdź".

## Logika Aplikacji (JavaScript)
1. Aplikacja posiada listę etapów (Stages).
2. Tylko jeden etap jest widoczny naraz.
3. Wyświetalmy tylko numer etapu bez nazwy, możemy dodać jedynie ikonę. Sama nazwa etapu zbyt dużo podpowiada, tak samo jak pytania, które zadajemy. Gdzie to możliwe zostawmy bez pytań, niech to wymaga trochę więcej myślenia.
4. Funkcja `checkAnswer` normalizuje wprowadzony tekst (zamienia na małe litery, usuwa polskie znaki diakrytyczne np. ą->a, usuwa spacje), aby odpowiedzi były łatwiejsze do trafienia.
5. Błędna odpowiedź: animacja trzęsienia (shake effect) i komunikat błędu.
6. Poprawna odpowiedź: ukrycie obecnego etapu, pokazanie następnego z animacją.

## Lista Zagadek (Etapy)

### Etap 1: Sudoku
- Treść: Generate an HTML table representing a 9x9 Sudoku grid based on the data provided in the chat. Make cells [0,0], [2,8], [4,4], [8,2] empty inputs
- 
- Poprawna odpowiedź: "5297" (to jest placeholder, muszę móc go łatwo zmienić w kodzie).

### Etap 2: Kolor
- Treść: Wyświetl napis RGB(255, 192, 203).
- Poprawna odpowiedź: "różowy" lub "rozowy" lub "pink".

### Etap 3
- Treść: Wyświetl ikone panny młodej i zabawy, może konfetti, mogą byc emojii
- Poprawna odpowiedź: "wesele".

### Etap 4: Panda / Mariusz
- Treść: Wyświetl zdjęcie pandy jedzącej bambus ('panda.jpg'). 
- Poprawna odpowiedź: "panda" lub "Mariusz".

### Etap 5: Coca Cola
- Treść: Zagadka tekstowa: "Czarna jak noc, słodka jak grzech, a Mikołaj bez tego nie istnieje".
- Poprawna odpowiedź: "cola" lub "cocacola".


### Etap 6: Znaki Zodiaku
- Treść: Wyświetl na czarnym tle same układy gwiazd (białe kropki połączone liniami). Pytanie: "Deneb Algedi patrzy na Acubens."
- Logika: 19.01 to Koziorożec, 20.07 to Rak.
- Poprawna odpowiedź (musi zaliczać różne formy): "koziorożecirak", "koziorożec,rak", "koziorozecirak".

### Etap 7: Podróż (Gdańsk)
- Treść: Zdjęcie Fontanny Neptuna ('gdansk.jpg').
- Poprawna odpowiedź: "gdansk".

### Etap 8: Podróż (Włochy)
- Treść: Zdjęcie makaronu lub Pizzy ('wlochy.jpg'). 
- Poprawna odpowiedź: "wlochy" lub "italia".

### Etap 9: Kółko i Krzyżyk
Zróbmy tak, że to samo wygranie gry jest kluczem do kolejnego etapu.

Jak to zrealizować: Na ekranie pojawia się plansza 3x3. Ona gra krzyżykami (X), a prosty skrypt JS gra kółkami (O).

Logika w JS: Kiedy ułoży trzy krzyżyki w rzędzie, zamiast zwykłego "Wygrałeś!", funkcja automatycznie ukrywa ten etap i przenosi ją do Etapu 10.

Prompt dla Copilota: "Create a simple Tic-Tac-Toe game in a 3x3 grid for #stage-9. The user plays as 'X' and the computer plays as 'O' randomly. If the user wins, wait 1 second and then call checkAnswer or manually transition to #stage-10."

### Etap 10: Koncerty Taco i Podsiadło
Pomysł na zagadkę: Wyświetl na stronie dwa zdjęcia lub dwie ikony (np. Taco = 🌮, Dawid Podsiadło = 👨🏻 – wąsy). Hasło: warszawa (lub narodowy). Zostaw same ikony, bez podawania Taco i Dawid Podsiadło

### Etap 11: Zgadywanka (Liczba 11)
To bardzo fajny mechanizm, który ożywi stronę (tzw. gra w wyżej/niżej).

Mechanika: Wyświetlasz pole na wpisanie liczby z komunikatem: "Myślę o pewnej liczbie od 1 do 20. Zgadnij ją!".

Logika w JS: Jeśli wpisze np. 15, pod polem pojawia się czerwony napis "Mniej!". Jeśli 5, pojawia się "Więcej!". Jeśli wpisze 11 – przechodzi do finału.

Prompt dla Copilota: "In #stage-11, add an input field for numbers. Write logic that checks the input against the secret number 11. If the input is higher, show a message 'Mniej!'. If lower, show 'Więcej!'. If it is 11, transition to #stage-final."

### ### Finał: Zakodowana Wiadomość
- Treść: Wyświetl wielki napis: "GRATULACJE! OTO TWOJE HASŁO KOŃCOWE:".
- Wiadomość: Wyświetl zaszyfrowany tekst: "vznslx nts mfmfwvl".
- Mechanika: Dodaj pod spodem prosty suwak (input type="range") lub przycisk "Odszyfruj".
- Działanie: Przesunięcie suwaka lub kliknięcie zmienia litery (Szyfr Cezara +11), aż tekst zmieni się w "Kocham Cię Bubulka". Po właściwy przesunięciu suwaka, wyświetl coś związanego z Cezarem, a następnie poproś o wpisanie hasła jakim jest : "Kocham Cię Bubulka". Z suwaka będzi emogła wyciągnąc zasadę +11, z podpowiedzi Cezara i dalej musi kombinować.
- Efekt końcowy: Po odszyfrowaniu uruchom animację konfetti i pogrub na całą stronę hasło końcowe
- 
## Struktura plików
- index.html
- style.css
- script.js
- folder /img/ (z placeholderami)