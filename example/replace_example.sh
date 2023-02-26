#!/bin/bash

function  Main() {
    LoadEnvironmentVariables  "$@"

    local  configurationFrom="debug"
    local  configurationTo="release"
        #// [ "release", "test", "debug" ]
    #// reverse
        # local  configurationFrom="release"
        # local  configurationTo="debug"

    ChangeTheConfiguration  "${configurationFrom}"  "${configurationTo}"
    echo  ""
    echo  "ErrorCount: ${ErrorCount}"
}

#// ChangeTheConfiguration
#// Parameters:
#//     $1, $2: [ "release", "test", "debug" ]
function  ChangeTheConfiguration() {
    local  configurationFrom="$1"
    local  configurationTo="$2"

    echo  "Change the configuration from \"${configurationFrom}\" to \"${configurationTo}\""

    local  service_S_filePath="./service_S.yaml"
    ServiceA_SetSettingsInAFile  "${service_S_filePath}"  3  "${configurationFrom}" "${configurationTo}"

    local  service_T_filePath="./service_T.yaml"
    ServiceA_SetSettingsInAFile   "${service_T_filePath}"  3  "${configurationFrom}" "${configurationTo}"
    ServiceB_SetSettingsInAFile   "${service_T_filePath}"  5  "${configurationFrom}" "${configurationTo}"
    RegExpB_EditSettingsInAFile   "${service_T_filePath}" 12  "${configurationFrom}" "${configurationTo}"
    ServiceC_EditSettingsInAFile  "${service_T_filePath}" 19  "${configurationFrom}" "${configurationTo}"
    Secret_SetSettingsInAFile     "${service_T_filePath}" 30  "${configurationFrom}" "${configurationTo}"

    local  service_U_filePath="./service_U.yaml"
    ServiceC_EditSettingsInAFile  "${service_U_filePath}"  2  "${configurationFrom}" "${configurationTo}"
}

function  ServiceA_SetSettingsInAFile() {
    local  filePath="$1"
    local  lineNum="$2"
    local  configurationFrom="$3"
    local  configurationTo="$4"

    local  service="ServiceA"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "release" "server"
        "test"    "local docker"
        "debug"   "local docker"
    )
    local  settingFrom="$(_Get setting "${configurationFrom}" )"
    local  settingTo="$(_Get setting "${configurationTo}" )"

    if [ "${settingTo}" == "server" ]; then
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "property:"  "AA"

    elif [ "${settingTo}" == "local docker" ]; then
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "property:"  "aa"
    else
        EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
    fi
}

function  ServiceB_SetSettingsInAFile() {
    local  filePath="$1"
    local  lineNum="$2"
    local  configurationFrom="$3"
    local  configurationTo="$4"

    local  service="ServiceB"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "release" "server"
        "test"    "server"
        "debug"   "local docker"
    )
    local  settingFrom="$(_Get setting "${configurationFrom}" )"
    local  settingTo="$(_Get setting "${configurationTo}" )"

    if [ "${settingTo}" == "server" ]; then
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyX:"  "XB"
        SetSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyY: "  "YB"
        SetSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "withSlash:"  "A/B.log"
        SetSetting  "${filePath}"  "$((${lineNum} + 3))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'withEscape:'  'A\nB'
        SetSetting  "${filePath}"  "$((${lineNum} + 4))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'specialCharacter:'  "'(\, &)'"
        if [ "${settingFrom}" == "local docker" ]; then
            SetSetting  "${filePath}"  "$((${lineNum} + 5))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
                'previous:'  'server'
        else
            EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
        fi

    elif [ "${settingTo}" == "local docker" ]; then
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyX:"  "xb"
        SetSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyY: "  "yb"
        SetSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "withSlash:"  "a/b.log"
        SetSetting  "${filePath}"  "$((${lineNum} + 3))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'withEscape:'  'a\nb'
        SetSetting  "${filePath}"  "$((${lineNum} + 4))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'specialCharacter:'  "'[\, &]'"
        if [ "${settingFrom}" == "server" ]; then
            SetSetting  "${filePath}"  "$((${lineNum} + 5))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
                'previous:'  'local docker'
        else
            EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
        fi
    else
        EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
    fi
}

