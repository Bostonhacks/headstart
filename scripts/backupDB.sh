#!/bin/bash

# run this script on YOUR OWN computer

# runs mongodump on the production server
ssh root@159.203.171.222 "mongodump"

# copies over the database export to your computer
scp -r root@159.203.171.222:~/dump .

