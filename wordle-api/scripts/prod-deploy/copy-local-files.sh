scp -i "./ssh-key.pem" ../../.env.production ec2-user@$WORDLE_API_EC2_URL:~/WordleOnline/wordle-api/.env
scp -i "./ssh-key.pem" ../../local/ssl/key.pem ec2-user@$WORDLE_API_EC2_URL:~/WordleOnline/wordle-api/local/ssl/key.pem
scp -i "./ssh-key.pem" ../../local/ssl/csr.pem ec2-user@$WORDLE_API_EC2_URL:~/WordleOnline/wordle-api/local/ssl/csr.pem
scp -i "./ssh-key.pem" ../../local/ssl/cert.pem ec2-user@$WORDLE_API_EC2_URL:~/WordleOnline/wordle-api/local/ssl/cert.pem