function  RegExpB_EditSettingsInAFile() {
    local  filePath="$1"
    local  lineNum="$2"
    local  configurationFrom="$3"
    local  configurationTo="$4"

    local  service="ServiceB"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "release" "server"
        "test"    "server"
        "debug"   "local docker"
    )
    local  settingFrom="$(_Get setting "${configurationFrom}" )"
    local  settingTo="$(_Get setting "${configurationTo}" )"

    if [ "${settingTo}" == "server" ]; then
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyX: .*"  "propertyX: XB"
        EditSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyY: .*"  "propertyY: YB"
        EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "withSlash: .*"  "withSlash: A\\/B\\.log"
        EditSetting  "${filePath}"  "$((${lineNum} + 3))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'withEscape: a\\nb'  'withEscape: A\\nB'
        EditSetting  "${filePath}"  "$((${lineNum} + 4))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'specialCharacter: .*'  "specialCharacter: '(\\\\, \&)'"
        if [ "${settingFrom}" == "local docker" ]; then
            EditSetting  "${filePath}"  "$((${lineNum} + 5))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
                'previous: .*'  'previous: server'
        else
            EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
        fi

    elif [ "${settingTo}" == "local docker" ]; then
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyX: .*"  "propertyX: xb"
        EditSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyY: .*"  "propertyY: yb"
        EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "withSlash: .*"  "withSlash: a\\/b\\.log"
        EditSetting  "${filePath}"  "$((${lineNum} + 3))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'withEscape: A\\nB'  'withEscape: a\\nb'
        EditSetting  "${filePath}"  "$((${lineNum} + 4))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'specialCharacter: .*'  "specialCharacter: '[\\\\, \&]'"
        if [ "${settingFrom}" == "server" ]; then
            EditSetting  "${filePath}"  "$((${lineNum} + 5))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
                'previous: .*'  'previous: local docker'
        else
            EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
        fi
    else
        EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
    fi
}

function  ServiceC_EditSettingsInAFile() {
    local  filePath="$1"
    local  lineNum="$2"
    local  configurationFrom="$3"
    local  configurationTo="$4"

    local  service="ServiceC"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "release" "server"
        "test"    "server"
        "debug"   "local docker"
    )
    local  settingFrom="$(_Get setting "${configurationFrom}" )"
    local  settingTo="$(_Get setting "${configurationTo}" )"

    if [ "${settingTo}" == "server" ]; then
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyC1: .*"  "propertyC1: C"
        EditSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\(propertyC2\|renamed\): .*"  "\1: CC"
        if [[ "${filePath}" == *"service_U"* ]]; then
            EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
                "Extra: .*"  "Extra: CCC"
        fi

    elif [ "${settingTo}" == "local docker" ]; then
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "propertyC1: .*"  "propertyC1: c"
        EditSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\(propertyC2\|renamed\): .*"  "\1: cc"
        if [[ "${filePath}" == *"service_U"* ]]; then
            EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
                "Extra: .*"  "Extra: ccc"
        fi
    else
        EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
    fi
}

