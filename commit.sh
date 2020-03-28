clear
echo "Commit automatico com controle de versao"
echo "Entre com o codigo da versao: "
read cod
echo "Entre com o nome da versao: "
read com
echo "$cod-$com"
rm version.json
echo {\"version\":\"$cod\"} >> version.json

git add .
git commit -m "$cod - $com"
git push


echo "version.json gravado com sucesso."
echo "commit e push realizados com sucesso."
echo "Production Version: $cod"