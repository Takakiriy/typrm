function  main_func() {
    #// "application", "test" or "debug"
    target_from="application"
    target_to="test"
    if [ "$1" != ""  -o  "$2" != "" ]; then
        if [ "$1" == ""  -o  "$2" == "" ]; then
            echo "ERROR"; exit 2
        fi
        target_from="$1"
        target_to="$2"
    fi

    file_path="service_S.yaml"
    change_service_A_setting_func  ${file_path} ${target_from} ${target_to} 4
    change_service_B_setting_func  ${file_path} ${target_from} ${target_to} 5

    file_path="service_T.yaml"
    change_service_A_setting_func  ${file_path} ${target_from} ${target_to} 14
}

function  change_service_A_setting_func() {
    local  file_path="$1"
    local  target_from="$2"
    local  target_to="$3"
    local  line_num="$4"

    local  service="service_A"
    setting=(
        "application" "server"
        "test"        "local docker"
        "debug"       "local docker"
    )
    local  setting_from="$(_get setting "${target_from}" )"
    local  setting_to="$(_get setting "${target_to}" )"
    local  from_to="from \"${target_from}/${setting_from}\" to \"${target_to}/${setting_to}\""

    if [ "${setting_from}" == "server"  -a  "${setting_to}" == "local docker" ]; then
        echo "${file_path}/${service}:$((${line_num} + 0)): Change ${from_to}"

        #// _c="$(sed "$((${line_num} + 0)) s/aa/AA/g" "${file_path}" )";  echo "$_c" > "${file_path}";  unset _c

    elif [ "${setting_from}" == "local docker"  -a  "${setting_to}" == "server" ]; then
        echo "${file_path}/${service}:$((${line_num} + 0)): Change ${from_to}"

        #// _c="$(sed "$((${line_num} + 0)) s/AA/aa/g" "${file_path}" )";  echo "$_c" > "${file_path}";  unset _c

    elif [ "${setting_from}" == ""  -o  "${setting_to}" == "" ]; then
        echo "${file_path}/${service}: Error (${from_to})"; exit 2
    else
        echo "${file_path}/${service}: No change (${from_to})"
    fi
}

function  change_service_B_setting_func() {
    local  file_path="$1"
    local  target_from="$2"
    local  target_to="$3"
    local  line_num="$4"

    local  service="service_B"
    setting=(
        "application" "server"
        "test"        "server"
        "debug"       "local docker"
    )
    local  setting_from="$(_get setting "${target_from}" )"
    local  setting_to="$(_get setting "${target_to}" )"
    local  from_to="from \"${target_from}/${setting_from}\" to \"${target_to}/${setting_to}\""

    if [ "${setting_from}" == "server"  -a  "${setting_to}" == "local docker" ]; then
        echo ${file_path}/${service}:${line_num}: Change ${from_to}
    elif [ "${setting_from}" == "local docker"  -a  "${setting_to}" == "server" ]; then
        echo ${file_path}/${service}:${line_num}: Change ${from_to}
    elif [ "${setting_from}" == ""  -o  "${setting_to}" == "" ]; then
        echo "${file_path}/${service}: Error (${from_to})"; exit 2
    else
        echo ${file_path}/${service}: No change "(${from_to})"
    fi
}

#// _get
#// Example:
#//    object=(key_A "1" key_B "x")
#//    echo "$(_get "${object[@]}" key_B )"
function  _get() {
    local  object_name="${1}"
    local  key="$2"
    local  operation=""

    operation="_get_sub \"\${${object_name}[@]}\" \"${key}\""
    eval "${operation}"
}

function  _get_sub() {
    local  object_entries=("${@}")
    local  key_index=$(( ${#object_entries[@]} - 1 ))
    local  key="${object_entries[${key_index}]}"
    local  value=""

    for (( i = 0; i < "${key_index}"; i += 2 ));do
        if [ "${object_entries[${i}]}" == "${key}" ]; then
            value="${object_entries[${i}+1]}"
        fi
    done

    echo "${value}"
}

#// _set
#// Example:
#//    object=(key_A "1" key_B "x")
#//    eval "$(_set object key_B "y" )"
function  _set() {
    local  object_name="${1}"
    local  key="$2"
    local  value="$3"
    local  operation=""

    operation="_set_sub \"\${${object_name}[@]}\" \"${object_name}\" \"${key}\" \"${value}\""
    eval "${operation}"
}

function  _set_sub() {
    local  object_entries=("${@}")
    local  count=${#object_entries[@]}
    local  object_name_index=$(( ${count} - 3 ))
    local  key_index=$(( ${count} - 2 ))
    local  value_index=$(( ${count} - 1 ))
    local  object_name="${object_entries[${object_name_index}]}"
    local  key="${object_entries[${key_index}]}"
    local  value="${object_entries[${value_index}]}"
    local  command=""

    for (( i = 0; i < "${key_index}"; i += 2 ));do
        if [ "${object_entries[${i}]}" == "${key}" ]; then

            command="${object_name}[$(( ${i} + 1 ))]=\"${value}\""
        fi
    done
    if [ "${command}" == "" ]; then
        local  new_key_index=$(( ${count} - 3 ))
        local  new_value_index=$(( ${count} - 2 ))

        command="${object_name}[${new_key_index}]=\"${key}\"; ${object_name}[${new_value_index}]=\"${value}\""
    fi

    echo "${command}"
}

function  test_of_get_set_func() {
    object=(key_A "1" key_B "x")
    echo "$(_get object key_A )"
    echo "$(_get object key_B )"
    eval "$(_set object key_A "2" )"
    eval "$(_set object key_B "y" )"
    eval "$(_set object key_C "z  z" )"
    echo "$(_get object key_A )"
    echo "$(_get object key_B )"
    echo "$(_get object key_C )"
}

test_of_get_set_func

main_func  "$@"