function  TestOfWarningSub() {
    local  filePath="$1"
    local  lineNum="$2"
    local  configurationFrom="$3"
    local  configurationTo="$4"

    local  service="ErrorTest"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "release" "server"
        "test"    "server"
        "debug"   "local docker"
    )
    local  settingFrom="$(_Get setting "${configurationFrom}" )"
    local  settingTo="$(_Get setting "${configurationTo}" )"

    if [ "${settingFrom}" == "local docker"  -a  "${settingTo}" == "server" ]; then
        local  errorCountAtStarting="${ErrorCount}"

        echo  ""
        echo  "W1) The next edit is expected to have a warning."
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "notFound:"  "D"
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "notFound: .*"  "notFound: D"

        echo  ""
        echo  "N1) The next edit is expected to have no warning."
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "bad:"  "d"
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "bad:"  "d"
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "bad: D"  "bad: d"
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "bad: D"  "bad: d"

        echo  ""
        echo  "N2) The next edit is expected to have no warning."
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\(bad\): d"  "\1: D"
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\(bad\): D"  "\1: d"
        EditSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\(bad\): \(d\|D\)"  "\1: d"

        echo  ""
        echo  "N3) The next edit is expected to have no warning."
        SetSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "withEscape:"  'a\nb\nc'
        EditSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            'withEscape: A\\nB\\nC'  'withEscape: a\\nb\\nc'

        echo  ""
        echo  "N4) The next edit is expected to have no warning."
        EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\\(path\\): \\/A\\/B\\.log"  "path: \\/a\\/b\\.log"
        EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            '\(path\): \/A\/B\.log'  'path: \/a\/b\.log'

        echo  ""
        echo  "N5) The next edit is expected to have no warning."
        EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\\(path\\): \\/A\\/B\\.log"  "\\1: \\/a\\/b\\.log"
        EditSetting  "${filePath}"  "$((${lineNum} + 2))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            '\(path\): \/A\/B\.log'  '\1: \/a\/b\.log'

        echo  ""
        echo  "N6) The next edit is expected to have no warning."
        EditSetting  "${filePath}"  "$((${lineNum} + 3))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "\\(quotation\\): 'A'"  "quotation: 'a'"
        EditSetting  "${filePath}"  "$((${lineNum} + 3))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            '\(quotation\): '"'"'A'"'"  'quotation: '"'"'a'"'"

        if [ "${ErrorCount}" != "${errorCountAtStarting}" ]; then
            ShowHintToEditReplaceSettings  "${filePath}"  "${lineNum}"  "${service}"  "${FUNCNAME[0]}"  "${lineNum}" \
                "\(bad: d\|WarningHintA\|WarningHintB\)"
        fi

        if [ "${ErrorCount}" != "2" ]; then
            Error  "ERROR: Bad warning count"
        else
            ErrorCount=0
        fi
    else
        Error  "Test Error"
    fi
}

function  Secret_SetSettingsInAFile() {
    local  filePath="$1"
    local  lineNum="$2"
    local  configurationFrom="$3"
    local  configurationTo="$4"

    local  service="Secret"
    setting=(
        # "__Configuration__"  "__Setting__"
        # ------------------------------------
        "release" "private"
        "test"    "public"
        "debug"   "public"
    )
    local  settingFrom="$(_Get setting "${configurationFrom}" )"
    local  settingTo="$(_Get setting "${configurationTo}" )"

    if [ "${settingTo}" == "private" ]; then
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "setPassword:"  "${SET_PASSWORD}"  '${SET_PASSWORD}'
        EditSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "editPassword: .*"  "editPassword: ${EDIT_PASSWORD}"  'editPassword: ${EDIT_PASSWORD}'
    elif [ "${settingTo}" == "public" ]; then
        SetSetting  "${filePath}"  "$((${lineNum} + 0))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "setPassword:"  "1234"
        EditSetting  "${filePath}"  "$((${lineNum} + 1))"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}" \
            "editPassword: .*"  "editPassword: 1234"
    else
        EchoOtherCase  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${FUNCNAME[0]}"  "${lineNum}"
    fi
}

