# typrm

typrm replaces manual typing parameters.

[日本語 README](./README-jp.md)


## First example

The first example is a simple manual of creating a React project.

example_1_react_manual.yaml or .txt

    Create a react project:
        settings:
            __ProjectName__: react1
            __npxOption__: --template typescript
        Create a react project:
            npx create-react-app --template typescript  "react1"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  react1  #template: __ProjectName__

If you creates the project named with react2,
input the following typrm command.

    $ node typrm
    YAML UTF-8 file path> example_1_react_manual.yaml
    The line number to change the variable value > 5
    key: new_value> __ProjectName__: react2

example_1_react_manual.yaml or .txt file will be chaned to the following contents.

    Create a react project:
        settings:
            __ProjectName__: react2
            __npxOption__: --template typescript
        Create a react project:
            npx create-react-app --template typescript  "react2"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  react2  #template: __ProjectName__

You can create the React project by coping and pasting the following text only!

    npx create-react-app --template typescript  "react2"
    cd  react2

You can paste the text with the comment as it is. # is
treated as a comment in many shells.

    npx create-react-app --template typescript  "react2"
        #template: create-react-app __npxOption__  "__ProjectName__"
    cd  react2  #template: __ProjectName__
