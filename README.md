# typrm

typrm replaces the parameters of what you type manually from the keyboard you write in a text file.
It replaces the text that should be the same in the same way, resulting in fewer typos.

[日本語 README](./README-jp.md)

<!-- TOC depthFrom:1 -->

- [typrm](#typrm)
  - [First example](#first-example)
  - [Install](#install)
    - [For Windows](#for-windows)
    - [For mac](#for-mac)
    - [For CentOS 7](#for-centos-7)
  - [About settings tags and #template tags](#about-settings-tags-and-template-tags)
  - [How to build the development environment](#how-to-build-the-development-environment)
    - [For Windows](#for-windows-1)
    - [For mac](#for-mac-1)
    - [For Windows host OS and CentOS 7 guest OS](#for-windows-host-os-and-centos-7-guest-os)
  - [Test](#test)
    - [Test using Jest](#test-using-jest)
    - [Tst without Jest](#tst-without-jest)

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

The typrm command thus rewrites multiple parts at once so that you can copy and paste.

To enable typrm, make the file as follows:

new_folder.yaml

    settings:
        __Name__: work1
    shell:
        - mkdir work1  #template: __Name__
        - cd    work1  #template: __Name__

Write "variable_name: value" at `settings:` for the part you want to change to.
Write the #template: tag at the end of the same line as the part you want to change.
(You can write it on a separate line, it will be explained at the following section.)

For Windows, double click typrm.bat file and type:

    YAML UTF-8 file path> new_folder.yaml
    The line number to change the variable value > 4
    key: new_value> __Name__: work2

In bash case, type the following commands.

    cp  "typrm/example/new_folder.yaml"  "."  #// Temporary copy to change from the original file

    typrm replace  new_folder.yaml  4  "__Name__:work2"

You can drag and drop a file to enter the file without having to type it from the keyboard.

The line number is below the line where `settings:` is written,
and above the line where the next `settings:` is written.

new_folder.yaml file will be chaned to the following contents.

    settings:
        __Name__: work2
    shell:
        - mkdir work2  #template: __Name__
        - cd    work2  #template: __Name__

You can paste the text with the comment as it is. # is
treated as a comment in many shells.

When you enter multiple variable names: new variable values,
you can copy and paste multiple linees and enter them continuously.


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

    Install Node.js packages used by typrm:
        Windows Start >> (Input) PowerShell :
            cd  ${env:USERPROFILE}\Downloads
            Invoke-WebRequest  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip -OutFile typrm.zip
            rm -r -fo  "typrm-master"
            Expand-Archive -Path typrm.zip -DestinationPath "."
            cd  "typrm-master"

            npm install --only=production

    Create a PS1 script file that launches typrm into the folder where PATH of PowerShell:
        Windows Start >> (Input) PowerShell :
            cd  ${env:USERPROFILE}\Downloads\typrm-master
            ${current_folder} = Convert-Path "."
            ${typrm_folder} = "${env:USERPROFILE}\Documents\typrm"
            ${script} = "${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\typrm.ps1"

            echo  "`${env:NODE_PATH} = `"${env:USERPROFILE}\AppData\Roaming\npm\node_modules`"" > ${script}
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

    Download and expand typrm:
        - https://github.com/Takakiriy/typrm >> Code >> Download.ZIP

    Install Node.js:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - Open the downloaded file (e.g. node-v14.16.0.pkg)
        - Installation options are defaults

    Install Node.js packages used by typrm:
        #// Launchpad >> Terminal
        cd typrm  #// The folder extracted from the Zip file
        npm install --only=production

    Make the script file in the PATH folder to start typrm:
        cd typrm  #// The folder extracted from the Zip file
        OUT_="$HOME/bin/typrm"
        rm -f "${OUT_}"
        echo "export  NODE_PATH=$(pwd)/node_modules" >> "${OUT_}"
        echo "export  TYPRM_FOLDER=$HOME/Documents/typrm" >> "${OUT_}"
        echo "node  $(pwd)/build/typrm.js \$*" >> "${OUT_}"
        chmod +x "${OUT_}"
        unset OUT_

    Check to use typrm command:
        typrm --version


### For CentOS 7

    Download and expand typrm:
        - cd  ~/Downloads
        - wget -O typrm.zip  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip
        - unzip -o typrm.zip

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

    Install the commander package used by typrm:
        - npm install -g commander

    Add execution attributes to `typrm.sh` file and copy to to a directory in your PATH:
        - cd  typrm-master/bin
        - nano  typrm.sh : |  #// The case of changing install target
            node  ~/Downloads/typrm-master/build/typrm.js
        - chmod +x  typrm.sh
        - mkdir -p ~/bin
        - cp  typrm.sh  ~/bin/typrm

    Start typrm:
        - typrm

    (If you do not use) delete typrm:
        - rm ~/bin/typrm
        - rm ~/Downloads/typrm.zip
        - rm -rf ~/Downloads/typrm-master/


## About settings tags and #template tags

About the text you want to replace, you must write `variable name: value` below `settings:`.

    settings:
        __ProjectName__: react1
        __npxOption__: --template typescript

Also, write #template tag at the right of the same line as the text that replaces,
or write #template tag to the entire next line.

Sample to the right of the same line as the text to replace:

    cd  "react1"  #template: "__ProjectName__"

Sample next line of text to replace

    cd  "react1"
        #template: "__ProjectName__"

If you want to write #template tag in the lower line,
write how many line of text you want to replace with the parameters of the #template-at tag.

    cd  "react1"
    node
        #template-at(-2): "__ProjectName__"

The right of #template tag, you can write not only the variable name of the part you want to replace,
but also the text that you do not want to replace.

Replaces only when it matches the text that you replaced with the value before you replaced it.
It does nothing when it matches the text after replacing it.
If neither match is matched, an error occurs.

The sample to match before replacing, when replacing __ProjectName__ with react2:

    settings:
        __ProjectName__: react1
    cd  "react1"  #template: cd  "__ProjectName__"

The sample that match after replacement, when replacing __ProjectName__ with react2:

    settings:
        __ProjectName__: react1
    cd  "react2"  #template: cd  "__ProjectName__"

The sample that an error occurs:

    settings:
        __ProjectName__: react1
    pushd  "react1"  #template: cd  "__ProjectName__"


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

Test the `typrm_test_1.ts` file:

    - To set the break point, click at the left of line number of the source file
    - Press F5 key, then the test runs
    - (When you finish,) Terminal tab (bottom) >> Recycle box icon (right)

Test the `typrm.test.ts` file (Jest):

    - To set the break point, click at the left of line number of the source file
    - Start Jest watch mode:
        - Menu: Visual Studio Code >> Terminal >> New Terminal >> 1: (shell) >> Create JavaScript Debug Terminal
        npm test --watch
            #// If you end the debugger, press Ctrl + C and restart by `npm test --watch`
    - Restart the test:
        - Continue button:  #// Run to the end of program
        - Press `f` key in the terminal running `npm test --watch`
    - (When you finish,) Terminal tab (bottom) >> Recycle box icon (right)


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

To run the test, press fn + F5 key:


### For Windows host OS and CentOS 7 guest OS

Install typrm

    See above

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

To run the test, press F5 key:


## Test

There are the test using Jest and the test without Jest.

### Test using Jest

- Visual Studio Code >> New Terminal >> Terminal >> (1:__shell__ at the left of +) >> Create JavaScript Debug Terminal
- npm test

### Tst without Jest

- Visual Studio Code >> F5 key
