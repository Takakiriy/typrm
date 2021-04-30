
# chmod +x typrm.command
export  script_file_path="$0"
export  parent_path="${script_file_path%/*}"

export  NODE_PATH=/usr/local/lib/node_modules

node  ${parent_path}/../build/typrm.js
