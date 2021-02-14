# typrm

typrm はキーボードから手動で入力する内容のパラメーターを置き換えます。


## 最初のサンプル

最初のサンプルとして React のプロジェクトを生成するシンプルなマニュアルを使います。

example_1_react_manual.yaml or .txt

    Create a react project:
        設定:
            __ProjectName__: react1
            __npxOption__: --template typescript
        React のプロジェクトを生成します:
            npx create-react-app --template typescript  "react1"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  react1  #template: __ProjectName__

もし React2 という名前のプロジェクトを作る場合、
次の typrm コマンドを入力します。

    $ node typrm
    YAML UTF-8 ファイル パス> example_1_react_manual.yaml
    変更する変数値がある行番号 > 5
    変数名: 新しい変数値> __ProjectName__: react2

example_1_react_manual.yaml or .txt ファイルは次のような内容に変わります。

    Create a react project:
        設定:
            __ProjectName__: react2
            __npxOption__: --template typescript
        React のプロジェクトを生成します:
            npx create-react-app --template typescript  "react2"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  react2  #template: __ProjectName__

次のテキストをコピー＆ペーストするだけで
新しい React プロジェクトを作ることができます！

    npx create-react-app --template typescript  "react2"
    cd  react2

コメントの付いたテキストをそのまま貼り付けることができます。 # は
多くのシェルでコメントとして扱われます。

    npx create-react-app --template typescript  "react2"
        #template: create-react-app __npxOption__  "__ProjectName__"
    cd  react2  #template: __ProjectName__
