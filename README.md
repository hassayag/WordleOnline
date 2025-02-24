# Wordle Online
An online multiplayer Wordle-based game that supports real-time competetive play for up to 5 players

## Client
### Setup
In `wordle-ui` folder:
1. `nvm use`
2. `npm i`
3. `npm start`

## Server
### Setup
In `wordle-api` folder:
1. `nvm use`
2. `npm i`
3. `npm start`

## Database
### Setting up Local DB

`sudo apt install postgresql postgresql-contrib`
`sudo systemctl start postgresql.service`
`sudo -u postgres psql`
`createdb wordle-online`

### Access DB

`sudo -u postgres psql wordle-online`
