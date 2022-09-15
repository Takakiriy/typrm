#!/bin/bash

function  Main() {
    local  configuration_from="debug"
    local  configuration_to="application"
        #// [ "application", "test", "debug" ]

    ChangeTheConfiguration  "${configuration_from}"  "${configuration_to}"
    echo  ""
    echo  "ErrorCount: ${ErrorCount}"
}

#// ChangeTheConfiguration
#// Parameters:
#//     $1, $2: [ "application", "test", "debug" ]
function  ChangeTheConfiguration() {
    local  configuration_from="$1"
    local  configuration_to="$2"

    echo  "Change the configuration from \"${configuration_from}\" to \"${configuration_to}\""

    local  service_S_file_path="./service_S.yaml"
    ServiceA_EditSettingsInAFile  "${service_S_file_path}"  3  "${configuration_from}" "${configuration_to}"

    local  service_T_file_path="./service_T.yaml"
    ServiceA_EditSettingsInAFile  "${service_T_file_path}"  3  "${configuration_from}" "${configuration_to}"
    ServiceB_EditSettingsInAFile  "${service_T_file_path}"  5  "${configuration_from}" "${configuration_to}"
    RegExpB_EditSettingsInAFile   "${service_T_file_path}" 10  "${configuration_from}" "${configuration_to}"
    ServiceC_EditSettingsInAFile  "${service_T_file_path}" 15  "${configuration_from}" "${configuration_to}"

    local  service_U_file_path="./service_U.yaml"
    ServiceC_EditSettingsInAFile  "${service_U_file_path}"  2  "${configuration_from}" "${configuration_to}"
}

function  ServiceA_EditSettingsInAFile() {
    local  file_path="$1"
    local  line_num="$2"
    local  configuration_from="$3"
    local  configuration_to="$4"

    local  service="ServiceA"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "application" "server"
        "test"        "local docker"
        "debug"       "local docker"
    )
    local  setting_from="$(_Get setting "${configuration_from}" )"
    local  setting_to="$(_Get setting "${configuration_to}" )"

    if [ "${setting_to}" == "local docker" ]; then
        SetSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "property:"  "AA"

    elif [ "${setting_to}" == "server" ]; then
        SetSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "property:"  "aa"
    else
        EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
    fi
}

function  ServiceB_EditSettingsInAFile() {
    local  file_path="$1"
    local  line_num="$2"
    local  configuration_from="$3"
    local  configuration_to="$4"

    local  service="ServiceB"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "application" "server"
        "test"        "server"
        "debug"       "local docker"
    )
    local  setting_from="$(_Get setting "${configuration_from}" )"
    local  setting_to="$(_Get setting "${configuration_to}" )"
    local  from_to="from \"${configuration_from}/${setting_from}\" to \"${configuration_to}/${setting_to}\""

    if [ "${setting_to}" == "local docker" ]; then
        SetSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyX:"  "XB"
        SetSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyY: "  "YB"
        SetSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "withSlash:"  "A/B.log"
        if [ "${setting_from}" == "server" ]; then
            SetSetting  "${file_path}"  "$((${line_num} + 3))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
                'withEscape:'  'A\nB'
        else
            EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
        fi

    elif [ "${setting_to}" == "server" ]; then
        SetSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyX:"  "xb"
        SetSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyY: "  "yb"
        SetSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "withSlash:"  "a/b.log"
        if [ "${setting_from}" == "local docker" ]; then
            SetSetting  "${file_path}"  "$((${line_num} + 3))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
                'withEscape:'  'a\nb'
        else
            EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
        fi
    else
        EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
    fi
}

