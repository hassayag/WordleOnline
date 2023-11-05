ssh -i "ssh-key.pem" ec2-user@$WORDLE_API_EC2_URL << EOF
    sudo yum install
    curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash   
    nvm install 20
    sudo setcap 'cap_net_bind_service=+ep' `which node`
    sudo yum install git
    git clone https://github.com/hassayag/WordleOnline.git
EOF
