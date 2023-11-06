ssh -i "ssh-key.pem" ec2-user@$WORDLE_API_EC2_URL << EOF
    cd WordleOnline/wordle-api
    sudo pkill -f node
    git checkout master
    git pull
    npm ci
    npm run build
    nohup npm run start.prod > app.log 2>&1 &
    disown
EOF
