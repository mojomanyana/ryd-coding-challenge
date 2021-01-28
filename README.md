# ryd-coding-challenge

Short description how to setup this coding challenge.

## Setup local development

- Clone this repo
- Setup node on your local env to use node v14
- Install all npm dependecies using using `npm i`

### Build and run locally

- Do `Setup local development` first
- Build the project from root dir by calling `npm run build`
- Run the app by calling `npm start`
- You can also run it for development by calling `npm run dev` (development mode that can be use to watch for changes and reload server automatically)
- Once code is up and running You can verify that healt-check is returning 200 status code with body `{ status: 'OK' }` on the follwing URL: `http://localhost:7080/health-check/readiness`

### Testing
- Do `Setup local development` first
- Run test and coverage tool by calling `npm run test`