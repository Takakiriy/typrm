# typrm

typrm replaces the parameters of what you type manually from the keyboard you write in a text file.
It replaces the text that should be the same in the same way, resulting in fewer typos.

[日本語 README](./README-jp.md)


## Install

To use typrm, you must install Node.js.

For Windows:

    Download and expand typrm:
        - https://github.com/Takakiriy/typrm >> Code >> Download.ZIP

    Install Node.js:
        - https://nodejs.org/ja/download/ >> Windows Installer (.msi) >> 64-bit
        - Open the downloaded file (e.g. node-v14.16.0-x64.exe)
        - Installation options are defaults

    Install the commander package used by typrm:
        - Windows Start >> PowerShell
        - npm install -g  commander

    To start typrm, double click typrm.bat file in bin folder:

For mac:

    Download and expand typrm:
        - https://github.com/Takakiriy/typrm >> Code >> Download.ZIP

    Install Node.js:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - Open the downloaded file (e.g. node-v14.16.0.pkg)
        - Installation options are defaults

    Install the commander package used by typrm:
        - Launchpad >> Terminal
        - sudo npm install -g  commander

    Add execution attributes to "typrm.command" file:
        - (Continue in the Terminal)
        - cd bin  #// bin is written by drag and drop typrm bin folder into terminal
        - chmod +x typrm.command

    To start typrm, double click typrm.command file in bin folder:


## First example

Let's write the text file contains a command that generates a React project, such as:

example_1_react_manual.yaml

    Create a react project:
        settings:
            __ProjectName__: react1
            __npxOption__: --template typescript
        Create a react project:
            npx create-react-app --template typescript  "react1"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  "react1"  #template: __ProjectName__

You can easily run the written command by simply copying and pasting it,
but if the project name is not react1,
you must change the project name and then copy and paste it.
In the above case, two places have to be changed.

The typerm command assists in rewriting multiple parts.

For Windows, double click typrm.bat file and type:

    YAML UTF-8 file path> example_1_react_manual.yaml
    The line number to change the variable value > 5
    key: new_value> __ProjectName__: react2

You can drag and drop a file to enter the file without having to type it from the keyboard.

The line number is below the line where "Setting:" is written,
and if there are multiple settings, you can enter any line number
if it is above the line where the next "Setting:" is written.

example_1_react_manual.yaml file will be chaned to the following contents.

    Create a react project:
        settings:
            __ProjectName__: react2
            __npxOption__: --template typescript
        Create a react project:
            npx create-react-app --template typescript  "react2"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  "react2"  #template: __ProjectName__

Now you can easily run the npx and cd commands by simply copying and pasting them!

    npx create-react-app --template typescript  "react2"
    cd  "react2"

You can paste the text with the comment as it is. # is
treated as a comment in many shells.

When you enter multiple variable names: new variable values,
you can copy and paste multiple linees and enter them continuously.


## About settings tags and #template tags

About the text you want to replace, you must write "variable name: value" below "setting:".

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

The sample to match before replacing, when replacing a with react2:

    settings:
        __ProjectName__: react1
    cd  "react1"  #template: cd  "__ProjectName__"

The sample that match after replacement, when replacing a with react2:

    settings:
        __ProjectName__: react1
    cd  "react2"  #template: cd  "__ProjectName__"

The sample that an error occurs:

    settings:
        __ProjectName__: react1
    pushd  "react1"  #template: cd  "__ProjectName__"


## How to build the development environment for Windows

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

Double click "cmd menu.bat" and select "1. open_VisualStudioCode":

Press F5 key, then the test runs:


## How to build the development environment for mac

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

Add "cmd menu.command" file executable permission:

    - Double click "bin/chmod+x.command.zip" file
    - Right click at the expanded "chmod+x.command" file >> Open >> Open
    - Drag and drop "cmd menu.command" file to the opened window, push Enter key and close the window
    - Right click at "cmd menu.command" file >> Open >> Open
    - Close the opened window

Double click "cmd menu.command" file and select "1. open_VisualStudioCode":

To run the test, press fn + F5 key:
