#!/bin/bash

# run this script on YOUR OWN computer

# runs mongoexport on the production server
ssh root@159.203.171.222 "mongoexport --db headstart --collection formations --type=csv --fields=userId,questionId,question,subQuestion,responseId,response --out teamFormation.csv"

# copies over the csv to your computer
scp -r root@159.203.171.222:~/teamFormation.csv .