function  RegExpB_EditSettingsInAFile() {
    local  file_path="$1"
    local  line_num="$2"
    local  configuration_from="$3"
    local  configuration_to="$4"

    local  service="ServiceB"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "application" "server"
        "test"        "server"
        "debug"       "local docker"
    )
    local  setting_from="$(_Get setting "${configuration_from}" )"
    local  setting_to="$(_Get setting "${configuration_to}" )"
    local  from_to="from \"${configuration_from}/${setting_from}\" to \"${configuration_to}/${setting_to}\""

    if [ "${setting_to}" == "local docker" ]; then
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyX: .*"  "propertyX: XB"
        EditSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyY: .*"  "propertyY: YB"
        EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "withSlash: .*"  "withSlash: A\\/B\\.log"
        if [ "${setting_from}" == "server" ]; then
            EditSetting  "${file_path}"  "$((${line_num} + 3))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
                'withEscape: a\\nb'  'withEscape: A\\nB'
        else
            EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
        fi

    elif [ "${setting_to}" == "server" ]; then
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyX: .*"  "propertyX: xb"
        EditSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyY: .*"  "propertyY: yb"
        EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "withSlash: .*"  "withSlash: a\\/b\\.log"
        if [ "${setting_from}" == "local docker" ]; then
            EditSetting  "${file_path}"  "$((${line_num} + 3))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
                'withEscape: A\\nB'  'withEscape: a\\nb'
        else
            EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
        fi
    else
        EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
    fi
}

function  ServiceC_EditSettingsInAFile() {
    local  file_path="$1"
    local  line_num="$2"
    local  configuration_from="$3"
    local  configuration_to="$4"

    local  service="ServiceC"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "application" "server"
        "test"        "server"
        "debug"       "local docker"
    )
    local  setting_from="$(_Get setting "${configuration_from}" )"
    local  setting_to="$(_Get setting "${configuration_to}" )"
    local  from_to="from \"${configuration_from}/${setting_from}\" to \"${configuration_to}/${setting_to}\""

    if [ "${setting_to}" == "local docker" ]; then
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyC1: .*"  "propertyC1: C"
        EditSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\(propertyC2\|renamed\): .*"  "\1: CC"
        if [[ "${file_path}" == *"service_U"* ]]; then
            EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
                "Extra: .*"  "Extra: CCC"
        fi

    elif [ "${setting_to}" == "server" ]; then
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "propertyC1: .*"  "propertyC1: c"
        EditSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\(propertyC2\|renamed\): .*"  "\1: cc"
        if [[ "${file_path}" == *"service_U"* ]]; then
            EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
                "Extra: .*"  "Extra: ccc"
        fi
    else
        EchoOtherCase  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}"
    fi
}

function  ServiceD_EditSettingsInAFile() {
    local  file_path="$1"
    local  line_num="$2"
    local  configuration_from="$3"
    local  configuration_to="$4"

    local  service="ServiceD"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "application" "server"
        "test"        "server"
        "debug"       "local docker"
    )
    local  setting_from="$(_Get setting "${configuration_from}" )"
    local  setting_to="$(_Get setting "${configuration_to}" )"

    if [ "${setting_from}" == "server"  -a  "${setting_to}" == "local docker" ]; then

        echo  ""
        echo  "W1) The next edit is expected to have a warning."
        SetSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "notFound:"  "D"
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "notFound: .*"  "notFound: D"

        echo  ""
        echo  "N1) The next edit is expected to have no warning."
        SetSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "bad:"  "d"
        SetSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "bad:"  "d"
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "bad: D"  "bad: d"
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "bad: D"  "bad: d"

        echo  ""
        echo  "N2) The next edit is expected to have no warning."
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\(bad\): d"  "\1: D"
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\(bad\): D"  "\1: d"
        EditSetting  "${file_path}"  "$((${line_num} + 0))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\(bad\): \(d\|D\)"  "\1: d"

        echo  ""
        echo  "N3) The next edit is expected to have no warning."
        SetSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "withEscape:"  'a\nb\nc'
        EditSetting  "${file_path}"  "$((${line_num} + 1))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            'withEscape: A\\nB\\nC'  'withEscape: a\\nb\\nc'

        echo  ""
        echo  "N4) The next edit is expected to have no warning."
        EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\\(path\\): \\/A\\/B\\.log"  "path: \\/a\\/b\\.log"
        EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            '\(path\): \/A\/B\.log'  'path: \/a\/b\.log'

        echo  ""
        echo  "N5) The next edit is expected to have no warning."
        EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\\(path\\): \\/A\\/B\\.log"  "\\1: \\/a\\/b\\.log"
        EditSetting  "${file_path}"  "$((${line_num} + 2))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            '\(path\): \/A\/B\.log'  '\1: \/a\/b\.log'

        echo  ""
        echo  "N6) The next edit is expected to have no warning."
        EditSetting  "${file_path}"  "$((${line_num} + 3))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            "\\(quotation\\): 'A'"  "quotation: 'a'"
        EditSetting  "${file_path}"  "$((${line_num} + 3))"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${FUNCNAME[0]}" \
            '\(quotation\): '"'"'A'"'"  'quotation: '"'"'a'"'"

        if [ "${ErrorCount}" != "2" ]; then
            Error  "ERROR: Bad warning count"
        else
            ErrorCount=0
        fi
    else
        Error  "Test Error"
    fi
}

