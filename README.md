# typrm

typrm searches snippets such as command options
written in text file format manuals.
Also, it replaces the parameters depending on your situations
so that you can run commands only by the copy and paste.

( [Japanese](./README-jp.md) )

<!-- TOC depthFrom:1 -->

- [typrm](#typrm)
  - [Snippet search - #keyword tag, #glossary tag make highly accurate search to the snippet](#snippet-search---keyword-tag-glossary-tag-make-highly-accurate-search-to-the-snippet)
  - [Replace - replace command, reset command](#replace---replace-command-reset-command)
    - [Replace with #to tag](#replace-with-to-tag)
    - [Execute any command](#execute-any-command)
  - [Install](#install)
    - [For Windows](#for-windows)
    - [For mac](#for-mac)
    - [For CentOS 7](#for-centos-7)
  - [settings tag and #template tag: replaces settings values](#settings-tag-and-template-tag-replaces-settings-values)
    - [The details of settings](#the-details-of-settings)
    - [Setting name](#setting-name)
    - [#template-if tag - replaces the sign of whether the condition is met](#template-if-tag---replaces-the-sign-of-whether-the-condition-is-met)
  - [check command - test that it can be replaced](#check-command---test-that-it-can-be-replaced)
  - [mutual-search command - search link sources and maintain the link relationship](#mutual-search-command---search-link-sources-and-maintain-the-link-relationship)
  - [where command - finds the definition of the setting (variable) value](#where-command---finds-the-definition-of-the-setting-variable-value)
  - [#file-template tag: checks the contents of the file](#file-template-tag-checks-the-contents-of-the-file)
  - [#if tag: set conditions](#if-tag-set-conditions)
  - [#expect tag: checks settings values](#expect-tag-checks-settings-values)
  - [#ref tag: expands file path that contains environment variables](#ref-tag-expands-file-path-that-contains-environment-variables)
    - [Execute commands related to files](#execute-commands-related-to-files)
    - [Replace to the line number of the file](#replace-to-the-line-number-of-the-file)
  - [(for developers) How to build the development environment](#for-developers-how-to-build-the-development-environment)
    - [For Windows](#for-windows-1)
    - [For mac](#for-mac-1)
    - [For Windows host OS and CentOS 7 guest OS](#for-windows-host-os-and-centos-7-guest-os)
  - [(for developers) Test](#for-developers-test)
    - [Test using Jest](#test-using-jest)
    - [Test without Jest](#test-without-jest)
  - [Tag list](#tag-list)

<!-- /TOC -->


## Snippet search - #keyword tag, #glossary tag make highly accurate search to the snippet

typrm search displays the snippet for the keywords found.

For example, if you search for the keyword `grep`,
you'll see where the keyword `grep` is and the snippet.
You can use `typrm grep` like Linux `man grep`.

typrm command:

    $ typrm grep
    /path/linux.yaml:100: grep: #keyword
        Example: grep -r __keyword__ __FilePath__
        Files that do not contain keywords:
            grep -L __Keyword__ __Path__

To make the snippet show,
tag `#keyword:` with the keywords in the text file you are searching for.
Also, the content displayed in the snippet must be indented with
whitespace deeper than the found line.
The maximum number of lines displayed is 8.
To jump to the contents of the file, run the typrm command
and press Ctrl key and click the displayed path and line number
in Visual Studio Code or other tools.

Sample text file content:

        ....
    grep: #keyword:
        Sample: grep -r __keyword__ __FilePath__
        Files that do not contain keywords:
            grep -L __Keyword__ __Path__
    sed: #keyword:
        ....

Snippets for keywords hit by the `#glossary:` tag are also displayed.
However, snippets are only displayed
for the keywords that have the highest priority.

Also tag `#keyword:` with the keyword that you want to prioritize
in the search results.

Sample text file content:

    Shows all files:  #keyword: ls
    Example: ls -a sub_folder

typrm command:

    $ typrm ls
    .../text.yaml:2: Example: ls -a sub_folder
    .../text.yaml:1: Shows all files:  #keyword: ls

In the above case, `ls` on the line with the `#keyword:` tag is
preferentially found (displayed below).
You can also find keywords that are not tagged with `#keyword:`.

If you have `#keyword: git clone` and `#keyword: git status`,
when you search for `git`, `git clone` is displayed first.
`git status` is displayed second because of the more difference
in the number of characters.
Snippets are only displayed for the keywords that have the first priority.
You can see the snippet of `git status` by searching for `git status`.

Specify the path of the folder containing the file to be searched
in the `TYPRM_FOLDER` environment variable or the `--folder` option.

Case of setting environment variables in PowerShell:

    ${env:TYPRM_FOLDER} = "${env:USERPROFILE}\Documents\typrm"
    typrm ls

Case of specifing to the `--folder` option:

    typrm --folder "${env:USERPROFILE}\Documents\typrm"  ls

The value format of the `TYPRM_FOLDER` environment variable is CSV.
You can specify multiple folder paths.
You can also specify a wildcard for the file name.
You can also specify a file path.

    ${env:TYPRM_FOLDER} = "${env:USERPROFILE}\Documents\typrm, ${env:USERPROFILE}\Files\*.yaml"

You can omit the parameter in the `#keyword:` tag
if the keyword was written up to the colon.
In the following cases, the searchable keyword is ls.

    ls:  #keyword:

If there is a hyphen at the beginning of the line,
the keyword does not include the hyphen.
In the following cases, the searchable keyword is ls.

    - ls:  #keyword:

The typrm search command name (search) can be omitted.
The short command name for the search command is s.

typrm search command format:

    typrm __Keyword__

or

    typrm search __Keyword__

or

    typrm s __Keyword__

If the search keyword was the same as the command name of typrm,
the command name (search or s) cannot be omitted.

Entering `#keyword:` or `#search:` in the search keyword will be ignored.

If you do not specify any keywords with the search command,
the search keyword input mode (typrm shell) is started.
Press Ctrl + C to exit this mode.

    $ typrm
    keyword: csv
    .../text.txt:1: #keyword: CSV, comma separated values
    keyword:

When running in Visual Studio Code terminal,
you can open the file at the found location (path)
by holding down the Ctrl key and clicking.

(For version 1.x)

If you enter # and a number (e.g. #1) after searching,
the command you set for the 'TYPRM_OPEN_DOCUMENT' environment variable
will be executed.
The input number is the number counted from the bottom of the search results.
The '${ref}' in the environment variable value will be replaced to the full path.

bash

    $ export TYPRM_OPEN_DOCUMENT="code -g \"\${ref}\""
    $ typrm
    keyword: csv
    /home/user1/text.txt:1: #keyword: CSV, comma separated values
    keyword: #1

Commands executed

    code -g "/home/user1/text.txt:1"

If you cannot find anything in typrm shell,
you can do the full-text search by pressing the Enter key.
The full-text search is not case sensitive.
Also, word-based search is not possible.

    $ typrm s
    keyword: game
    Not found. To do full text search, press Enter key.
    keyword:
    .../text.txt:1: Game:
    keyword:

In typrm shell, if you inputed starts with `#r`, `#replace:`, `#reset:`, `#c`,
`#check:` or `#mutual:`, typrm runs replace, reset, check or mutual-search command.

    #r                // replace all files
    #r example.yaml
    #replace: example.yaml  // Requires a colon at the end when not abbreviated

(For all versions)

If specifying a search keyword consisting of multiple words,
it is not necessary to enclose it in " ".
Specifying multiple words results in an AND search.
If you increase the number of words, the search result will be refined.
If you reduce the number of words, the related content will also be hit.
OR search is not possible. You can OR search by several times search.

    $ typrm Comma Separated Value
    .../text.txt:1: #keyword: CSV, comma separated values

Even if the case is different, it will be hit,
but the text with the same case will be displayed at the top.
In typrm, the text that hits the top is displayed at the bottom.

The more upper in the following list, the lower search score.
- Difference numbers of words
- Difference numbers of characters
- Lettercase difference

You can specify multiple keywords to be written
by CSV format (comma separated values) after the `#keyword:` tag
in the text file.

    #keyword: CSV, comma separated values, "a,b"

When specifying keywords that include ` #` (blank and #), write `"%20"#`.
` #` (blank and #) are interpreted as the next tags.
When specifying a keyword that contains `"%`, write `""%25"`.
If you want to suppress the warning of the CSV part that has syntax problem,
write `#disable-tag-tool:`.
The `#keyword:` tag parameter is not treated as a keyword.

    #keyword: abc"   #disable-tag-tool:

The `#keyword:` tag and the `#glossary:` tag from the next line
that has the `#(search)if: false` tag
to the previous line that has same indent length
are not searched.

    copy:  #(search)if: false
        #keyword: abc  #// not searchable
        #keyword: def  #// not searchable
    original:
        #keyword: abc  #// searchable

If you add the `#glossary:` tag,
words up to the colon is searchable keywords
that written in the indent line one step deeper than
the indent of the line tagged with `#glossary:`.

    glossary:  #glossary:
        CSV: comma separated values
        SSV: space separated values
        #comment: This is not search target. 

In the above case, you will be able to search for CSV and SSV.
Lines with indents that are two or more steps deep are not searchable,
but if you write the `#glossary:` tag at deeper positions, they will be searchable.

If you add parameters to the `#glossary:` tag,
the key phrase consisting of the parameter and label will be searched,
and you will be able to perform a combination search.

    C++ glossary:  #glossary: C++
        TLS: Thread Local Storage. Memory area that exists for each thread

    security glossary:  #glossary: security
        TLS: Transport Layer Security. The next version of SSL

In the above case, if your input keyword was TLS, typrm shows both TLS.
If your input keyword was C++ TLS, typrm shows only TLS in C++ glossary.

`--thesaurus` option or in the TYPRM_THESAURUS environment variable is
the path of the thesaurus file.
The thesaurus file is in CSV format.
Only synonyms can be specified for the thesaurus.

    $ TYPRM_THESAURUS=/home/user1/Document/thesaurus.csv  typrm s js
    .../script.yaml:1: #keyword: JavaScript

Exmple of thesaurus.csv:

    JavaScript, js
    document, doc
    source, src
    destination, dst, dest


## Replace - replace command, reset command

The manual that tells you to create a new folder and run shell commands in it will tell you to type in the shell as follows:

    mkdir work1
    cd    work1

You can easily do this by copying and pasting it.

But if the work1 folder already exists and you don't want to delete it, you would type something like this in your shell:

    mkdir work2
    cd    work2

In this case, you cannot copy and paste from the manual.
Because the manual says `work1`.

The typrm command thus rewrites multiple parts at once so that you can copy and paste.

To enable typrm, make the file as follows:

new_folder.yaml

    settings: #settings:
        __Name__: work1
    shell:
        - mkdir work1  #template: __Name__
        - cd    work1  #template: __Name__

Write "variable_name: value" at `#settings:` for the part you want to change to.
Write the `#template:` tag at the end of the same line as the part you want to change.
(You can write it on a separate line, it will be explained at the following section.)

(For version 1.x)

Write the `#to:` tag and the value after replacing
at the right of the value of the variable in the setting.

    settings: #settings:
        __Name__: work1  #to: work2

(You can write `#to:` tag out of settings.)

Install typrm and
type the following `replace` command from bash or PowerShell. The short command name is `r`.

    typrm replace  new_folder.yaml  #// or typrm r  new_folder.yaml


(For version 0.x)

Install typrm and
type the following `replace` command from bash or PowerShell. The short command name is `r`.

    cp  "typrm/example/new_folder.yaml"  "."  #// Temporary copy to change from the original file

    typrm replace  new_folder.yaml  4  "__Name__:work2"

You can drag and drop a file to enter the file without having to type it from the keyboard.

4 is an example of the line number. It is same or below the line where `settings:` is written,
or above the line where the next `settings:` is written.
You can omit the line number if there is only one `setting:` in the file.
See the below about the way of specify the setting name instead of the line number.

(For all versions)

new_folder.yaml file will be chaned to the following contents and you can copy and paste.
You can paste the text with the comment as it is,
because  # is treated as a comment in many shells.

    settings: #settings:
        __Name__: work2  #original: work1
    shell:
        - mkdir work2  #template: __Name__
        - cd    work2  #template: __Name__

It replaces `work1` in the settings and document body to `work2`.

`#original:` tag with the value before replacement is added to the same line.
If the `#original:` tag already exists, it will not be added.

(For version 1.x)

To return to the value written in the `#original:` tag, use the reset command.
Also, the reset command removes the `#original:` tag.

    typrm reset  new_folder.yaml

(For version 0.x)

To return to the value written in the `#original:` tag, use the reset command.
Also, the reset command removes the `#original:` tag.

    typrm reset  new_folder.yaml  4

4 is the line number, similar to the replace command.
You can also specify the setting name.

When you enter multiple variable names: new variable values,
you can copy and paste multiple linees and enter them continuously.

    typrm replace  new_folder.yaml  4  "__Name1__: work1
        __Name2__: work2"


### Replace with #to tag

If writing `#to:` tag in the settings,
write `#to:` tag and the value after replacing
at the right of the variable value.

Example before adding the `#to:` tag:

    settings: #settings:
        __Name__: workA1
        __Name__: workB1  #// comment
        __Name__: workC1  #// comment

Example after adding the `#to:` tag:

    settings: #settings:
        __Name__: workA1  #to: workA2
        __Name__: workB1  #to: workB2  #// comment
        __Name__: workC1  #// comment  #to: workC2

Save the file after adding tags.

Entering the following command replaces the `#to:` tag in all files
in the current folder and the folder set in the `TYPRM_FOLDER` environment variable.

Input command:

    typrm replace  #// or typrm r

Contents after command execution:

    settings: #settings:
        __Name__: workA2  #original: workA1
        __Name__: workB2  #original: workB1  #// comment
        __Name__: workC2  #original: workC1  #// comment

If writing `#to:` tag in the body,
write `#to:` tag and the value after replacing
to the right of the `#template:` tag.
Also, add a line with only the `#to:` tag
between the line of the target `#template:` tag
and the line of the next `#template:` tag.

    settings: #settings:
        __NameA__: workA1
        __NameB__: workB1
    shell:
        - mkdir workA1  #template: __NameA__  #to: workA2
        - cd    workB1  #template: __NameB__
                                #to: workB2

You can write the `#to:` tag for the `#template-at:` tag as well.
If you add a line with only the `#to:` tag,
the position of the line indicated by the `#template-at:` tag
(example: -2 = 2 lines before) will be incorrect,
but typrm treats it as if there were no rows of only with the `#to:` tag.
so it does not need to modify the position of the line.

Example before adding the `#to:` tag:

    - mkdir workA1
    - cd    workB1
        #template-at(-2): __NameA__
        #template-at(-2): __NameB__

Example after adding the `#to:` tag:

    - mkdir workA1
    - cd    workB1
        #template-at(-2): __NameA__
            #to: workA2
        #template-at(-2): __NameB__
            #to: workB2

If there are multiple variables,
write `#to:` tag and values in CSV format,
or write the contents after replacing the template.

    (workA1 : workB1)  #template: (__NameA__ : __NameB__)  #to: workA2, workB2

or

    (workA1 : workB1)  #template: (__NameA__ : __NameB__)  #to: (workA2 : workB2)

(For version 1.x)

To find out what variable the `#template:` tag refers to,
rewrite contents temporarily it doesn't match the template
and run the check command.

Before rewriting:

    (workA1 : workB1)  #template: (__NameA__ : __NameB__)

After rewriting temporarily:

    (workA1 : @@@ workB1)  #template: (__NameA__ : __NameB__)

Input command:

    typrm check  #// or typrm c

Contents after command execution:

    example.yaml:64:     settings: #settings:
    example.yaml:65:         __NameA__: workA1
    example.yaml:66:         __NameB__: workB1
    example.yaml:68:         (workA1 : @@@ workB1)  #template: (__NameA__ : __NameB__)
        Warning: Not matched with the template.
        Expected: (workA1 : workB1)

From the content of the warning,
you can see that the variables referenced by the `#template:` tag are
`__NameA__` and` __NameB__`.
You can also see the definition position of each variable.

(For version 0.x)

You can write `#to-test:` tag instead of the `#to:` tag
to test the value of the variable after the replacement.
The file contains `#to-test:` tag does not replace contents.
However, a replace command may not replace the file with the `#to-test:` tag,
but at the same time replace another file without the `#to-test:` tag.

    (workA1, workB1)  #template: (__NameA__ : __NameB__)  #to-test: workA2, workB2
    (workC1, workD1)  #template: (__NameC__ : __NameD__)  #to-test: (workC2 : workD2)

Example of displaying test results:

    Verbose:     /____/____.yaml:1:
    Verbose:         template: (__NameA__ : __NameB__)    ... #template: tag's value
    Verbose:         templatePattern: (* : *)             ... replaced the variable part to * in the #template: tag's value
    Verbose:         toValue: workA2, workB2              ... #to-test: tag's value
    Verbose:         toValueIsMatchedWithTemplate: false  ... false = typrm treats #to-test: tag value as CSV
    Verbose:         __NameA__: workA2                    ... The name of the variable replaced by #to: tag and the value after replacement
    Verbose:         __NameB__: workB2
    Verbose:     /____/____.yaml:2:
    Verbose:         template: (__NameC__ : __NameD__)
    Verbose:         templatePattern: (* : *)
    Verbose:         toValue: (workC2 : workD2)
    Verbose:         toValueIsMatchedWithTemplate: true  ... true = typrm treats #to-test: tag value as the content that replaced from template
    Verbose:         __NameC__: workC2
    Verbose:         __NameD__: workD2

(For all versions)

The typrm replace command replaces the contents of a file according
to the `#to:` tag found in all files.
All files are files that are in the `TYPRM_FOLDER` environment variable
or the folder specified in the `--folder` option.
If you specify a file name, it processes the `#to:` tag in the specified file.

    typrm r
    typrm replace
    typrm replace  --folder my_folder
    typrm r  __FileName__


### Execute any command

To execute a shell command in
search keyword input mode (typrm shell),
enter the command symbol and space before entering the command.
By the way, I often use [indenter](https://github.com/Takakiriy/indenter)
command that remove the indentation of the found example code in YAML.

    $ typrm
    keyword$: $ echo abc
    abc
    keyword$:

To execute a shell command, set the command symbol to the environment variable
`TYPRM_COMMAND_SYMBOL` or the --command-symbol option with typrm command,
and set the working folder (current folder) to the environment variable
`TYPRM_COMMAND_FOLDER` or the --command-folder option with typrm command.

bash

    export  TYPRM_COMMAND_SYMBOL='$'
    export  TYPRM_COMMAND_FOLDER=/Users/user1/bin/typrm_work

PowerShell

    ${env:TYPRM_COMMAND_SYMBOL} = '$'
    ${env:TYPRM_COMMAND_FOLDER} = /Home/user1/bin/typrm_work

The command symbol is shown before the colon in the typrm shell.

    keyword$:

Any command will not be executed if the command symbol is not displayed
before the colon in the typrm shell.

    keyword:

On Windows, you can input the cmd.exe commad.
If you want to run PowerShell commands,
start powershell.exe with the -Command option.

    powershell -Command "Write-Output 'code A' > _out.txt"


## Install

To use typrm, you must install Node.js.

### For Windows

    Install Node.js:
        - https://nodejs.org/ja/download/ >> Windows Installer (.msi) >> 64-bit
        - Open the downloaded file (e.g. node-v14.16.0-x64.exe)
        - Installation options are defaults

    If there is your Windows in the LAN with the proxy in the company and so on:
        Windows Start >> (Input) PowerShell :
            - npm config -g set proxy "http://___.___.___.___:____"
            - npm config -g set https-proxy "http://___.___.___.___:____"

    Download and expand typrm and install Node.js packages used by typrm:
        Windows Start >> (Input) PowerShell :
            cd  "${env:USERPROFILE}\Downloads"
            Invoke-WebRequest  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip -OutFile "typrm.zip"
                #// For the develop branch, change master.zip to develop.zip
            rm -r -fo  "typrm-master"  #// No need to run when installing for the first time
                #// For the develop branch, change typrm-master to typrm-develop
            Expand-Archive  -Path "typrm.zip"  -DestinationPath "."
            cd  "typrm-master"
                #// For the develop branch, change typrm-master to typrm-develop

            npm install --only=production

    If you use PowerShell:
        Create a PS1 script file that launches typrm into the folder where PATH of PowerShell:
            Windows Start >> (Input) PowerShell :
                ${script} = "${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\typrm.ps1"
                cd  ${env:USERPROFILE}\Downloads\typrm-master
                    #// For the develop branch, change typrm-master to typrm-develop
                ${current_folder} = Convert-Path "."
                ${typrm_folder} = "${env:USERPROFILE}\Documents\typrm"

                echo  "`${env:NODE_PATH} = `"${current_folder}\node_modules`"" > ${script}
                echo  "`${env:TYPRM_FOLDER} = `"${typrm_folder}`"" >> "${script}"
                echo  "`${env:TYPRM_OPEN_DOCUMENT} = `"code -g `"`"`${ref}`"" >> "${script}"
                echo  "" > ${script}

                echo  "node --experimental-modules --es-module-specifier-resolution=node  ${current_folder}\build\typrm.js `$PsBoundParameters.Values `$args" >> ${script}

                Set-ExecutionPolicy  RemoteSigned  -Scope CurrentUser  #// Make the script run

    If you use Git bash:
        Install Git for Windows:
            - https://git-scm.com/ >> Downloads >> Windows
            - Open the downloaded file (e.g. Git-2.31.1-64-bit.exe)
            - Press Next button 8 times
            - Configuring the line ending conversions: Checkout as-is, commit as-is
            - Other installation options are defaults
        Create a bash script file that launches typrm into the folder where PATH passed:
            Right click at any folder >> Git bash :
                script="${HOME}/bin/typrm"
                cd  ${HOME}/Downloads/typrm-master
                    #// For the develop branch, change typrm-master to typrm-develop
                current_folder="$(pwd)"
                typrm_folder="${HOME}/Documents/typrm"
                mkdir -p "${HOME}/bin"

                echo  "export  NODE_PATH=\"${HOME}/AppData/Roaming/npm/node_modules\"" > ${script}
                echo  "export  TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
                echo  "export  TYPRM_OPEN_DOCUMENT=\"code -g \\\"\\${ref}\\\"" >> "${script}"
                echo  "" >> "${script}"

                echo  "node --experimental-modules --es-module-specifier-resolution=node  ${current_folder}/build/typrm.js \"\$@\"" >> ${script}

    Check to use typrm command:
        Open new PowerShell or new Git bash:
            typrm --version

    Set the environment variables TYPRM_COMMAND_SYMBOL, TYPRM_COMMAND_FOLDER, TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER as needed

    To uninstall, delete the following files and folders, and uninstall Node.js if you don't need it.
        - ${HOME}/bin/typrm  (Back up your unique settings)
        - ${HOME}/Downloads/typrm.zip
        - ${HOME}/Downloads/typrm-master
        - ${HOME}/Downloads/typrm-develop  (If it exists)

### For mac

    Install Node.js:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - Open the downloaded file (e.g. node-v14.16.0.pkg)
        - Installation options are defaults

    Download and expand typrm and install Node.js packages used by typrm:
        #// Launchpad >> Terminal
        cd  "${HOME}/Downloads"
        setopt interactivecomments
            #// enables comment symbol (#)
        curl -o "typrm.zip"  -kL https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip 
            #// For the develop branch, change master.zip to develop.zip
        rm -rf  "typrm-master"  #// No need to run when installing for the first time
            #// For the develop branch, change typrm-master to typrm-develop
        unzip -o  "typrm.zip"
        cd  "typrm-master"
            #// For the develop branch, change typrm-master to typrm-develop

        npm install --only=production

    Make the script file in the PATH folder to start typrm:
        script="${HOME}/bin/typrm"
        cd  "${HOME}/Downloads/typrm-master"  #// The folder extracted from the Zip file
            #// For the develop branch, change typrm-master to typrm-develop
        typrm_folder="${HOME}/Documents/typrm"
        mkdir -p "${HOME}/bin"
        rm -f  "${script}"  #// No need to run when installing for the first time

        echo  "export  NODE_PATH=\"$(pwd)/node_modules\"" >> "${script}"
        echo  "export  TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
        echo  "export  TYPRM_OPEN_DOCUMENT=\"code -g \\\"\\${ref}\\\"" >> "${script}"
        echo  "" >> "${script}"
        echo  "node --experimental-modules --es-module-specifier-resolution=node  $(pwd)/build/typrm.js \"\$@\"" >> "${script}"
        chmod +x  "${script}"
        unset script
        mkdir -p  "${HOME}/Documents/typrm"

    Check to use typrm command:
        typrm --version

    Set the environment variables TYPRM_COMMAND_SYMBOL, TYPRM_COMMAND_FOLDER, TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER as needed

    To uninstall, delete the following files and folders, and uninstall Node.js if you don't need it.
        - rm  "${HOME}/bin/typrm"  (Back up your unique settings)
        - rm  "${HOME}/Downloads/typrm.zip"
        - rm -rf  "${HOME}/Downloads/typrm-master"
        - rm -rf  "${HOME}/Downloads/typrm-develop"  (If it exists)

### For CentOS 7

    Install Node.js:
        - https://nodejs.org/ja/download/ >> (click 64-bit at the right of) Linux Binaries (x64) >>
            Copy the link
        #// Case of version 14.17.6
        - cd ${HOME}
        - curl -L -O https://nodejs.org/dist/v14.17.6/node-v14.17.6-linux-x64.tar.xz
        - tar -Jxvf  node-v14.17.6-linux-x64.tar.xz
        - rm  node-v14.17.6-linux-x64.tar.xz
        - sudo mv  node-v14.17.6-linux-x64  /opt
        - cd /opt
        - sudo ln -s  node-v14.17.6-linux-x64  node  #// You can skip if you use old and new versions and not use primarily
        - cd ${HOME}
        - PATH=/opt/node/bin:$PATH
        - node --version
        - echo 'export PATH="/opt/node/bin:$PATH"' >> ~/.bashrc

    If there is your machine in the LAN with the proxy in the company and so on:
        npm config -g set proxy "http://___.___.___.___:____"
        npm config -g set https-proxy "http://___.___.___.___:____"

    Download and expand typrm and install Node.js packages used by typrm:
        sudo yum install unzip  #// When unzip cannot be executed
        mkdir -p ~/Downloads
        cd  ~/Downloads
        curl -L -O https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip
            #// For the develop branch, change master.zip to develop.zip
        rm -f  "typrm.zip"  #// No need to run when installing for the first time
        mv  "master.zip"  "typrm.zip"
        rm -rf  "typrm-master"  #// No need to run when installing for the first time
            #// For the develop branch, change typrm-master to typrm-develop
        unzip -o  "typrm.zip"
        cd  "typrm-master"
            #// For the develop branch, change typrm-master to typrm-develop

        npm install --only=production

    Create a bash script file that launches typrm into the folder where PATH passed:
        script="${HOME}/bin/typrm"
        cd  "${HOME}/Downloads/typrm-master"  #// The folder extracted from the Zip file
            #// For the develop branch, change typrm-master to typrm-develop
        typrm_folder="${HOME}/Documents/typrm"
        mkdir -p "${HOME}/bin"
        rm -f  "${script}"  #// No need to run when installing for the first time

        echo  "export  NODE_PATH=\"$(pwd)/node_modules\"" >> "${script}"
        echo  "export  TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
        echo  "export  TYPRM_OPEN_DOCUMENT=\"code -g \\\"\\${ref}\\\"" >> "${script}"
        echo  "" >> "${script}"
        echo  "node --experimental-modules --es-module-specifier-resolution=node  $(pwd)/build/typrm.js \"\$@\"" >> ${script}
        chmod +x  "${script}"
        unset script
        mkdir -p  "${HOME}/Documents/typrm"

    Check to use typrm command:
        typrm --version

    Set the environment variables TYPRM_COMMAND_SYMBOL, TYPRM_COMMAND_FOLDER, TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER as needed

    (If you do not use) delete typrm:
        - rm  "${HOME}/bin/typrm"  (Back up your unique settings)
        - rm  "${HOME}/Downloads/typrm.zip"
        - rm -rf  "${HOME}/Downloads/typrm-master"
        - rm -rf  "${HOME}/Downloads/typrm-develop"  (If it exists)

## settings tag and #template tag: replaces settings values

(For 1.1.x version)

About the text you want to replace, write `variable name: value`
with deeper indentation below `#settings:`.

    settings: #settings:
        __ProjectName__: react1
        __npxOption__: --template typescript

(For 0.x, 1.0.x version)

About the text you want to replace, write `variable name: value`
with deeper indentation below `settings:`.

    settings:
        __ProjectName__: react1
        __npxOption__: --template typescript

(For all versions)

Also, write `#template:` tag at the right of the same line as the text that replaces,
or write `#template:` tag to the entire next line.

Sample to the right of the same line as the text to replace:

    cd  "react1"  #template: "__ProjectName__"

Sample next line of text to replace

    cd  "react1"
        #template: "__ProjectName__"

If you want to write #template tag in the lower line,
write how many line of text you want to replace with the parameters of the `#template-at:` tag.

    cd  "react1"
    node
        #template-at(-2): "__ProjectName__"

The right of `#template:` tag, you can write not only the variable name of the part you want to replace,
but also the text that you do not want to replace.
In the above case, " " is the text that is not replaced.

Replaces only when it matches the text that you replaced with the value before you replaced it.
It does nothing when it matches the text after replacing it.
If neither match is matched, an error occurs.

The sample to match before replacing, when replacing `__ProjectName__` with react2:

    settings: #settings:
        __ProjectName__: react1
    cd  "react1"  #template: "__ProjectName__"

The sample that match after replacement, when replacing `__ProjectName__` with react2:

    settings: #settings:
        __ProjectName__: react1
    cd  "react2"  #template: "__ProjectName__"

The sample that an error occurs, because `"react1"` is not matched:

    settings: #settings:
        __ProjectName__: react1
    cd  "react11"  #template: "__ProjectName__"

In the above case, if you do not enclose the value of the `#template:` tag in " ", the error will not occur, but if you can visually judge that it is correct, you do not need to enclose it.

    settings: #settings:
        __ProjectName__: react1
    cd  "react1"  #template: __ProjectName__

` #` (blank and #) are interpreted as the next tag or comment.
If you want to include ` #` (blank and #) in your template, write `"%20"#`.
When specifying a template that contains `"%`, write`""%25"`.

    cd  "react1 #"  <!-- #template: __ProjectName__"%20"# #-->


### The details of settings

- You can indent any line deeper than another it, but it is not an object
- Variables for which no value is specified cannot be defined.
  Lines with only `variable name:` do not define any variables
- Variable names and values cannot contain #
- (version 0.x) Settings cannot be nested.
    Variables defined by `setting:` above `setting:` cannot be referenced
- (version 1.x) You can nest settings.
    In the space character indent tree structure,
    it can be referenced from the descendants of
    the parent node of `#settings:` that defines the variable.
    If a variable with the same name as the variable defined
    in `#settings:` in the parent direction is also defined
    in `#settings:` in the child direction,
    the value defined in the child direction is referenced.

Example:

    settings: #settings:
        __Name__: project1
        main:
            __MainID__: 123      #// Define __MainID__ not main.__MainID__
            __MainValue__: 500
        sub:
            __SubID__: 123
            __SubValue__: 500
            #__Option__: -f      #// Variable names and values cannot contain #
    body:  #// Since the indent is the same as the settings:, the lines after this are out of the setting range.
        __Page__: 1

List of variables defined in the above settings:
`__Name__`, `__MainID__`, `__MainValue__`, `__SubID__`, `__SubValue__`


### Setting name

(For 0.x version only)

If you wrote a setting name, you can specify the setting name
instead of the line number to be replaced
by the replace command or reset command.
You must write the setting name in parentheses
before the colon of `settings:` in the text you will be replacing.

example.yaml

    settings(project1):
        __Name__: image1
    body:
        This is image1.  #template: __Name__

    settings(project2):
        __Name__: image2
    body:
        This is image2.  #template: __Name__

Command:

    typrm replace  example.yaml  "project1"  "__Name__: Image1"

- The setting name cannot be written numbers only

### #template-if tag - replaces the sign of whether the condition is met

Many manuals may be skipped to read depending on the conditions.
For example, it is a manual that describes how to operate on Windows
and how to operate on mac.
You should read only one phrase or the other in such manual.

You can judge that the phrase should be read or not read
by seeing the symbol or other words only, if you use the `#template-if:` tag.
Also, set the symbol or other word to the value of `template-if(yes)` variable
and `template-if(no)` variable.

    settings: #settings:
        OS: Windows  #// Windows or mac
        template-if(yes): 🌟
        template-if(no):  💤
    Copy operation:
        🌟 for Windows:  #template-if: $settings.OS == Windows
            Ctrl + C
        💤 for mac:      #template-if: $settings.OS == mac
            command + C

To replace it, type the below command with the replace command.

    typrm replace  __FileName__  "OS: mac"

Replacing the value of OS variable from Windows to mac for the above file,
symbols that guide to read or not read the phrase will be replaced.

    settings: #settings:
        OS: mac  #// Windows or mac
        template-if(yes): 🌟
        template-if(no):  💤
    Copy operation:
        💤 for Windows:  #template-if: $settings.OS == Windows
            Ctrl + C
        🌟 for mac:      #template-if: $settings.OS == mac
            command + C


## check command - test that it can be replaced


To check that typrm can replace the settings correctly,
use the `check` command. The short command name is `c`.

    typrm check __FileName__

In order to correctly determine the range to replace the setting value,
typrm checks that the text with the setting value exists before replacing.


## mutual-search command - search link sources and maintain the link relationship

The mutual-search command is used to maintain the link relationships shown below.

The `#search:` tag corresponds to the link source and
indicates that detailed or related information can be searched and found.
For example, if you are reading the content of Title 1 below
and want to see some helpful information,
you can find the line of `Title2 #keyword: example detail`
by `example detail` keyword specified typrm search command.

    Title1:
        Contents:
            Some information.
        Reference:
            Title2: #search: example detail

    Title2:  #keyword: example detail
        The related information.

When changing the search keyword that has the above link relationship,
if you does not make the keyword specified in the `#keyword:` tag and
the keyword specified in the `#search:` tag the same keyword,
or does not include all the keywords specified in the `#keyword:` tag
in the part of the keywords specified in the `#search:` tag,
the link will be broken.

The mutual-search command searches not only the keywords specified
in the `#keyword:` tag but also the keywords specified
in the `#search:` tag.
Change both the source and destination keywords found in this way.

Before:

    example.yaml:5:   Title2: #search: sample detail
    example.yaml:7: Title2:  #keyword: sample detail

After:

    example.yaml:5:   Title2: #search: example detail
    example.yaml:7: Title2:  #keyword: example detail


## where command - finds the definition of the setting (variable) value

(This command cannot be used after version 1.0.0.
If you want to look for the definition position of the variable referenced by `#template:`,
please raise an error that does not match the template.)

To find the location of the variable definitions
(variable name: value) listed in `Settings:`,
enter the where command.

example.yaml:

    1: 設定:
    2:     __FileName__: file.txt
    3:     __Number__: 12
    4: 本文:
    5:     file.txt  #template: __FileName__

To display the location of `__FileName__` variable definition, enter:

    typrm where __FileName__

If found, the location and definition will be displayed as shown below.
Also, you may find more than one.

    .../example.yaml:2:     __FileName__: file.txt

When filtering by file name, type the variable name followed by the file name.

    typrm where __FileName__ example.yaml

When you look for a definition of a variable referenced in a particular template,
type the variable name followed by the file name and line number
where the template is located.

    typrm where __FileName__ example.yaml 5


## #file-template tag: checks the contents of the file

You can check that the contents of another file match the settings.

To check for a match,
use the `check` command. The short command name is `c`.

    typrm check __FileName__

For example, if you write the following,
it will check that the setting value in the `my.json` file is the same as
the setting value written in the `setting:` tag.
If they are not the same, an error will be displayed
when you run the check command.

`__Project__/root.yaml file`:

    settings: #settings:
        __Stage__: develop
    a part of ./my.json:  #file-template: ./my.json
        "stage": "develop"  #template: "__Stage__"

`__Project__/my.json file`:

    {
        "stage": "develop"
    }

If you change the settings as below, an error will occur.

__Project__/root.yaml file:

    settings: #settings:
        __Stage__: product
    a part of ./my.json:  #file-template: ./my.json
        "stage": "product"  #template: "__Stage__"

When checking the content,
compare it with the content without the `#template:` tag.

If the path written to the right of `#file-template:`
is not written to the left of the `#file-template:` tag,
an error will occur.

Compares only some of the files to check.
In the above example, the line has { and the line has } are unchecked.
In other words, it searches in the target file for what you want to check.
If it is not found, an error will occur.

You can also check multiple lines.
The range of lines covered by the `#file-template:` tag is
before the line with the same or shallower indentation
as the line with the `#file-template:` tag.

    a part of ./my.json:  #file-template: ./my.json
        check
        check
        check
    not check

If the path to the right of `#file-template:` is a relative path,
the base path is the folder containing the file with the
`#file-template:` tag.

If you write the `#file-template-any-lines:` tag
in the part of the checked content,
that line (0 or more lines) will not be compared with
the content of the target file.

    a part of ./my.json:  #file-template: ./my.json
        check
        #file-template-any-lines:
        check
    not check

The first line of the check contents searches the target file.
The second and subsequent lines of the check contents are
compared from the line immediately below the line found by the search.
When the check content is `#file-template-any-lines:`,
the check content written on the next line is searched in the target file.


## #if tag: set conditions

When there is a relationship between one setting and another,
write the `#if:` tag inside the `#settings:`.
You can set the value according to the conditions.

    settings: #settings:
        target: banana
        banana:  #if: $settings.target == banana
            __Color__:  yellow
            __Type__:   fruit
        crow:  #if: $settings.target == crow
            __Color__:  black
            __Type__:   bird

The scope of the condition specified in the `#if:` tag
is the same as or before the indentation depth of the line
where the `#if:` tag is written.

The replace command replaces only the values of variables
that satisfy the condition of `#if:` are replaced.
For example, specifying `__Color__` with replace command replaces
`__Color__` after banana and does not replace `__Color__` after crow.
Also, specifying `target` in the replace command replaces
the `target` in the setting,
`target`, `__Color__` and `__Type__` in the body.

To the right of `#if:`, you can write only the conditions
that meet the following format.

    #if: $settings.__SettingsName__ == __Value__
    #if: $settings.__SettingsName__ != __Value__
    #if: $env.__EnvName__ == __Value__
    #if: $env.__EnvName__ != __Value__
    #if: true
    #if: false

`__SettingsName__` is the variable name written in `#settings:`.
`__EnvName__` is the name of the environment variable.
If no environment variable is defined, it will be "".
For example, the condition that it is Windows is written as follows
using the environment variable `windir`,
which is defined by default in Windows and not defined outside of Windows.

    #if: $env.windir != ""

If you write a `#if:` tag out of setting,
it will check whether the contents of the `#template:` tag and the
`#file-template:` tag match only when the conditions are met.

    settings: #settings:
        __Stage__: develop
    command:
        when release:  #if: $settings.__Stage__ != develop
            cp  build  stage  #template: __Stage__

In the above case, only if the value of `__Stage__` is other than develop,
it checks if the `#template:` tag matches the content to the left of it.

The range of the `#template:` tag and the `#file-template:` tag
that are the target of the `#if:` tag is
the same as or shallower than the indent depth of the line
where the `#if:` tag is written. Until before the line.


## #expect tag: checks settings values

If you specify a condition after the `#expect:` tag,
the error will occur if the condition is not met.
Usually used at the same time as the `#if:` tag.

    #if: $settings.__Write__ == yes
        #expect: $settings.__BackUp__ == yes

Example:

    settings: #settings:
        __Write__: yes    #// yes or no
        __BackUp__: yes   #// yes or no
    write method:  #if: $settings.__Write__ == yes
        necessity: yes  #template: __Write__
        How to: Open the file and write
        Related: also back up  #expect: $settings.__BackUp__ == yes
    back up method:
        necessity: yes  #template: __BackUp__
        How to: Download Backup Tool

If there is a dependency on the value of the variable,
write the variable definition in the block of the `#if:` tag
instead of checking with the `#expect:` tag.


## #ref tag: expands file path that contains environment variables

If the referenced file such as an image file or PDF file is installed
on the PC, to open the file by doing copy and paste the path written
in the manual to a browser and so on is faster than
to go into the folder in order to open the referenced file.

    reference: Red Book 2021  C:\Users\user1\Documents\books\manual\red_book_2021.pdf

However, the path written in many manuals cannot be copied,
because the path may contain the user name and
the location of the file may be changed.

    reference: Red Book 2021  #ref: ${books}/manual/red_book_2021.pdf

Above `${books}` part is an example of the replacement part.
If the path or drive of the folder where the file is placed differs
depending on the PC or OS, you can absorb the part to be replaced
by using environment variable. But the format of the part
to expand the environment variable is different depending on the OS.
Also, folders separated by \ can only be used on Windows.

The example of path on Linux or mac:

    ${books}/manual/red_book.pdf  or
    $books/manual/red_book.pdf

The example of path on Windows:

    %books%\manual\red_book.pdf  or
    %books%/manual/red_book.pdf  or
    ${env:books}/manual/red_book.pdf  ... in PowerShell

By using the `#ref:` tag typrm function, you can write the path unifiedly
in the manual by `${____}` format that expands the environment variables
and `/` format that separates the folder names.

    reference: Red Book 2021  #ref: ${books}/manual/red_book_2021.pdf

If you entered `#ref:` and the path containing the environment variable
to the parameters of the search command of typrm
or to the searching keyword input mode prompt,
the path is displayed that you can copy and paste.
Note that the `#` and `$` specified on the command line must be escaped with `\`.

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder

    $ typrm s
    keyword: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    keyword or number:

The value of the environment variable is set when you start typrm.
Note, you must add the command symbol `TYPRM_` to the environment variable name
when you set the define of the environment variable.
If you do not add the command symbol, you can refer to it with `$`
which is not escaped with `\` on the command line,
but you cannot refer to it in typrm shell.
The definition of the environment variable is usually written in the script file
that starts typrm.

`0.Folder` is a menu of functions for executing commands related to files (see below).

Case of Windows PS1 script file:
${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\typrm.ps1:

    ${env:TYPRM_books} = "C:\Users\____\Documents\books"
    node --experimental-modules --es-module-specifier-resolution=node  ____\build\typrm.js $PsBoundParameters.Values $args

Case of Linux bash or mac zsh script file:
${HOME}/bin/typrm:

    export TYPRM_books="/home/____/Documents/books"
    node --experimental-modules --es-module-specifier-resolution=node  ____/build/typrm.js "$@"

If you specify the `#ref:` tag and a path without environment variables
in the search command, typrm displays the parameters of the `#ref:` tag
that should be written in the manual.

    $ typrm s "#ref:" /home/user1/Documents/books/manual/red_book_2021.pdf
    Recommend: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf

    > typrm s
    keyword: #ref: C:\Users\user1\Documents\books\manual\red_book_2021.pdf
    Recommend: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf


### Execute commands related to files

The search (s) command with the `#ref:` tag displays the file path
and the list of commands that specify the file path as a parameter.

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder

`0.Folder` is the command to open the folder containing the file
displayed path.
The command is executed when the number of the command is
additionally specified in the parameter of the search command.

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'  0  #// Folder command

To execute the command, the working folder (current folder) must be set to
the environment variable `TYPRM_COMMAND_FOLDER`.

When you enter typrm shell and display the file path
with the `#ref:` tag, the prompt changes to `keyword or number:`.
If you enter only numbers in this state, the command will be executed.
If you enter a non-numeric number, you can do the same as
when the prompt is `keyword:`.

    $ typrm s
    keyword: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    keyword or number: 0

When the first candidate line (most bottom line) in the search results contains
the `#ref:` tag, you can also select commands related to the file.

    $ typrm s
    keyword: red book
    .../books.yaml:32: #keyword: red book  #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    keyword or number: 0

You can add your defined commands to the list of commands.

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        1.View, 7.Echo, 0.Folder

To allow you to choose commands other than `0.Folder`,
such as` 1.View` and `7.Echo` commands,
set the` TYPRM_VERB` environment variable in YAML format as follows:

Case of Windows PowerShell:

    ${env:TYPRM_VERB} = @"
        - #
            label: 1.View
            number: 1
            regularExpression: ^.*\.(pdf|svg)(#.*)?`$
            command: 'start msedge file:///`${ref}'
        - #
            label: 7.Echo
            number: 7
            regularExpression: .*
            command: 'echo  "ref:  `${ref}";  echo  "file: `${file}";  echo  "windowsFile: `${windowsFile}";  echo  "fragment: `${fragment}"'
    "@
    node --experimental-modules --es-module-specifier-resolution=node   C:\Users\____\Downloads\typrm-master\build\typrm.js $PsBoundParameters.Values $args

Case of mac zsh:

    export  TYPRM_VERB=$(cat <<- '__HERE_DOCUMENT__'
        - #
            label: 1.View
            number: 1
            regularExpression: ^.*\.(pdf|svg)(#.*)?$
            command: '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "file://${ref}"'
        - #
            label: 7.Echo
            number: 7
            regularExpression: .*
            command: 'echo  "ref:  ${ref}";  echo  "file: ${file}";  echo  "windowsFile: ${windowsFile}";  echo  "fragment: ${fragment}"'
        - #
            label: 9.VSCode
            number: 9
            regularExpression: .*
            command: 'code --goto "${ref}"'
    __HERE_DOCUMENT__
    )
    node --experimental-modules --es-module-specifier-resolution=node   ____/build/typrm.js "$@"

You can write variable references in the `command` parameter.

| Variable | Value |
| ---- | ---- |
| ${ref}  | the parameter of `#ref:` |
| ${windowsRef} | `#ref:` parameter replaced from `/` to `\` |
| ${file} | left of `#` in `#ref:` parameter |
| ${windowsFile} | the path with backslash |
| ${fragment} | right of `#` in `#ref:` parameter |
| ${lineNum} | the line number. Set `TYPRM_LINE_NUM_GETTER` environment variable |

You can check the setting value by adding the --verbose option to typrm.


### Replace to the line number of the file

If you specify the file path and parameters by search (s)
command with `#ref:` tag, the file path and line number will be
displayed.

    $ typrm s \#ref: '${projects}/project1/src/app.ts#main'
    C:/Users/user1/Projects/project1/src/app.ts:25
        0.Folder

The contents of the file are searched as keywords
at the right side of `#` and displayed by replacing them
with line numbers.
In the above case, search the contents in the `app.ts` file
with the keyword `main` and display the found line number `25`.

To replace to the line number and display it,
set the `TYPRM_LINE_NUM_GETTER` environment variable in YAML format
as follows.
Note that you should edit the `regularExpression` setting
according to your environment.

Case of Windows PowerShell:

    ${env:TYPRM_LINE_NUM_GETTER} = @"
        - #
            regularExpression: ^(.*\.(yaml|yml|json|js|ts|jsx|tsx|md|py|go|swift))(:csv)?(:id=([0-9]+))?(#(.*))?`$
            type: text
            filePathRegularExpressionIndex: 1
            keywordRegularExpressionIndex: 7
            csvOptionRegularExpressionIndex: 3
            targetMatchIdRegularExpressionIndex: 5
            address: "`${file}:`${lineNum}"
    "@

    node --experimental-modules --es-module-specifier-resolution=node  C:\Users\____\Downloads\typrm-master\build\typrm.js $PsBoundParameters.Values $args

Case of bash or zsh:

    export  TYPRM_LINE_NUM_GETTER=$(cat <<- '__HERE_DOCUMENT__'
        - #
            regularExpression: ^(.*\.(yaml|yml|json|js|ts|jsx|tsx|md|py|go|swift))(:csv)?(:id=([0-9]+))?(#(.*))?$
            type: text
            filePathRegularExpressionIndex: 1
            keywordRegularExpressionIndex: 7
            csvOptionRegularExpressionIndex: 3
            targetMatchIdRegularExpressionIndex: 5
            address: "${file}:${lineNum}"
    __HERE_DOCUMENT__
    )

    node --experimental-modules --es-module-specifier-resolution=node  ____/build/typrm.js "$@"

For `type`, specify `text`.

For `filePathRegularExpressionIndex`, specify the number
in parentheses that corresponds to the file path part of
the result evaluated by `regularExpression`.
The numbers specification in parentheses are the same as
the JavaScript
[RegExp.exec (MDN)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#description) specification.

For `keywordRegularExpressionIndex`, specify the number
in parentheses that corresponds to the keyword part.

For `csvOptionRegularExpressionIndex`, specify the number
in parentheses where the CSV option `:csv` is specified.
If the CSV option is specified,
the parameter on the right side of `#` will be interpreted as
the list of keywords in CSV format.
Also, the first keyword will be searched
and the second keyword will be searched after the first found line.
You can specify three or more keywords.

    $ typrm s \#ref: '${projects}/project1/src/app.ts:csv#first, second'

`targetMatchIdRegularExpressionIndex` will be deprecated.
For `targetMatchIdRegularExpressionIndex`, specify the number
in parentheses that corresponds to the part that
specifies ID of matches in the search.
If `:id=2`, the line number is the number to the second matching line.

    $ typrm s \#ref: '${projects}/project1/src/app.ts:id=2#function'

You can write variable references in the `address` parameter.

| Variable | Value |
| ---- | ---- |
| ${file} | left of `#` in `#ref:` parameter |
| ${windowsFile} | the path with backslash |
| ${lineNum} | the line number |

If you add the --verbose option to the search command of typrm,
you can check the setting value of the TYPRM_LINE_NUM_GETTER environment variable
and the result of the value of the `#ref:` tag parsed by the regular expression.


## (for developers) How to build the development environment

### For Windows

Install Node.js:

    - https://nodejs.org/en/download/ >> Windows Installer (.msi) >> 64-bit
    - Open the downloaded file (e.g. node-v14.16.0-x64.exe)
    - Installation options are defaults

Install Git for Windows:

    - https://git-scm.com/ >> Downloads >> Windows
    - Open the downloaded file (e.g. Git-2.31.1-64-bit.exe)
    - Press Next button 8 times
    - Configuring the line ending conversions: Checkout as-is, commit as-is
    - Other installation options are defaults

Install Visual Studio Code:

    - https://code.visualstudio.com/
    - Open the downloaded file (e.g. VSCodeUserSetup-x64-1.54.3.exe)
    - Installation options are defaults
    - VSCode >> Terminal >> New Terminal
    - If you see powershell in the top right corner of the open shell, click there and 
        [ Select Default Shell >> Git bash ]
    - (recommend) Pin Visual Studio Code to the taskbar
    - (recommend) Set to save all files when Ctrl+S is pressed: |
        File >> Preferences >> Keyboard Shortcuts >> (input) save all >>
            (double click) File: Save All >> Ctrl + S key >> Enter key
    - Close Visual Studio Code

Double click `cmd menu.bat` and select `1. open_VisualStudioCode`:

To run the first test, press F5 key:


### For mac

Install Node.js:

    - https://nodejs.org/en/download/ >> macOS Installer (.pkg)
    - Open the downloaded file (e.g. node-v14.16.0.pkg)
    - Installation options are defaults

Install Visual Studio Code:

    - https://code.visualstudio.com/
    - Open the downloaded file (e.g. Visual Studio Code.app)
    - (recommend) Pin Visual Studio Code to the taskbar
    - (recommend) Set to save all files when Ctrl+S is pressed: |
        File >> Preferences >> Keyboard Shortcuts >> (input) save all >>
            (double click) File: Save All >> Ctrl + S key >> Enter key
    - Close Visual Studio Code

Add `cmd menu.command` file executable permission:

    - Double click `bin/chmod+x.command.zip` file
    - Right click at the expanded `chmod+x.command` file >> Open >> Open
    - Drag and drop `cmd menu.command` file to the opened window, push Enter key and close the window
    - Right click at `cmd menu.command` file >> Open >> Open
    - Close the opened window

Double click `cmd menu.command` file and select `1. open_VisualStudioCode`:

To run the first test, press fn + F5 key:


### For Windows host OS and CentOS 7 guest OS

Install typrm to the guest OS

    See above

Install Visual Studio Code to the host OS:

    - https://code.visualstudio.com/
    - Open the downloaded file (e.g. VSCodeUserSetup-x64-1.54.3.exe)
    - Installation options are defaults
    - VSCode >> Terminal >> New Terminal
    - If you see powershell in the top right corner of the open shell, click there and 
        [ Select Default Shell >> Git bash ]
    - (recommend) Pin Visual Studio Code to the taskbar
    - (recommend) Set to save all files when Ctrl+S is pressed: |
        File >> Preferences >> Keyboard Shortcuts >> (input) save all >>
            (double click) File: Save All >> Ctrl + S key >> Enter key

Add a virtual local network adapter to the VM:

    Power off the VM:
    Menu: VirtualBox >> (target VM) >> Setting(up) >> Network >>
        Adapter 2 >> Enables network adapter >> Allocation = Host Only Adapter
    Start the VM:
    Make a note of the IP address of the guest operating system:
        CentOS >> shell:
            ip a
            #// enp0s8 (IP address, inet line)

Set the firewall to open the VM's ports:

    - sudo firewall-cmd --list-all  #// Shows current zone and settings
    - sudo firewall-cmd --set-default-zone=trusted  #// Change the default zone. trusted is all open
    - sudo firewall-cmd --reload  #// Reboot to apply settings

Install the Remote Development extension:

    VSCode >> Extension button(left) >> Remote Development

Remote Explorer icon(left):

    REMOTE EXPLORER: SSH Targets
    SSH TARGETS: + button
    Enter SSH Connection Command: ssh user1@192.168.0.100
    Select SSH configuration file to update:
        C:\Users\____\.ssh\config
    (If) changing the user name to log in or deleting the old target:
        Open and edit C:\Users\____\.ssh\config
    Push 192.168.0.100 ('s right folder) button:

A new Visual Studio Code window opens:

    (First time only) Select the guest OS type: Linux
    (First time only) Select continue for fingerprint:
    Enter the guest OS user password (twice):
        #// If you log in successfully, the server name will be displayed in green at the bottom left.
    Open the folder in guest operating system:
        Opened VSCode window >> File >> Open Folder >> /home/user1/Downloads/typrm-master/
    Enter the password of the guest OS user:

Restore the node_modules folder:

    VSCode >> Terminal >> New Terminal >> npm ci

To run the first test, press F5 key:


## (for developers) Test

There are the test using Jest and the test without Jest.
You can set the break point, click at the left of line number of the source file.

### Test using Jest

- Visual Studio Code >> Terminal >> New Terminal >> (1:__shell__ at the left of +) >> Create JavaScript Debug Terminal
- npm test
    - To debug a particular file, specify part of the file name. e.g. npm test main  #// Debug src/main.test.ts
- Restart the test:
    - Continue button:  #// Run to the end of program
    - Press `f` key in the terminal running `npm test`
- (When you finish,) Terminal tab (bottom) >> Recycle box icon (right)

### Test without Jest

- Visual Studio Code >> F5 key


## Tag list

- `#disable-tag-tool:` Disable tags on the same line
- `#expect:` Condition check
- `#file-template:` Template for checking the contents of a file
- `#file-template-any-lines:` Lines that do not check the contents of the file
- `#glossary:` Use the key in the child element as the keyword to be searched
- `#if:` Conditions for enabling tags
- `#keyword:` Search target keyword
- `#original:` Value before replacement
- `#ref:` Path of linked file
- `#search:` Keywords when searching for links
- `#(search)if:` Conditions for enabling search
- `#settings:` setting variables
- `#template:` Template for replacing the body
- `#template-at():` Template for replacing the body above two or more lines
- `#template-if:` Conditions that determine the content to be included in the text

The tags must be preceded by a space character or at the beginning of a line.

You can find more informations of tags by searching this page.
