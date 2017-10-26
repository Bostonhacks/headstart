#!/bin/bash

# run this script on YOUR OWN computer

# set the BOSTONHACKS_IP bash variable in this script
source setIP.sh

# runs mongodump on the production server
ssh root@${BOSTONHACKS_IP} "mongodump"

# copies over the database export to your computer
scp -r root@${BOSTONHACKS_IP}:~/dump .