function  SetSetting() {
    local  file_path="$1"
    local  line_num="$2"
    local  service="$3"
    local  configuration_from="$4"
    local  setting_from="$5"
    local  configuration_to="$6"
    local  setting_to="$7"
    local  changer_function_name="$8"
    local  starts_with="$9"
    shift
    local  value="$9"

    local  regular_expression="${starts_with}.*"
    local  sed_replace_to="$( SetLastOf  "${starts_with}"  " " )$( echo "${value}" | sed -e 's/\\/\\\\/g' | sed -e 's/\//\\\//g' )"

    EditSetting  "${file_path}"  "${line_num}"  "${service}"  "${configuration_from}"  "${setting_from}"  "${configuration_to}"  "${setting_to}"  "${changer_function_name}" \
        "${regular_expression}"  "${sed_replace_to}"
}

function  EditSetting() {
    local  file_path="$1"
    local  line_num="$2"
    local  service="$3"
    local  configuration_from="$4"
    local  setting_from="$5"
    local  configuration_to="$6"
    local  setting_to="$7"
    local  changer_function_name="$8"
    local  regular_expression="$9"
    shift
    local  sed_replace_to="$9"
    local  unescaped_replace_to="$( echo "${sed_replace_to}" | sed -e 's/\\\\n/\\n/g' | sed -e 's/\\\//\//g'  | sed -e 's/\\\./\./g' )"
    unescaped_replace_to="$( echo "${unescaped_replace_to}" | sed -e 's/^\\[1-9]//' )"

    echo  "${file_path}:${line_num}: ${unescaped_replace_to}  #// ${service}: Change a setting from \"${setting_from}\" to \"${setting_to}\" by ${changer_function_name} function"

    #// Check
    local  line=$(sed -n ${line_num}P "${file_path}")
    local  found="${False}"

    echo "${line}" | grep "${regular_expression}" > /dev/null  &&  found="${True}"
    if [ "${found}" == "${False}" ]; then

        if [[ "${line}" != *"${unescaped_replace_to}"* ]]; then
            echo   "    ${file_path}:${line_num}: ${line}"
            Error  "        ERROR: not matched pattern \"${regular_expression}\" or not contains \"${unescaped_replace_to}\""
            return
        fi
    fi

    #// Replace
    local  text="$(sed "${line_num} s/${regular_expression}/${sed_replace_to}/g" "${file_path}" )"
    if [ "${text}" != "" ]; then
        echo "${text}" > "${file_path}"
    fi
}

