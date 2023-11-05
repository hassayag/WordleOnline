#!/bin/bash

# SSH into the EC2 instance and run the commands
ssh -i "ssh-key.pem" ec2-user@$WORDLE_API_EC2_URL<< EOF
    # Use pgrep to find the PIDs of the 'node' processes
    node_pids=(\$(pgrep node))

    # Check if there are 'node' processes running
    if [ \${#node_pids[@]} -eq 0 ]; then
        echo "No 'node' processes are running."
        exit 1
    fi

    # Use sudo tail to follow the standard output of each 'node' process
    for pid in "\${node_pids[@]}"; do
        sudo tail -f "/proc/\$pid/fd/1"
    done
EOF
