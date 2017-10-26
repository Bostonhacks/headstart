#!/bin/bash

# run this script on YOUR OWN computer

# set the BOSTONHACKS_IP bash variable here
source setIP.sh

# runs mongoexport on the production server
ssh root@${BOSTONHACKS_IP} "mongoexport --db headstart --collection formations --type=csv --fields=userId,questionId,question,subQuestion,responseId,response --out teamFormation.csv"

# copies over the csv to your computer
scp -r root@${BOSTONHACKS_IP}:~/teamFormation.csv .