function  EchoOtherCase() {
    local  file_path="$1"
    local  line_num="$2"
    local  service="$3"
    local  configuration_from="$4"
    local  setting_from="$5"
    local  configuration_to="$6"
    local  setting_to="$7"
    local  changer_function_name="$8"

    if [ "${setting_from}" != ""  -a  "${setting_to}" != "" ]; then
        if [ "${setting_from}" == "${setting_to}" ]; then
            echo "${file_path}:${line_num}: ${service}: No changed setting (${setting_to}) by ${changer_function_name} function"
        else
            echo "ERROR: Not defined edit script in ${changer_function_name} function for setting from \"${setting_from}\" to \"${setting_to}\""
        fi
    else
        if [ "${setting_from}" == "" ]; then
            Error "ERROR: Not defined configuration name \"${configuration_from}\" in ${changer_function_name} function"
        fi
        if [ "${setting_to}" == "" ]; then
            Error "ERROR: Not defined configuration name \"${configuration_to}\" in ${changer_function_name} function"
        fi
    fi
}

function  TestMain() {
    ChangeTheConfiguration  "application"  "debug"
    ChangeTheConfiguration  "debug"  "application"
}

function  WarningTest() {
    local  configuration_from="application"
    local  configuration_to="debug"

    local  service_T_file_path="./service_T.yaml"
    ServiceD_EditSettingsInAFile  "${service_T_file_path}"  18  "${configuration_from}" "${configuration_to}"
}

function SetLastOf() {
    local  input="$1"
    local  last="$2"

    if [ "${input:${#input}-${#last}:${#last}}" == "${last}" ]; then
        echo  "${input}"
    else
        echo  "${input}${last}"
    fi
}

function  Test_SetLastOf() {

    local  result="$( SetLastOf  "abc"  " " )"
    if [ "${result}" != "abc " ]; then
        Error  "SetLastOf (1)"
    fi

    local  result="$( SetLastOf  "abc "  " " )"
    if [ "${result}" != "abc " ]; then
        Error  "SetLastOf (2)"
    fi

    local  result="$( SetLastOf "abc" "bc" )"
    if [ "${result}" != "abc" ]; then
        Error  "SetLastOf (3)"
    fi
}

#// _Get
#// Example:
#//    object=(key_A "1" key_B "x")
#//    echo "$(_Get "${object[@]}" key_B )"
function  _Get() {
    local  object_name="${1}"
    local  key="$2"
    local  operation=""

    operation="_GetSub \"\${${object_name}[@]}\" \"${key}\""
    eval "${operation}"
}

function  _GetSub() {
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

#// _Set
#// Example:
#//    object=(key_A "1" key_B "x")
#//    eval "$(_Set object key_B "y" )"
function  _Set() {
    local  object_name="${1}"
    local  key="$2"
    local  value="$3"
    local  operation=""

    operation="_SetSub \"\${${object_name}[@]}\" \"${object_name}\" \"${key}\" \"${value}\""
    eval "${operation}"
}

function  _SetSub() {
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

function  Error() {
    local  errorMessage="$1"

    echo  "${errorMessage}"
    ErrorCount=$(( ${ErrorCount} + 1 ))
}
ErrorCount=0

function  TestOfGetSet() {
    echo  "Strat of TestOfGetSet()."
    object=(key_A "1" key_B "x")
    echo  "$(_Get object key_A )"
    echo  "$(_Get object key_B )"
    eval  "$(_Set object key_A "2" )"
    eval  "$(_Set object key_B "y" )"
    eval  "$(_Set object key_C "z  z" )"
    echo  "$(_Get object key_A )"
    echo  "$(_Get object key_B )"
    echo  "$(_Get object key_C )"
    echo  "End of TestOfGetSet()."
    echo  ""
}

True=0
False=1
if true; then

    Main  "$@"
else
    TestOfGetSet
    Test_SetLastOf
    TestMain
    WarningTest
    echo  ""
    echo  "ErrorCount: ${ErrorCount}"
fi
