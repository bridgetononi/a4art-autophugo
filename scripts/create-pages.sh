#/bin/sh
DATE=`date`
echo "Deployed:" $DATE > public/README.txt
cd sanity
./create-pages-md.js
