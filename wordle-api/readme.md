# Setting up Local DB
`sudo apt install postgresql postgresql-contrib`
`sudo systemctl start postgresql.service`
`sudo -u postgres psql`
`createdb wordle-online`

## Access DB 
`sudo -u postgres psql wordle-online`