# SetSetting
#    Arguments are a field name and colon ($8) and its value ($9)
function  SetSetting() {
    local  filePath="$1"
    local  lineNum="$2"
    local  service="$3"
    local  configurationFrom="$4"
    local  settingFrom="$5"
    local  configurationTo="$6"
    local  settingTo="$7"
    local  changerFunctionName="$8"
    local  changerLineNum="$9"
    shift
    local  startsWith="$9"
    shift
    local  value="$9"  #// $10
    shift
    local  displayableValue="$9"  #// $11

    local  regularExpression="${startsWith}.*"
    local  sedReplaceTo="$( SetLastOf  "${startsWith}"  " " )$( echo "${value}" |
        sed -e 's/\\/\\\\/g' | sed -e 's/\//\\\//g' | sed -e 's/&/\\&/g' )"
    if [ "${displayableValue}" != "" ]; then
        local  displayableReplaceTo="$( SetLastOf  "${startsWith}"  " " )${displayableValue}"
    else
        local  displayableReplaceTo=""
    fi

    EditSetting  "${filePath}"  "${lineNum}"  "${service}"  "${configurationFrom}"  "${settingFrom}"  "${configurationTo}"  "${settingTo}"  "${changerFunctionName}"  "${changerLineNum}" \
        "${regularExpression}"  "${sedReplaceTo}"  "${displayableReplaceTo}"
}

# EditSetting
#    Arguments $9 and $10 are same as sed command parameters without -e option
function  EditSetting() {
    local  filePath="$1"
    local  lineNum="$2"
    local  service="$3"
    local  configurationFrom="$4"
    local  settingFrom="$5"
    local  configurationTo="$6"
    local  settingTo="$7"
    local  changerFunctionName="$8"
    local  changerLineNum="$9"
    shift
    local  regularExpression="$9"
    shift
    local  sedReplaceTo="$9"  #// $10
    shift
    local  displayableReplaceTo="$9"  #// $11

    local  unescapedReplaceTo="$( echo "${sedReplaceTo}" |
        sed -e 's/\\\\n/\\n/g' | sed -e 's/\\\//\//g' | sed -e 's/\\\./\./g' |
        sed -e 's/\\\\/\\/g' | sed -e 's/\\&/\&/g' )"
    unescapedReplaceTo="$( echo "${unescapedReplaceTo}" | sed -e 's/^\\[1-9]//' )"
    if [ "${displayableReplaceTo}" == "" ]; then
        displayableReplaceTo="${unescapedReplaceTo}"
    fi

    echo  "${filePath}:${lineNum}: ${displayableReplaceTo}  #// ${service}: Change a setting from \"${settingFrom}\" to \"${settingTo}\" by ${changerFunctionName} ${changerLineNum} function"

    #// Check
    local  line=$( sed -n ${lineNum}P "${filePath}")
    local  found="${False}"

    echo "${line}" | grep "${regularExpression}" > /dev/null  &&  found="${True}"
    if [ "${found}" == "${False}" ]; then

        if [[ "${line}" != *"${unescapedReplaceTo}"* ]]; then
            echo  "${filePath}:${lineNum}: ${line}  #// Current contents"
            echo  ""
            Error  "    ${changerFunctionName} ${changerLineNum}: ERROR: not matched pattern \"${regularExpression}\" or not contains \"${unescapedReplaceTo}\""
            return
        fi
    fi

    #// Replace
    local  text="$(sed "${lineNum} s/${regularExpression}/${sedReplaceTo}/g" "${filePath}" )"
    if [ "${text}" != "" ]; then
        echo "${text}" > "${filePath}"
    fi
}

