# Slym
A website for studying using games <br>
Built as a APCS project

## Main Features
- Fully functioning account system.
- Study set creation, importation, and searching of all made sets.
- Sets feature 4 study modes that can be temporarily disabled by the server (without having to restart it!).
- Each study set has a sepearate leaderboard for each study mode (Except the learn one, because that's self practice).

### Some cool things
- Scores can be faked pretty easily, but there is a server side check to see whether or not the score is actually possible or not. If the score is not, the user is flagged as a cheater and marked so on leaderbaords. Fairly easy to see cheaters because they are bright red. Cheaters lose no functionality in studying and is not set based, so cheater in one is a cheater in all! This can also be disabled.
- The importing feature is literally just one button. It automatically detects seperators and imports it for you. This was because i didn't want to add in extra buttons.
- Did you know that the only pages not designed by @Gabibag are /home and /search /astronomerrush, instead made by @willyhyperion. This is why they look terrible.

## Hosting
If you want to use this, you can run it locally using nodejs

clone the repo into any folder and cd into it
```bash
git clone https://github.com/Gabibag/Sylm
cd Sylm
```
Install the dependcies
```bash
npm i
```
Setupt the database
```bash
node initDB.js
```
You should see `database ready` in the console
Now, you can run it with
```bash
node server.js
```
The site will be available at `localhost:8000` in your browser
