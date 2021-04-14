
# chmod +x cmd¥ menu.command
export  script_file_path="$0"
export  parent_path="${script_file_path%/*}"
cd  "${parent_path}"
export code="${HOME}/Downloads/Visual Studio Code.app/Contents/MacOS/Electron" 

echo  ""
echo  "1. open_VisualStudioCode"
echo  "2. setup"
echo  "9. clean"
read -p "number>"  key

if [ "${key}" == "1" ]; then
    if [ ! -e "node_modules" ]; then

        npm run setup
    fi
    "${code}"  "."
elif [ "${key}" == "2" ]; then
    npm run setup
    "${code}"  "."
elif [ "${key}" == "9" ]; then

    npm run clean
else
    echo  "Unknown command error."
fi
echo  ""
