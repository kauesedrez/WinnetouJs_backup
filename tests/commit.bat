echo off
cls
echo "Commit automatico com controle de versao"
echo.
set /p cod="Entre com o codigo da versao: "
set /p com="Entre com os comentarios da versao: "
echo "%cod%-%com%"
del version.json
echo {"version":"%cod%"} >> version.json

git add .
git commit -m "%cod%-%com%"
git push

echo.
echo "version.json gravado com sucesso."
echo "commit e push realizados com sucesso."
echo "Production Version: %cod%"