# MulImp Frontend
A React + TS frontend for a multiplayer social deduction gaem where players answer prompts,
discuss, and vote to identify the imposter.

## Tech Stack
This webpage was created using React + TypeScript and deployed to GitHub pages.

It uses Axios for requests and Motion as a helper for UI development.

## How it Works
The frontend communicates with the Azure deployed backend through REST API calls. The backend is the source of truth and frontend polls the backend every second to keep the UI updated.

## Running Locally
First, clone the repo locally
```terminal
git clone https://github.com/mattthewja/MulImp-frontend.git
```
Then, install dependencies
```terminal
npm install
```
Then, start the dev frontend 
```terminal
npm run dev
```
or build for production
```terminal
npm run build
```
then
```terminal
npm run deploy
```
Note: you will need a github repo set up so your gh-pages deployment works correctly.

Do note that the deployed backend will not listen to requests from the dev server, you
must start your own backend and allow your frontend to contact your backend server.

Please see backend <a href="https://github.com/mattthewja/MulImp-backend">here</a>. for 
how to locally run the backend server.

After you get the backend running, you must change two URLs. In '/src/api/gameApi.ts' and
'/src/api/lobbyApi.ts', you must change:
```typescript
const api = axios.create({
    baseURL: "https://mulimp-e8c6exakdgfza3dm.centralus-01.azurewebsites.net",
});
```
To
```typescript
const api = axios.create({
    baseURL: "http://localhost:8080",
});
```