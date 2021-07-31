#! /bin/sh
sed -i 's/\w*.process.env./process.env./g' node_modules/openpgp/dist/*.js node_modules/openpgp/dist/*.mjs node_modules/openpgp/dist/lightweight/*.mjs