function  EchoOtherCase() {
    local  filePath="$1"
    local  lineNum="$2"
    local  service="$3"
    local  configurationFrom="$4"
    local  settingFrom="$5"
    local  configurationTo="$6"
    local  settingTo="$7"
    local  changerFunctionName="$8"
    local  changerLineNum="$9"

    if [ "${settingFrom}" != ""  -a  "${settingTo}" != "" ]; then
        if [ "${settingFrom}" == "${settingTo}" ]; then
            echo "${filePath}:${lineNum}: ${service}: No changed setting (${settingTo}) by ${changerFunctionName} ${changerLineNum} function"
        else
            echo "ERROR: Not defined edit script in ${changerFunctionName} ${changerLineNum} function for setting from \"${settingFrom}\" to \"${settingTo}\""
        fi
    else
        if [ "${settingFrom}" == "" ]; then
            Error "ERROR: Not defined configuration name \"${configurationFrom}\" in ${changerFunctionName} ${changerLineNum} function"
        fi
        if [ "${settingTo}" == "" ]; then
            Error "ERROR: Not defined configuration name \"${configurationTo}\" in ${changerFunctionName} ${changerLineNum} function"
        fi
    fi
}

function  ShowHintToEditReplaceSettings() {
    local  filePath="$1"
    local  firstLineNum="$2"
    local  service="$3"
    local  changerFunctionName="$4"
    local  changerLineNum="$5"
    local  regularExpression="$6"
    echo  ""
    echo  "    ${changerFunctionName} ${changerLineNum}: INFO: grep '${regularExpression}'  \"${filePath}\"  #// Hint to edit replace settings"

    local  grepOutput="$( grep -n  "${regularExpression}"  "${filePath}" )"
    local  oldIFS="$IFS"
    IFS=$'\n'
    local  lineNunbers=( $( echo  "${grepOutput}"  |  grep -o  '^[0-9][0-9]*' ) )
    local  grepOutputArray=( ${grepOutput} )
    IFS="$oldIFS"
    for (( i = 0; i < ${#grepOutputArray[@]}; i += 1 ));do
        local  lineNum="${lineNunbers[$i]}"
        local  offset=$(( ${lineNum} - ${firstLineNum} ))
        local  lineNumAndOffset="${lineNum}(=${firstLineNum}+${offset})"
        local  lineContents="$( echo  "${grepOutputArray[$i]}"  |  grep -o ":.*" )"

        echo  "        ${lineNumAndOffset}${lineContents}"
    done
    echo  ""
}

function  TestMain() {
    ChangeTheConfiguration  "debug"  "release"
    ChangeTheConfiguration  "release"  "debug"
}

function  TestOfWarning() {
    local  configurationFrom="debug"
    local  configurationTo="release"

    local  service_T_filePath="./service_T.yaml"
    TestOfWarningSub  "${service_T_filePath}"  22  "${configurationFrom}" "${configurationTo}"
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
#//    object=(keyA "1" keyB "x")
#//    echo "$(_Get "${object[@]}" keyB )"
function  _Get() {
    local  objectName="${1}"
    local  key="$2"
    local  operation=""

    operation="_GetSub \"\${${objectName}[@]}\" \"${key}\""
    eval "${operation}"
}

function  _GetSub() {
    local  objectEntries=("${@}")
    local  keyIndex=$(( ${#objectEntries[@]} - 1 ))
    local  key="${objectEntries[${keyIndex}]}"
    local  value=""

    for (( i = 0; i < "${keyIndex}"; i += 2 ));do
        if [ "${objectEntries[${i}]}" == "${key}" ]; then
            value="${objectEntries[${i}+1]}"
        fi
    done

    echo "${value}"
}

#// _Set
#// Example:
#//    object=(keyA "1" keyB "x")
#//    eval "$(_Set object keyB "y" )"
function  _Set() {
    local  objectName="${1}"
    local  key="$2"
    local  value="$3"
    local  operation=""

    operation="_SetSub \"\${${objectName}[@]}\" \"${objectName}\" \"${key}\" \"${value}\""
    eval "${operation}"
}

function  _SetSub() {
    local  objectEntries=("${@}")
    local  count=${#objectEntries[@]}
    local  objectNameIndex=$(( ${count} - 3 ))
    local  keyIndex=$(( ${count} - 2 ))
    local  valueIndex=$(( ${count} - 1 ))
    local  objectName="${objectEntries[${objectNameIndex}]}"
    local  key="${objectEntries[${keyIndex}]}"
    local  value="${objectEntries[${valueIndex}]}"
    local  command=""

    for (( i = 0; i < "${keyIndex}"; i += 2 ));do
        if [ "${objectEntries[${i}]}" == "${key}" ]; then

            command="${objectName}[$(( ${i} + 1 ))]=\"${value}\""
        fi
    done
    if [ "${command}" == "" ]; then
        local  newKeyIndex=$(( ${count} - 3 ))
        local  newValueIndex=$(( ${count} - 2 ))

        command="${objectName}[${newKeyIndex}]=\"${key}\"; ${objectName}[${newValueIndex}]=\"${value}\""
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
    object=(keyA "1" keyB "x")
    echo  "$(_Get object keyA )"
    echo  "$(_Get object keyB )"
    eval  "$(_Set object keyA "2" )"
    eval  "$(_Set object keyB "y" )"
    eval  "$(_Set object keyC "z  z" )"
    echo  "$(_Get object keyA )"
    echo  "$(_Get object keyB )"
    echo  "$(_Get object keyC )"
    echo  "End of TestOfGetSet()."
    echo  ""
}

function  LoadEnvironmentVariables() {
    if [ "${USERPROFILE}" == "" ]; then
        if [ -e "/mnt/c" ]; then  #// for WSL2
            export USERPROFILE="/mnt/c/Users/$( cmd.exe /c 'echo %USERNAME%' )";
            export USERPROFILE="${USERPROFILE:0:${#USERPROFILE}-1}"  #// Cut last CR
        else
            export USERPROFILE="undefined"
        fi
    fi
    if [ "${_Dbg_DEBUGGER_LEVEL}" == "" ]; then            
        ScriptPath="$0"
    else
        ScriptPath="${USERPROFILE}/Desktop/replace/replace_example.sh"
    fi
    ScriptFolderPath="${ScriptPath%/*}"

    if [ -e "${ScriptFolderPath}/.env" ]; then
        source  "${ScriptFolderPath}/.env"
    fi
}

#// pp "$config"
#// pp "$config" config
#// pp "$array" array  ${#array[@]}  "${array[@]}"
#// $( pp "$config" >&2 )
function  pp() {
    local  value="$1"
    local  variableName="$2"
    if [ "${variableName}" != "" ]; then  variableName=" ${variableName} "  ;fi
    local  oldIFS="$IFS"
    IFS=$'\n'
    local  valueLines=( ${value} )
    IFS="$oldIFS"
    if [[ "$(declare -p ${variableName})" =~ "declare -a" ]]; then
        local  type="array"
    elif [ "${#valueLines[@]}" == 1  -o  "${#valueLines[@]}" == 0 ]; then
        local  type="oneLine"
    else
        local  type="multiLine"
    fi

    if [[ "${type}" == "oneLine" ]]; then
        echo  "@@@${variableName}= \"${value}\" ---------------------------"
    elif [[ "${type}" == "multiLine" ]]; then
        echo  "@@@${variableName}---------------------------"
        echo  "\"${value}\""
    elif [[ "${type}" == "array" ]]; then
        echo  "@@@${variableName}---------------------------"
        local  count="$3"
        if [ "${count}" == "" ]; then
            echo  "[0]: \"$4\""
            echo  "[1]: ERROR: pp parameter is too few"
        else
            local  i="0"
            for (( i = 0; i < ${count}; i += 1 ));do
                echo  "[$i]: \"$4\""
                shift
            done
        fi
    else
        echo  "@@@${variableName}? ---------------------------"
    fi
}

True=0
False=1
if true; then

    Main  "$@"
else
    TestOfGetSet
    Test_SetLastOf
    TestMain
    TestOfWarning
    echo  ""
    echo  "ErrorCount: ${ErrorCount}"
    echo  "Check the output of TestOfWarning function"
fi
