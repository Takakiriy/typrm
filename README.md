# typrm

typrm replaces parameters of what you type manually from the keyboard you write in a text file.
It replaces the text that should be the same in the same way, resulting in fewer typos.
Also, there is a search function that is separated from the replace function.

[日本語 README](./README-jp.md)

<!-- TOC depthFrom:1 -->

- [typrm](#typrm)
  - [First example](#first-example)
  - [Install](#install)
    - [For Windows](#for-windows)
    - [For mac](#for-mac)
    - [For CentOS 7](#for-centos-7)
  - [settings tag and #template tag: replaces settings values](#settings-tag-and-template-tag-replaces-settings-values)
  - [#file-template tag: checks the contents of the file](#file-template-tag-checks-the-contents-of-the-file)
  - [#if tag: set conditions](#if-tag-set-conditions)
  - [#expect tag: checks settings values](#expect-tag-checks-settings-values)
  - [#keyword tag: highly accurate search](#keyword-tag-highly-accurate-search)
  - [How to build the development environment](#how-to-build-the-development-environment)
    - [For Windows](#for-windows-1)
    - [For mac](#for-mac-1)
    - [For Windows host OS and CentOS 7 guest OS](#for-windows-host-os-and-centos-7-guest-os)
  - [Test](#test)
    - [Test using Jest](#test-using-jest)
    - [Test without Jest](#test-without-jest)

<!-- /TOC -->


## First example

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

    settings:
        __Name__: work1
    shell:
        - mkdir work1  #template: __Name__
        - cd    work1  #template: __Name__

Write "variable_name: value" at `settings:` for the part you want to change to.
Write the `#template:` tag at the end of the same line as the part you want to change.
(You can write it on a separate line, it will be explained at the following section.)

Install typrm and
type the following `replace` command from bash or PowerShell. The short command name is `r`.

    cp  "typrm/example/new_folder.yaml"  "."  #// Temporary copy to change from the original file

    typrm replace  new_folder.yaml  4  "__Name__:work2"

You can drag and drop a file to enter the file without having to type it from the keyboard.

4 is an example of the line number. It is below the line where `settings:` is written,
and above the line where the next `settings:` is written.

new_folder.yaml file will be chaned to the following contents and you can copy and paste.
You can paste the text with the comment as it is,
because  # is treated as a comment in many shells.

    settings:
        __Name__: work2  #original: work1
    shell:
        - mkdir work2  #template: __Name__
        - cd    work2  #template: __Name__

It replaces `work1` in the settings and document body to `work2`.

`#original:` tag with the value before replacement is added to the same line.
If the `#original:` tag already exists, it will not be added.

To return to the value written in the `#original:` tag, use the revert command.
Also, the revert command removes the `#original:` tag.

    typrm revert  new_folder.yaml  4

4 is the line number, similar to the replace command.

When you enter multiple variable names: new variable values,
you can copy and paste multiple linees and enter them continuously.

    typrm replace  new_folder.yaml  4  "__Name1__: work1
        __Name2__: work2"


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
            cd  ${env:USERPROFILE}\Downloads
            Invoke-WebRequest  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip -OutFile typrm.zip
            rm -r -fo  "typrm-master"  #// When you are updating
            Expand-Archive -Path typrm.zip -DestinationPath "."
            cd  "typrm-master"

            npm install --only=production

    If you use PowerShell:
        Create a PS1 script file that launches typrm into the folder where PATH of PowerShell:
            Windows Start >> (Input) PowerShell :
                cd  ${env:USERPROFILE}\Downloads\typrm-master
                ${current_folder} = Convert-Path "."
                ${typrm_folder} = "${env:USERPROFILE}\Documents\typrm"
                ${script} = "${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\typrm.ps1"

                echo  "`${env:NODE_PATH} = `"${current_folder}\node_modules`"" > ${script}
                echo  "`${env:TYPRM_FOLDER} = `"${typrm_folder}`"" >> "${script}"
                echo  "node  ${current_folder}\build\typrm.js `$PsBoundParameters.Values `$args" >> ${script}

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
                cd  ${HOME}/Downloads/typrm-master
                current_folder="$(pwd)"
                typrm_folder="${HOME}/Documents/typrm"
                script="${HOME}/bin/typrm"
                mkdir -p "${HOME}/bin"

                echo  "export NODE_PATH=\"${HOME}/AppData/Roaming/npm/node_modules\"" > ${script}
                echo  "export TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
                echo  "node  ${current_folder}/build/typrm.js \"\$@\"" >> ${script}

    Check to use typrm command:
        Open new PowerShell or new Git bash:
            typrm --version

### For mac

    Install Node.js:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - Open the downloaded file (e.g. node-v14.16.0.pkg)
        - Installation options are defaults

    Download and expand typrm and install Node.js packages used by typrm:
        #// Launchpad >> Terminal
        cd  ~/Downloads
        setopt interactivecomments
            #// enables comment symbol (#)
        curl -o typrm.zip -kL https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip 
        rm -rf  typrm-old  &&  mv  typrm  typrm-old  #// When you are updating
        unzip -o typrm.zip
        mv  typrm-master  typrm  #// The folder extracted from the Zip file
        cd  typrm

        npm install --only=production

    Make the script file in the PATH folder to start typrm:
        cd typrm  #// The folder extracted from the Zip file
        script="$HOME/bin/typrm"
        rm -f "${script}"  #// When you are updating
        echo "export  NODE_PATH=$(pwd)/node_modules" >> "${script}"
        echo "export  TYPRM_FOLDER=$HOME/Documents/typrm" >> "${script}"
        echo "node  $(pwd)/build/typrm.js \"\$@\"" >> "${script}"
        chmod +x "${script}"
        unset script

    Check to use typrm command:
        typrm --version

### For CentOS 7

    Install Node.js:
        - https://nodejs.org/ja/download/ >> (click 64-bit at the right of) Linux Binaries (x64) >>
            Copy the link
        #// Case of version 14.16.0
        - cd ${HOME}
        - curl -L -O https://nodejs.org/dist/v14.16.0/node-v14.16.0-linux-x64.tar.xz
        - tar -Jxvf  node-v14.16.0-linux-x64.tar.xz
        - rm  node-v14.16.0-linux-x64.tar.xz
        - sudo mv  node-v14.16.0-linux-x64  /opt
        - cd /opt
        - sudo ln -s  node-v14.16.0-linux-x64  node
        - cd ${HOME}
        - PATH=/opt/node/bin:$PATH
        - node --version
        - echo 'export PATH="/opt/node/bin:$PATH"' >> ~/.bashrc

    If there is your machine in the LAN with the proxy in the company and so on:
        npm config -g set proxy "http://___.___.___.___:____"
        npm config -g set https-proxy "http://___.___.___.___:____"

    Download and expand typrm and install Node.js packages used by typrm:
        cd  ~/Downloads
        wget -O typrm.zip  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip
        rm -rf  typrm-old  &&  mv  typrm  typrm-old  #// When you are updating
        unzip -o typrm.zip
        mv  typrm-master  typrm  #// The folder extracted from the Zip file
        cd  typrm

        npm install --only=production

    Create a bash script file that launches typrm into the folder where PATH passed:
        cd  ${HOME}/Downloads/typrm
        typrm_folder="${HOME}/Documents/typrm"
        script="${HOME}/bin/typrm"
        mkdir -p "${HOME}/bin"

        echo  "export NODE_PATH=\"$(pwd)/node_modules\"" > ${script}
        echo  "export TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
        echo  "node  $(pwd)/build/typrm.js \"\$@\"" >> ${script}
        chmod +x "${script}"
        unset script

    Check to use typrm command:
        typrm --version

    (If you do not use) delete typrm:
        - rm ~/bin/typrm
        - rm ~/Downloads/typrm.zip
        - rm -rf ~/Downloads/typrm/


## settings tag and #template tag: replaces settings values

About the text you want to replace, write `variable name: value`
with deeper indentation below `settings:`.

    settings:
        __ProjectName__: react1
        __npxOption__: --template typescript

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

    settings:
        __ProjectName__: react1
    cd  "react1"  #template: "__ProjectName__"

The sample that match after replacement, when replacing `__ProjectName__` with react2:

    settings:
        __ProjectName__: react1
    cd  "react2"  #template: "__ProjectName__"

The sample that an error occurs, because `"react1"` is not matched:

    settings:
        __ProjectName__: react1
    cd  "react11"  #template: "__ProjectName__"

In the above case, if you do not enclose the value of the `#template:` tag in " ", the error will not occur, but if you can visually judge that it is correct, you do not need to enclose it.

    settings:
        __ProjectName__: react1
    cd  "react1"  #template: __ProjectName__

The details of the setting:

- You can indent any line deeper than another it, but it is not an object
- Variables for which no value is specified cannot be defined.
  Lines with only `variable name:` do not define any variables
- Variable names and values cannot contain #

Example:

    settings:
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

To check for a match without replacement,
use the `check` command. The short command name is `c`.

    typrm check __FileName__


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

    settings:
        __Stage__: develop
    a part of ./my.json:  #file-template: ./my.json
        "stage": "develop"  #template: "__Stage__"

`__Project__/my.json file`:

    {
        "stage": "develop"
    }

If you change the settings as below, an error will occur.

__Project__/root.yaml file:

    settings:
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
write the `#if:` tag inside the `settings:`.
You can set the value according to the conditions.

    settings:
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

`__SettingsName__` is the variable name written in `Settings:`.
`__EnvName__` is the name of the environment variable.
If no environment variable is defined, it will be "".
For example, the condition that it is Windows is written as follows
using the environment variable `windir`,
which is defined by default in Windows and not defined outside of Windows.

    #if: $env.windir != ""

If you write a `#if:` tag out of setting,
it will check whether the contents of the `#template:` tag and the
`#file-template:` tag match only when the conditions are met.

    settings:
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

    settings:
        __Write__: yes    #// yes or no
        __BackUp__: yes   #// yes or no
    write method:  #if: $settings.__Write__ == yes
        necessity: yes  #template: __Write__
        How to: Open the file and write
        Related: also back up  #expect: $settings.__BackUp__ == yes
    back up method:
        necessity: yes  #template: __BackUp__
        How to: Download Backup Tool


## #keyword tag: highly accurate search

The search function of typrm only searches for keywords written
after the `#keyword:` tag in a text file.
It makes to be reducer search noise than full text search.

Sample text file content:

    Shows all files:  #keyword: ls
    Example: ls -a sub_folder

typrm command:

    $ typrm ls
    .../text.txt:1: Shows all files:  #keyword: ls -a

In the case of the above example, the Example line will not be hit.
Because there is no `#keyword:` tag.
If you want to search for text that does not have the `#keyword:` tag,
use a common full-text search tool such as grep.

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

If specifying a search keyword consisting of multiple words,
it is not necessary to enclose it in " ".
Also, even if the case is different, it will be hit,
but the text with the same case will be displayed at the top.
In typrm, the text that hits the top is displayed at the bottom.

    $ typrm Comma Separated Value
    .../text.txt:1: #keyword: CSV, comma separated value

If you do not specify any keywords with the search command, search keyword input mode is started.
Press Ctrl + C to exit this mode.

    $ typrm s
    keyword: csv
    .../text.txt:1: #keyword: CSV, comma separated value
    keyword:

You can specify multiple keywords to be written
by CSV format (comma separated values) after the `#keyword:` tag
in the text file.

    #keyword: CSV, comma separated value, "a,b"

If you want to suppress the warning of the CSV part that has syntax problem,
write `#disable-tag-tool:`.

    #keyword: abc"   #disable-tag-tool:


## How to build the development environment

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


## Test

There are the test using Jest and the test without Jest.
You can set the break point, click at the left of line number of the source file.

### Test using Jest

- Visual Studio Code >> Terminal >> New Terminal >> (1:__shell__ at the left of +) >> Create JavaScript Debug Terminal
- npm test
- Restart the test:
    - Continue button:  #// Run to the end of program
    - Press `f` key in the terminal running `npm test`
- (When you finish,) Terminal tab (bottom) >> Recycle box icon (right)

### Test without Jest

- Visual Studio Code >> F5 key
