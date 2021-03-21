# typrm

typrm は テキスト ファイル に書いたキーボードから手動で入力する内容のパラメーターを置き換えます。
同じ内容にすべきテキストを同じように置き換えるため、入力ミスが少なくなります。


## インストール

typrm を使うには Node.js のインストールが必要です。

Windows の場合

    typrm をダウンロードして展開します:
        - https://github.com/Takakiriy/typrm >> Code >> Download.ZIP

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> Windows Installer (.msi) >> 64-bit
        - ダウンロードしたファイル（例：node-v14.16.0-x64.exe）を開きます
        - インストール オプションはデフォルトを使用

    typrm が使う commander パッケージをインストールします:
        - Windows スタート >> PowerShell
        - npm install -g  commander

    typrm.bat ファイルをダブルクリックすると typrm が起動します:

mac の場合

    typrm をダウンロードして展開します:
        - https://github.com/Takakiriy/typrm >> Code >> Download.ZIP

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - ダウンロードしたファイル（例：node-v14.16.0.pkg）を開きます
        - インストール オプションはデフォルトを使用

    typrm が使う commander パッケージをインストールします:
        - Launchpad >> Terminal
        - sudo npm install -g  commander

    typrm.command ファイルに実行属性を追加します:
        - chmod +x typrm.command

    typrm.command ファイルをダブルクリックすると typrm が起動します:


## 最初のサンプル

テキスト ファイル に下記のような React のプロジェクトを生成するコマンドが書いてあるとします。

example_1_react_manual.yaml

    Create a react project:
        設定:
            __ProjectName__: react1
            __npxOption__: --template typescript
        React のプロジェクトを生成します:
            npx create-react-app --template typescript  "react1"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  "react1"  #template: __ProjectName__

書かれているコマンドはコピー＆ペーストするだけで簡単に実行することができますが、
プロジェクト名が react1 ではないときは、プロジェクト名を変えてから
コピー＆ペーストできます。 上記の場合、2箇所を変えなければなりません。

このように複数の箇所を書き換えることを支援するのが typerm コマンドです。

Windows の場合、typrm.bat をダブルクリックして、下記のように入力します。

    YAML UTF-8 ファイル パス> example_1_react_manual.yaml
    変更する変数値がある行番号 > 5
    変数名: 新しい変数値> __ProjectName__: react2

ファイル パス は、キーボードから入力しなくても、
ファイルをドラッグ＆ドロップして入力できます。
行番号は「設定:」が書いてある行より下、
設定が複数あるときは、次の「設定:」が書いてある行より上であれば、
どの行番号を入力しても構いません。 

example_1_react_manual.yaml ファイルは次のような内容に変わります。

    Create a react project:
        設定:
            __ProjectName__: react2
            __npxOption__: --template typescript
        React のプロジェクトを生成します:
            npx create-react-app --template typescript  "react2"
                #template: create-react-app __npxOption__  "__ProjectName__"
            cd  "react2"  #template: __ProjectName__

これで、npx コマンドと cd コマンドをコピー＆ペーストするだけで簡単に実行することができます！

    npx create-react-app --template typescript  "react2"
    cd  "react2"

コメントの付いたテキストをそのまま貼り付けることができます。 # は
多くのシェルでコメントとして扱われます。

「変数名: 新しい変数値」を複数入力するときは、
複数行をコピー＆ペーストして連続入力することができます。


## 設定タグと #template タグについて

置き換えるテキストは、設定: が書かれた行の下に 変数名: 値 を書きます。

    設定:
        __ProjectName__: react1
        __npxOption__: --template typescript

また、#template タグを置き換えるテキストと同じ行の右、または、次の行全体に書きます。

置き換えるテキストと同じ行の右のサンプル：

    cd  "react1"  #template: "__ProjectName__"

置き換えるテキストの次の行のサンプル：

    cd  "react1"
        #template: "__ProjectName__"

もっと下の行に書くときは、#template-at タグのパラメーターに
何行上のテキストを置き換えるのかを書きます。

    cd  "react1"
    node
        #template-at(-2): "__ProjectName__"

#template タグの右には、置き換える部分の変数名だけでなく、
その前後にある置き換えないテキストを書くことができます。

置き換える前の値に置き換えたテキストにマッチしたときだけ、置き換えます。
置き換える後のテキストにマッチしたときは何もしません。
そのどちらにもマッチしなかったときは、エラーになります。

__ProjectName__ を react2 に置き換えるときに、置き換える前にマッチするサンプル:

    設定:
        __ProjectName__: react1
    cd  "react1"  #template: cd  "__ProjectName__"

__ProjectName__ を react2 に置き換えるときに、置き換えた後にマッチするサンプル:

    設定:
        __ProjectName__: react1
    cd  "react2"  #template: cd  "__ProjectName__"

エラーになるサンプル:

    設定:
        __ProjectName__: react1
    pushd  "react1"  #template: cd  "__ProjectName__"

