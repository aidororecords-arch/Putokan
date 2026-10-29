BOMBER TANKS — SOCKET.IO MULTIPLAYER STARTER
=============================================

FILES
-----
index.html   Game page, including the Socket.IO client and remote-player rendering.
server.js    Node.js + Express + Socket.IO server.
package.json Dependencies and Render start command.
README.txt   This guide.

IMPORTANT
---------
GitHub Pages is static hosting and cannot run server.js. Put these files in a
GitHub repository, then connect that repository to Render as a Web Service.
Render will run the Node server and serve the HTML page from the same URL.

DEPLOY TO GITHUB + RENDER
-------------------------
1. Create a GitHub repository, for example: bomber-tanks-multiplayer.
2. Upload index.html, server.js, package.json, and README.txt to the ROOT
   of the repository (not inside another folder).
3. In Render, choose New + -> Web Service and connect the repository.
4. Use these settings:
      Runtime:   Node
      Build:     npm install
      Start:     npm start
5. Deploy and wait until Render reports the service is live.
6. Open the HTTPS URL Render gives you, for example:
      https://your-service-name.onrender.com
   Do not open the raw GitHub HTML URL or a local file:// URL for multiplayer.
7. Test with two different browsers/devices using the same Render URL. Log in
   and start a game on both. Other connected tanks should appear and move.

LOCAL TEST (OPTIONAL)
---------------------
Install Node.js 18 or newer on a computer, open a terminal in this folder, then:
    npm install
    npm start
Open http://localhost:3000

WHAT THIS VERSION SYNCS
-----------------------
- Connected players' positions, direction, display name, tank selection and
  life count are broadcast live through Socket.IO.
- Disconnected players are removed from the live player list.
- The existing local game logic, map, obstacles, bots, minimap, and UI remain
  in index.html.

CURRENT LIMITATIONS / SECURITY
------------------------------
This is a multiplayer connection starter, not a fully authoritative online
game server. Movement is client-reported. Bombs, hits, bot AI, map state,
account registration/login, balances, and purchases are still handled by the
existing browser-side code/localStorage and are NOT shared or securely saved
across devices. The default admin account in the HTML is not secure for a
public deployment. Do not use real money or valuable assets with this build.
A full synchronized multiplayer game needs server-authoritative combat/map
logic and a database-backed authentication and game-data layer.

TROUBLESHOOTING
---------------
- If the page loads but players do not appear, make sure you are using the
  Render HTTPS URL, not GitHub Pages.
- Check Render -> Logs for npm install or startup errors.
- Open /health on your Render URL to check whether the server responds.
- Both players must click Play and enter the game to join multiplayer.
