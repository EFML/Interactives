echo "Generating css files from scss files"
sass --style --sourcemap=none --update --force scss/:css/
echo "Done"