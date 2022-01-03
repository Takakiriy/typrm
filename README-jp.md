# typrm
<!-- Character Encoding: "WHITE SQUARE" U+25A1 is □. -->

typrm は テキスト ファイル 形式のマニュアルに書かれたコマンドのパラメーターを
状況に応じて置き換えて、コピー＆ペーストだけでコマンドを実行できるようにします。

また、typrm にはキーワードタグを使った強力な検索機能もあります。

<!-- TOC depthFrom:1 -->

- [typrm](#typrm)
  - [最初のサンプル - replace コマンド, reset コマンド](#最初のサンプル---replace-コマンド-reset-コマンド)
    - [#to タグを使って置き換えます](#to-タグを使って置き換えます)
  - [強力な検索機能 - #keyword タグや #glossary タグを使って精度よく検索します](#強力な検索機能---keyword-タグや-glossary-タグを使って精度よく検索します)
  - [インストール](#インストール)
    - [Windows の場合](#windows-の場合)
    - [mac の場合](#mac-の場合)
    - [CentOS 7 の場合](#centos-7-の場合)
  - [設定タグと #template タグを使って設定値を置き換えます](#設定タグと-template-タグを使って設定値を置き換えます)
    - [設定の詳細](#設定の詳細)
    - [設定名](#設定名)
    - [#template-if タグ - 条件を満たしているかどうかの記号を置き換えます](#template-if-タグ---条件を満たしているかどうかの記号を置き換えます)
  - [check コマンド - 置き換えることができることをテストします](#check-コマンド---置き換えることができることをテストします)
  - [mutual-search コマンド - リンク元も含めて検索して、リンク関係を維持します](#mutual-search-コマンド---リンク元も含めて検索してリンク関係を維持します)
  - [where コマンド - 設定値（変数）の定義を探します](#where-コマンド---設定値変数の定義を探します)
  - [#file-template タグを使ってファイルの内容をチェックします](#file-template-タグを使ってファイルの内容をチェックします)
  - [#if タグを使って条件を設定します](#if-タグを使って条件を設定します)
  - [#expect タグを使って設定値をチェックします](#expect-タグを使って設定値をチェックします)
  - [#ref タグ - 環境変数を含むファイルのパスを展開して表示します](#ref-タグ---環境変数を含むファイルのパスを展開して表示します)
    - [ファイルに関連するコマンドを実行します](#ファイルに関連するコマンドを実行します)
    - [ファイルの行番号に置き換えて表示します](#ファイルの行番号に置き換えて表示します)
  - [（開発者用） 開発環境の構築手順](#開発者用-開発環境の構築手順)
    - [Windows の場合](#windows-の場合-1)
    - [mac の場合](#mac-の場合-1)
    - [ホストOSが Windows、ゲストOSが CentOS 7 の場合](#ホストosが-windowsゲストosが-centos-7-の場合)
  - [（開発者用） テスト](#開発者用-テスト)
    - [Jest を使うテスト](#jest-を使うテスト)
    - [Jest を使わないテスト](#jest-を使わないテスト)
  - [タグ一覧](#タグ一覧)

<!-- /TOC -->


## 最初のサンプル - replace コマンド, reset コマンド

新しいフォルダーを作成してその中でシェルのコマンドを実行することを指示するマニュアルには、
以下のようにシェルに入力するように書かれているでしょう。

    mkdir work1
    cd    work1

これをコピー＆ペーストすれば簡単に実行することができます。

しかし、work1 フォルダーがすでに存在していて削除したくないときは、
以下のようにシェルに入力するでしょう。

    mkdir work2
    cd    work2

この場合、マニュアルからコピー＆ペーストできません。
なぜなら、マニュアルには `work1` と書かれているからです。

typrm コマンドはこのように複数の箇所を一度に書き換えて、
コピー＆ペーストできるようにします。

typrm が使えるようにするには、ファイルを以下のようにします。

new_folder.yaml

    設定:
        __Name__: work1
    shell:
        - mkdir work1  #template: __Name__
        - cd    work1  #template: __Name__

`設定:` に変更する部分に関する 変数名: 値 を書きます。
変更する部分と同じ行の末尾に `#template:` タグを書きます。
（後で説明しますが、別の行に書くこともできます）

typrm をインストールして、
bash や PowerShell から以下のように `replace` コマンドを入力します。短いコマンド名は `r` です。

    cp  "typrm/example/new_folder.yaml"  "."  #// 変更するので一時的にコピーします

    typrm replace  new_folder.yaml  4  "__Name__:work2"

ファイル パス は、キーボードから入力しなくても、
ファイルをドラッグ＆ドロップして入力できます。

4 は行番号の例です。`設定:` が書いてある行、またはそれより下、
または次の `設定:` が書いてある行より上であれば、
どの行番号を入力しても構いません。
ファイルの中に `設定:` が 1つだけのときは行番号を省略できます。
行番号の代わりに設定名を指定する方法は後で説明します。

new_folder.yaml ファイルは次のような内容に変わり、コピー＆ペーストできるようになります。
コメントの付いたテキストはそのまま貼り付けることができます。# は
多くのシェルでコメントとして扱われるからです。

    設定:
        __Name__: work2  #original: work1
    shell:
        - mkdir work2  #template: __Name__
        - cd    work2  #template: __Name__

設定の `work1` と本文の `work1` が、`work2` に置き換わります。

置き換える前の値が書かれた `#original:` タグが同じ行に追加されます。
`#original:` タグがすでにあるときは追加されません。

`#original:` タグに書かれた値に戻すときは、reset コマンドを使います。
また、reset コマンドを使うと `#original:` タグは削除されます。

    typrm reset  new_folder.yaml  4

4 は　replace コマンドと同様に、行番号です。
設定名を指定することもできます。

「変数名: 新しい変数値」を複数入力するときは、
複数行をコピー＆ペーストして連続入力することができます。

    typrm replace  new_folder.yaml  4  "__Name1__: work1
        __Name2__: work2"

### #to タグを使って置き換えます

`#to:` タグを書くと、replace コマンドのパラメーターを省略して
置き換えることができます。

設定に `#to:` タグを書くときは、変数の名前と値が書かれた行の値より右に
`#to:` と置き換えた後の値を書きます。

`#to:` タグを追加する前のサンプル:

    設定:
        __Name__: workA1
        __Name__: workB1  #// comment
        __Name__: workC1  #// comment

`#to:` タグを追加した後のサンプル:

    設定:
        __Name__: workA1  #to: workA2
        __Name__: workB1  #to: workB2  #// comment
        __Name__: workC1  #// comment  #to: workC2

タグを追加したらファイルを保存してください。

入力するコマンド:

    typrm replace

コマンド実行後の内容:

    設定:
        __Name__: workA2  #original: workA1
        __Name__: workB2  #original: workB1  #// comment
        __Name__: workC2  #original: workC1  #// comment

本文に `#to:` タグを書くときは、
`#template:` タグの右に `#to:` タグと置き換えた後の値を書きます。
または、対象の `#template:` タグの行から、次の `#template:` タグの行の間に、
`#to:` タグだけの行を追加します。

    設定:
        __NameA__: workA1
        __NameB__: workB1
    shell:
        - mkdir workA1  #template: __NameA__  #to: workA2
        - cd    workB1  #template: __NameB__
                                #to: workB2

`#template-at:` タグについても同様に `#to:` タグを書くことができます。
`#to:` タグだけの行を追加すると、
`#template-at:` タグが示す行の位置（例：-2 = 2行前）が正しくなくなりますが、
`#to:` タグだけの行がないものとして処理するため、行の位置を修正する必要はありません。

`#to:` タグを追加する前のサンプル:

    - mkdir workA1
    - cd    workB1
        #template-at(-2): __NameA__
        #template-at(-2): __NameB__

`#to:` タグを追加した後のサンプル:

    - mkdir workA1
    - cd    workB1
        #template-at(-2): __NameA__
            #to: workA2
        #template-at(-2): __NameB__
            #to: workB2

複数の変数があるときは、`#to:` タグに CSV 形式で書くか、
テンプレートを置き換えた後の内容を書きます。

    (workA1, workB1)  #template: (__NameA__ : __NameB__)  #to: workA2, workB2

または

    (workA1, workB1)  #template: (__NameA__ : __NameB__)  #to: (workA2 : workB2)

`#to:` タグの代わりに `#to-test:` タグを書くと、
置き換えた後の変数の値がどうなるかをテストすることができます。
`#to-test:` タグがあるファイルは、内容の置き換えをしません。
ただし、1回の replace コマンドで
`#to-test:` タグがあるファイルが置き換えられず、
同時に `#to-test:` タグがない別のファイルが置き換えられることはあります。

    (workA1, workB1)  #template: (__NameA__ : __NameB__)  #to-test: workA2, workB2
    (workC1, workD1)  #template: (__NameC__ : __NameD__)  #to-test: (workC2 : workD2)

テストの結果の表示の例:

    Verbose:     /____/____.yaml:1:
    Verbose:         template: (__NameA__ : __NameB__)    ... #template: タグの内容
    Verbose:         templatePattern: (* : *)             ... #template: タグの内容から変数の部分を * に置き換えた内容
    Verbose:         toValue: workA2, workB2              ... #to-test: タグの内容
    Verbose:         toValueIsMatchedWithTemplate: false  ... false = #to-test: タグの値を CSV として解釈します
    Verbose:         __NameA__: workA2                    ... #to: タグによって置き換えれられる変数の名前と置き換えた後の値
    Verbose:         __NameB__: workB2
    Verbose:     /____/____.yaml:2:
    Verbose:         template: (__NameC__ : __NameD__)
    Verbose:         templatePattern: (* : *)
    Verbose:         toValue: (workC2 : workD2)
    Verbose:         toValueIsMatchedWithTemplate: true  ... true = #to-test: タグの値をテンプレートを置き換えた後の内容として解釈します
    Verbose:         __NameC__: workC2
    Verbose:         __NameD__: workD2

typrm replace コマンドを実行すると、すべてのファイルにある `#to:` タグに従って
ファイルの内容を置き換えます。 すべてのファイルとは、
`TYPRM_FOLDER` 環境変数、または `--folder` オプションに指定した
フォルダーに入っているファイルです。
ファイル名を指定すると、指定したファイルにある `#to:` タグを処理します。

    typrm r
    typrm replace
    typrm replace  --folder my_folder
    typrm r  __FileName__


## 強力な検索機能 - #keyword タグや #glossary タグを使って精度よく検索します

typrm の検索機能は、全文検索(grep)よりも、精度よく検索します。

`#keyword:` タグにキーワードを書きます。

テキスト ファイル の内容のサンプル:

    Shows all files:  #keyword: ls
    Example: ls -a sub_folder

typrm コマンド:

    $ typrm ls
    .../text.txt:1: Shows all files:  #keyword: ls

上記の場合、`#keyword:` タグがある行の `ls` が見つかります。
ターミナルによっては表示されたパスと行番号をクリックするとファイルの内容にジャンプします。
しかし、Example の行の ls にはヒットしません。
なぜなら `#keyword:` タグがないからです。 `#keyword:` タグがないテキストを
検索するときは、grep など一般的な全文検索ツールを使ってください。

`TYPRM_FOLDER` 環境変数、または `--folder` オプションに
検索対象のファイルが入っているフォルダーのパスを指定します。

PowerShell で環境変数を設定する場合:

    ${env:TYPRM_FOLDER} = "${env:USERPROFILE}\Documents\typrm"
    typrm ls

`--folder` オプションに指定する場合:

    typrm --folder "${env:USERPROFILE}\Documents\typrm"  ls

`TYPRM_FOLDER` 環境変数の値は CSV 形式です。
複数のフォルダーのパスを指定することができます。
ファイル名のワイルドカードを指定することもできます。
ファイルを指定することもできます。

    ${env:TYPRM_FOLDER} = "${env:USERPROFILE}\Documents\typrm, ${env:USERPROFILE}\Files\*.yaml"

コロンまでをキーワードにするときは、`#keyword:` タグのパラメーターを省略できます。
下記の場合、検索できるキーワードは ls です。

    ls:  #keyword:

行頭にハイフンがあるときは、キーワードにハイフンを含みません。
下記の場合、検索できるキーワードは ls です。

    - ls:  #keyword:

typrm search コマンドのコマンド名（search）は省略できます。
search コマンドの短いコマンド名は s です。

typrm search コマンドの書式:

    typrm __Keyword__

または

    typrm search __Keyword__

または

    typrm s __Keyword__

検索キーワードが typrm のコマンド名と同じときは、
コマンド名（search または s）を省略できません。

検索キーワードに `#keyword:` または `#search:` を入力しても無視されます。

search コマンドにキーワードを指定しないと、検索キーワード入力モードになります。
このモードを終了するには、Ctrl+C キーを押します。

    $ typrm
    keyword: csv
    .../text.txt:1: #keyword: CSV, comma separated values
    keyword:

Visual Studio Code のターミナルで実行した場合、見つかった場所（パス）を
Ctrl キーを押しながらクリックすると開くことができます。

検索した後で # と数字（例：#1）を入力すると、
`TYPRM_OPEN_DOCUMENT` 環境変数に設定したコマンドを実行します。
入力する数字は検索結果の下から数えた番号です。
環境変数の値の `${ref}` の部分はフルパスに置き換わります。

bash

    $ export TYPRM_OPEN_DOCUMENT="code -g \"\${ref}\""
    $ typrm
    keyword: csv
    /home/user1/text.txt:1: #keyword: CSV, comma separated values
    keyword: #1

実行されるコマンド

    code -g "/home/user1/text.txt:1"

検索キーワード入力モードで何も見つからなかったときは、
Enter キーを押すことで全文検索ができます。
その全文検索では、大文字小文字を区別しません。また、単語単位検索はできません。

    $ typrm s
    keyword: game
    見つかりません。全文検索するときは Enter キーを押してください。
    keyword:
    .../text.txt:1: Game:
    keyword:

複数の単語からなる検索キーワードを指定するときでも、" " で囲む必要はありません。
複数の単語を指定すると AND 検索になります。
単語数を増やすと絞り込めます。単語数を減らすと関連する内容もヒットします。
OR 検索はできません。何度か検索してください。

    $ typrm Comma Separated Value
    .../text.txt:1: #keyword: CSV, comma separated values

大文字小文字が違っていてもヒットしますが、
大文字小文字が同じテキストが上位に表示されます。
typrm では上位にヒットしたテキストが下側に表示されます。

下記のうち、上に書かれた違いほど検索スコアを大きく落とします。
- 語数の違い
- 文字数の違い
- 大文字小文字の違い

テキスト ファイルに書くキーワードは、
`#keyword:` タグに続けて CSV 形式（コンマ区切り）で
複数指定することができます。

    #keyword: CSV, comma separated values, "a,b"

` #`（空白と#）を含むキーワードを指定するときは、`"%20"#` と書いてください。
` #`（空白と#）は次のタグとして解釈されます。
`"%` を含むキーワードを指定するときは、`""%25"` と書いてください。
CSV の部分に文法の問題があるときに表示される警告を抑制するには、
`#disable-tag-tool:` を書いてください。
`#keyword:` タグとして処理されなくなります。

    #keyword: abc"   #disable-tag-tool:

`#(search)if: false` タグがある行の次の行から
インデントが同じ深さの行の前までの、
`#keyword:` タグと　`#glossary:` タグは検索対象外になります。

    copy:  #(search)if: false
        #keyword: abc  #// 検索対象外です
        #keyword: def  #// 検索対象外です
    original:
        #keyword: abc  #// 検索対象です

`#glossary:` （用語）タグを付けると、`#glossary:` タグを付けた行のインデントより
1段深いインデントの行に書かれたコロンまでの部分が検索対象のキーワードになります。

    用語:  #glossary:
        CSV: comma separated values
        SSV: space separated values
        #comment: ここは検索されません

上記の場合、CSV と SSV を検索できるようになります。
2段以上深いインデントの行は対象外ですが、
深い位置にも `#glossary:` タグを書けば対象になります。

`#glossary:` タグにパラメーターをつけると、
パラメーターとラベルからなるキーフレーズが検索対象になり、
組み合わせ検索ができるようになります。

    C++ 用語:  #glossary: C++
        TLS: Thread Local Storage. スレッドごとに存在するメモリー領域

    セキュリティ用語:  #glossary: security
        TLS: Transport Layer Security. SSL の次のバージョン

上記の場合、TLS で検索すると両方とも見つかります。
C++ TLS で検索すると C++ 用語の TLS だけが見つかります。

`--thesaurus` オプション、または TYPRM_THESAURUS 環境変数に、
シソーラス ファイル のパスを指定することができます。
シソーラス ファイル は、CSV 形式です。
シソーラスは、同義語だけ指定できます。

    $ TYPRM_THESAURUS=/home/user1/Document/thesaurus.csv  typrm s js
    .../script.yaml:1: #keyword: JavaScript

thesaurus.csv のサンプル:

    JavaScript, js
    document, doc
    source, src
    destination, dst, dest
    string, 文字列


## インストール

typrm を使うには Node.js のインストールが必要です。

### Windows の場合

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> Windows Installer (.msi) >> 64-bit
        - ダウンロードしたファイル（例：node-v14.16.0-x64.exe）を開きます
        - インストール オプションはデフォルトを使用

    社内など、プロキシがある LAN に Windows がある場合:
        Windows スタート >> PowerShell（と入力）:
            npm config -g set proxy "http://___.___.___.___:____"
            npm config -g set https-proxy "http://___.___.___.___:____"

    typrm をダウンロードして展開し、typrm が使う Node.js パッケージをインストールします:
        Windows スタート >> PowerShell（と入力）:
            cd  ${env:USERPROFILE}\Downloads
            Invoke-WebRequest  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip -OutFile typrm.zip
            rm -r -fo  "typrm-master"  #// 更新するとき
            Expand-Archive -Path typrm.zip -DestinationPath "."
            cd  "typrm-master"

            npm install --only=production

    PowerShell を使う場合:
        PowerShell の PATH が通ったフォルダーに typrm を起動する PS1 スクリプト ファイル を作ります:
            Windows スタート >> PowerShell（と入力） :
                cd  ${env:USERPROFILE}\Downloads\typrm-master
                ${current_folder} = Convert-Path "."
                ${typrm_folder} = "${env:USERPROFILE}\Documents\typrm"
                ${script} = "${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\typrm.ps1"

                echo  "`${env:NODE_PATH} = `"${current_folder}\node_modules`"" > ${script}
                echo  "`${env:TYPRM_FOLDER} = `"${typrm_folder}`"" >> "${script}"
                echo  "`${env:TYPRM_OPEN_DOCUMENT} = `"code -g `"`"`${ref}`"" >> "${script}"
                echo  "" > ${script}

                echo  "node --experimental-modules --es-module-specifier-resolution=node  ${current_folder}\build\typrm.js `$PsBoundParameters.Values `$args" >> ${script}

                Set-ExecutionPolicy  RemoteSigned  -Scope CurrentUser  #// スクリプトを実行できるようにします

    Git bash を使う場合:
        Git for Windows をインストールします:
            - https://git-scm.com/ >> Downloads >> Windows
            - ダウンロードしたファイル（例：Git-2.31.1-64-bit.exe）を開く
            - Next を8回押す
            - Configuring the line ending conversions: Checkout as-is, commit as-is
            - 他のインストール オプションはデフォルトを使用
        PATH が通ったフォルダーに typrm を起動する bash スクリプト ファイル を作ります:
            フォルダーを右クリック >> Git bash :
                cd  ${HOME}/Downloads/typrm-master
                current_folder="$(pwd)"
                typrm_folder="${HOME}/Documents/typrm"
                script="${HOME}/bin/typrm"
                mkdir -p "${HOME}/bin"

                echo  "export  NODE_PATH=\"${HOME}/AppData/Roaming/npm/node_modules\"" > ${script}
                echo  "export  TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
                echo  "export  TYPRM_OPEN_DOCUMENT=\"code -g \\\"\\${ref}\\\"" >> "${script}"
                echo  "" >> "${script}"

                echo  "node --experimental-modules --es-module-specifier-resolution=node  ${current_folder}/build/typrm.js \"\$@\"" >> ${script}

    typrm が使えることを確認します:
        PowerShell または Git bash を新しく開いて:
            typrm --version

    必要に応じて環境変数 TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER を設定します

### mac の場合

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - ダウンロードしたファイル（例：node-v14.16.0.pkg）を開きます
        - インストール オプションはデフォルトを使用

    typrm をダウンロードして展開し、typrm が使う Node.js パッケージをインストールします:
        #// Launchpad >> Terminal
        cd  ~/Downloads
        setopt interactivecomments
            #// enables comment symbol (#)
        curl -o typrm.zip -kL https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip 
        rm -rf  typrm-old  &&  mv  typrm  typrm-old  #// 更新するとき
        unzip -o typrm.zip
        mv  typrm-master  typrm  #// Zip ファイルを展開したフォルダー
        cd  typrm

        npm install --only=production

    PATH が通ったフォルダーに typrm を起動する スクリプト ファイル を作ります:
        cd typrm  #// Zip ファイルを展開したフォルダー
        typrm_folder="${HOME}/Documents/typrm"
        script="$HOME/bin/typrm"
        rm -f  "${script}"  #// 更新するとき

        echo  "export  NODE_PATH=\"$(pwd)/node_modules\"" >> "${script}"
        echo  "export  TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
        echo  "export  TYPRM_OPEN_DOCUMENT=\"code -g \\\"\\${ref}\\\"" >> "${script}"
        echo  "" >> "${script}"
        echo  "node --experimental-modules --es-module-specifier-resolution=node  $(pwd)/build/typrm.js \"\$@\"" >> "${script}"
        chmod +x  "${script}"
        unset script
        mkdir -p  "${HOME}/Documents/typrm"

    typrm が使えることを確認します:
        typrm --version

    必要に応じて環境変数 TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER を設定します

### CentOS 7 の場合

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> (click 64-bit at the right of) Linux Binaries (x64) >>
            Copy the link
        #// Case of version 14.17.6
        - cd ${HOME}
        - curl -L -O https://nodejs.org/dist/v14.17.6/node-v14.17.6-linux-x64.tar.xz
        - tar -Jxvf  node-v14.17.6-linux-x64.tar.xz
        - rm  node-v14.17.6-linux-x64.tar.xz
        - sudo mv  node-v14.17.6-linux-x64  /opt
        - cd /opt
        - sudo ln -s  node-v14.17.6-linux-x64  node
        - cd ${HOME}
        - PATH=/opt/node/bin:$PATH
        - node --version
        - echo 'export PATH="/opt/node/bin:$PATH"' >> ~/.bashrc

    社内など、プロキシがある LAN にある場合:
        npm config -g set proxy "http://___.___.___.___:____"
        npm config -g set https-proxy "http://___.___.___.___:____"

    typrm をダウンロードして展開し、typrm が使う Node.js パッケージをインストールします:
        sudo yum install unzip  #// unzip が使えないとき
        mkdir -p ~/Downloads
        cd  ~/Downloads
        curl -L -O https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip
        mv  master.zip  typrm.zip
        rm -rf  typrm-old  &&  mv  typrm  typrm-old  #// 更新するとき
        unzip -o typrm.zip
        mv  typrm-master  typrm  #// Zip ファイルを展開したフォルダー
        cd  typrm

        npm install --only=production

    PATH が通ったフォルダーに typrm を起動する bash スクリプト ファイル を作ります:
        cd  ${HOME}/Downloads/typrm
        typrm_folder="${HOME}/Documents/typrm"
        script="${HOME}/bin/typrm"
        mkdir -p "${HOME}/bin"

        echo  "export  NODE_PATH=\"$(pwd)/node_modules\"" >> "${script}"
        echo  "export  TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
        echo  "export  TYPRM_OPEN_DOCUMENT=\"code -g \\\"\\${ref}\\\"" >> "${script}"
        echo  "" >> "${script}"
        echo  "node --experimental-modules --es-module-specifier-resolution=node  $(pwd)/build/typrm.js \"\$@\"" >> ${script}
        chmod +x  "${script}"
        unset script
        mkdir -p  "${HOME}/Documents/typrm"

    typrm が使えることを確認します:
        typrm --version

    必要に応じて環境変数 TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER を設定します

    （使わなくなったら）typrm を削除します:
        - rm ~/bin/typrm
        - rm ~/Downloads/typrm.zip
        - rm -rf ~/Downloads/typrm/


## 設定タグと #template タグを使って設定値を置き換えます

置き換えるテキストは、`設定:` または `setting:` が書かれた行の下に、
インデントを深くして `変数名: 値` を書きます。

    設定:
        __ProjectName__: react1
        __npxOption__: --template typescript

また、`#template:` タグを置き換えるテキストと同じ行の右、または、次の行全体に書きます。

置き換えるテキストと同じ行の右のサンプル：

    cd  "react1"  #template: "__ProjectName__"

置き換えるテキストの次の行のサンプル：

    cd  "react1"
        #template: "__ProjectName__"

もっと下の行に書くときは、`#template-at:` タグのパラメーターに
何行上のテキストを置き換えるのかを書きます。

    cd  "react1"
    node
        #template-at(-2): "__ProjectName__"

`#template:` タグの右には、置き換える部分の変数名だけでなく、
その前後にある置き換えないテキストを書くことができます。
上記の場合、" " が置き換えないテキストです。

置き換える前の値に置き換えたテキストにマッチしたときだけ、置き換えます。
置き換える後のテキストにマッチしたときは何もしません。
そのどちらにもマッチしなかったときは、エラーになります。

`__ProjectName__` を react2 に置き換えるときに、置き換える前にマッチするサンプル:

    設定:
        __ProjectName__: react1
    cd  "react1"  #template: "__ProjectName__"

`__ProjectName__` を react2 に置き換えるときに、置き換えた後にマッチするサンプル:

    設定:
        __ProjectName__: react1
    cd  "react2"  #template: "__ProjectName__"

`"react1"` にマッチしないために、エラーになるサンプル:

    設定:
        __ProjectName__: react1
    cd  "react11"  #template: "__ProjectName__"

なお、上記の場合、`#template:` タグの値を " " で囲まないとエラーになりませんが、目視で正しいと判断できれば囲む必要はありません。

    設定:
        __ProjectName__: react1
    cd  "react1"  #template: __ProjectName__

` #`（空白と#）は次のタグまたはコメントとして解釈されます。
テンプレートに ` #`（空白と#）を含める時は、`"%20"#` と書いてください。
`"%` を含むテンプレートを指定するときは、`""%25"` と書いてください。

    cd  "react1 #"  <!-- #template: __ProjectName__"%20"# #-->


### 設定の詳細

- 一部の行のインデントを別の行よりも深くすることもできますが、オブジェクトにはなりません
- 値の指定がない変数は定義できません。`変数名:` だけの行は変数を定義しません
- 変数名や値に # を含めることはできません
- (version 0.x) 設定はネストできません。
    `設定:` より上の `設定:` で定義された変数は参照できません
- (version 1.x) 設定をネストできます。
    空白文字によるインデントのツリー構造において、
    変数を定義した `設定:` の親ノードの子孫…ノードから参照できます。
    親方向にある `設定:` で定義した変数と同じ名前の変数が
    子方向にある `設定:` でも定義されていたら、子方向で定義した値が参照されます。

サンプル

    設定:
        __Name__: project1
        main:
            __MainID__: 123      #// main.__MainID__ ではなく __MainID__ の定義
            __MainValue__: 500
        sub:
            __SubID__: 123
            __SubValue__: 500
            #__Option__: -f      #// 変数名や値に # を含めることはできません
    本文:  #// 設定: と同じインデントなので、ここ以降の行は設定の範囲外
        __Page__: 1

上記の設定で定義される変数の一覧:
`__Name__`, `__MainID__`, `__MainValue__`, `__SubID__`, `__SubValue__`

### 設定名

設定名を付けると replace コマンドや reset コマンドで置き換える対象の設定を
行番号の代わりに設定名で指定できるようになります。
ただし、置き換える対象のテキストに書かれた `設定:` または `settings:` の
コロンの前にカッコ付きで設定名を書く必要があります。

サンプル.yaml

    設定(プロジェクト1):
        __Name__: image1
    本文:
        これは image1 の説明です。 #template: __Name__

    設定(プロジェクト2):
        __Name__: image2
    本文:
        これは image2 の説明です。 #template: __Name__

コマンド

    typrm replace  サンプル.yaml  "プロジェクト1"  "__Name__: Image1"

- 設定名は、数字だけにすることはできません

### #template-if タグ - 条件を満たしているかどうかの記号を置き換えます

多くのマニュアルは、条件によって読み飛ばす部分があります。
たとえば、Windows で操作するときの説明文と mac で操作するときの説明文が
書いてあるマニュアルです。
そういったマニュアルの場合、読むべき説明文は、どちらか一方だけです。

`#template-if:` タグを使えば、読むべき文節か読まなくてもよい文節かを
記号を見るだけで判断できるようになります。
その記号などは `template-if(yes)` 変数の値と `template-if(no)` 変数の値に設定します。

    設定:
        OS: Windows  #// Windows または mac
        template-if(yes): 🌟
        template-if(no):  💤
    コピー操作:
        🌟 Windows の場合:  #template-if: $settings.OS == Windows
            Ctrl + C
        💤 mac の場合:      #template-if: $settings.OS == mac
            command + C

置き換えるときは、replace コマンドを使って次のように入力します。

    typrm replace  __FileName__  "OS: mac"

OS 変数の値を Windows から mac に置き換えると、
読むべきかどうかを表す記号も置き変わります。

    設定:
        OS: mac  #original: Windows  #// Windows または mac
        template-if(yes): 🌟
        template-if(no):  💤
    コピー操作:
        💤 Windows の場合:  #template-if: $settings.OS == Windows
            Ctrl + C
        🌟 mac の場合:      #template-if: $settings.OS == mac
            command + C


## check コマンド - 置き換えることができることをテストします

typrm が正しく設定値を置き換えることができることをチェックするときは、
`check` コマンドを使います。短いコマンド名は `c` です。

    typrm check __FileName__

typrm は、設定値を置き換える範囲を正しく判定するために、
置き換える前に、置き換える前の設定値を適用したテキストが存在することをチェックしています。


## mutual-search コマンド - リンク元も含めて検索して、リンク関係を維持します

mutual-search コマンドは、下記に示すリンク関係を維持するために使います。

`#search:` タグは、リンク元に相当し、
詳細な情報や関連する情報が検索して見つかることを示しています。
たとえば、下記のタイトル1の内容を読んでいるときに、参考になる情報を見るときは、
example detail で typrm の search コマンドを実行すると、
タイトル2:  #keyword: example detail の行が見つかります。

    タイトル1:
        内容:
            ある情報
        参考:
            タイトル2: #search: example detail

    タイトル2:  #keyword: example detail
        関連する情報

このようなリンク関係にある検索キーワードを変更するときは、
`#keyword:` タグに指定したキーワードと
`#search:` タグに指定したキーワードを同じキーワードにする、
または、
`#keyword:` タグに指定したすべてのキーワードを
`#search:` タグに指定したキーワードの一部に含むようにしなければ、
リンク切れになってしまいます。

mutual-search コマンドは `#keyword:` タグに指定したキーワードだけでなく
`#search:` タグに指定したキーワードも検索します。
こうして見つかったリンク元とリンク先のキーワードの両方を変更します。

変更前:

    example.yaml:5:   タイトル2: #search: sample detail
    example.yaml:7: タイトル2:  #keyword: sample detail

変更後:

    example.yaml:5:   タイトル2: #search: example detail
    example.yaml:7: タイトル2:  #keyword: example detail


## where コマンド - 設定値（変数）の定義を探します

(version 1.0.0 以降は使えません。
`#template:`が参照する変数の定義位置を探すときは、
テンプレートにマッチしないエラーをわざと発生させてください。)

`設定:` にまとめて書かれている変数の定義（変数名: 値）の場所を探すときは、
where コマンドを入力します。

example.yaml:

    1: 設定:
    2:     __FileName__: file.txt
    3:     __Number__: 12
    4: 本文:
    5:     file.txt  #template: __FileName__

`__FileName__` 変数の定義の場所を表示するときは、下記のように入力します。

    typrm where __FileName__

見つかったら下記のように場所と定義内容が表示されます。
複数見つかる場合もあります。

    .../example.yaml:2:     __FileName__: file.txt

ファイル名で絞り込むときは、変数名に続けてファイル名を入力します。

    typrm where __FileName__ example.yaml

特定のテンプレートで参照される変数の定義を探すときは、
変数名に続けてテンプレートがあるファイル名と行番号を入力します。

    typrm where __FileName__ example.yaml 5


## #file-template タグを使ってファイルの内容をチェックします

別のファイルの内容が設定値に合っていることをチェックすることができます。

チェックするときは、
`check` コマンドを使います。短いコマンド名は `c` です。

    typrm check __FileName__

たとえば、下記にように書くと、`my.json` ファイルの中の設定値が、
`設定:` タグに書かれた設定値と同じことをチェックするようになります。
同じでなければ check コマンドを実行したときにエラーが表示されます。

`__Project__/root.yaml` ファイル:

    設定:
        __Stage__: develop
    ./my.json の一部:  #file-template: ./my.json
        "stage": "develop"  #template: "__Stage__"

`__Project__`/my.json ファイル:

    {
        "stage": "develop"
    }

もし、設定を下記のように変更したら、エラーになります。

`__Project__/root.yaml` ファイル:

    設定:
        __Stage__: product
    ./my.json の一部:  #file-template: ./my.json
        "stage": "product"  #template: "__Stage__"

内容をチェックするときは、`#template:` タグを削除した内容と比較します。

`#file-template:` より右に書かれたパスが、
`#file-template:` タグより左に書かれていなければ、エラーになります。

チェックする対象のファイルの一部だけ比較します。
上記の例の場合、{ の行と } の行はチェックしていません。
別の言い方をすれば、チェックする内容で対象のファイルの中を検索をします。
見つからなかったらエラーになります。

複数行チェックすることもできます。
`#file-template:` タグが対象とする行の範囲は、
`#file-template:` タグがある行のインデントと同じか浅いインデントの行の前までです。

    ./my.json の一部:  #file-template: ./my.json
        チェック内容
        チェック内容
        チェック内容
    チェックしない内容

`#file-template:` より右に書かれたパスが相対パスのときは、その基準は、
`#file-template:` タグが書かれているファイルがあるフォルダーです。

`#file-template-any-lines:` タグをチェックする内容の一部に書くと、
その行（0行以上）は対象のファイルの内容と比較しません。

    ./my.json の一部:  #file-template: ./my.json
        チェック内容
        #file-template-any-lines:
        チェック内容
    チェックしない内容

チェック内容の1行目で対象のファイルの中を検索します。
チェック内容の2行目以降は、その検索によって見つかった行のすぐ下の行から比較します。
チェック内容が `#file-template-any-lines:` のときは、
その次の行に書かれているチェック内容で対象のファイルの中を検索します。


## #if タグを使って条件を設定します

ある設定値と別の設定値の間に関連があるときは、
`設定:` または `settings:` の中に `#if:` タグを書いて、
条件に応じた値を設定することができます。

    設定:
        target: banana
        banana:  #if: $settings.target == banana
            __Color__:  yellow
            __Type__:   fruit
        crow:  #if: $settings.target == crow
            __Color__:  black
            __Type__:   bird

`#if:` タグに指定した条件の対象となる範囲は、
`#if:` タグが書かれている行のインデントの深さと同じか浅いインデントの行の前までです。

replace コマンドを実行すると `#if:` の条件を満たす変数の値だけ置き換えます。
たとえば replace コマンドに `__Color__` を指定すると、
banana の次の行の `__Color__` を置き換え、
crow の次の行の `__Color__` は置き換えません。
また、replace コマンドに `target` を指定すると、設定の `target` と
本文の `target`, `__Color__`, `__Type__` を置き換えます。

`#if:` の右は、以下の書式に合う条件のみ書くことができます。

    #if: $settings.__SettingsName__ == __Value__
    #if: $settings.__SettingsName__ != __Value__
    #if: $env.__EnvName__ == __Value__
    #if: $env.__EnvName__ != __Value__
    #if: true
    #if: false

`__SettingsName__` は、`設定:` に書かれている変数名です。
`__EnvName__` は、環境変数名です。
環境変数が定義されていないときは "" になります。
たとえば、Windows であるという条件は、Windows でデフォルトで定義されていて
Windows 以外では定義しない環境変数 `windir` を使って下記のように書きます。

    #if: $env.windir != ""

設定の外に `#if:` タグを書くと、条件を満たしたときだけ、
`#template:` タグや `#file-template:` タグによる内容が
合っているかどうかのチェックをするようになります。

    設定:
        __Stage__: develop
    コマンド:
        リリース時:  #if: $settings.__Stage__ != develop
            cp  build  stage  #template: __Stage__

上記の場合、`__Stage__` の値が develop 以外のときだけ、
`#template:` タグとその左側の内容が合っているかどうかをチェックします。

`#if:` タグの対象となる `#template:` タグや `#file-template:` タグの範囲は、
`#if:` タグが書かれている行のインデントの深さと同じか浅いインデントの行の前までです。


## #expect タグを使って設定値をチェックします

`#expect:` タグに続いて条件を指定すると、その条件を満たさないときにエラーになります。
通常、`#if:` タグと同時に使います。

    #if: $settings.__Write__ == yes
        #expect: $settings.__BackUp__ == yes

サンプル:

    設定:
        __Write__: yes    #// yes or no
        __BackUp__: yes   #// yes or no
    write メソッド:  #if: $settings.__Write__ == yes
        必要性: yes  #template: __Write__
        方法: ファイルを開いて書き込みます
        関連: バックアップも行ってください  #expect: $settings.__BackUp__ == yes
    back up メソッド:
        必要性: yes  #template: __BackUp__
        方法: バックアップ ツールをダウンロードします

変数の値に依存関係があるときは、`#expect:` タグでチェックするのではなく
`#if:` タグのブロックの中に変数の定義を書いてください。


## #ref タグ - 環境変数を含むファイルのパスを展開して表示します

画像ファイルや PDF ファイルなど参照するファイルが PC にインストールされているとき、
参照するファイルを開くためにフォルダーの中に入っていくより、
ファイルのパスをマニュアルからブラウザーなどにコピー＆ペーストしたほうが
早く開くことができます。

    参考: 赤本 2021年度版  C:\Users\user1\Documents\books\manual\red_book_2021.pdf

しかし、パスにユーザー名が含まれていることやファイルの置き場所が変わることがあるため、
多くのマニュアルに書かれたパスは、そのままコピーして使うことができません。

    参考: 赤本 2021年度版  #ref: ${books}/manual/red_book_2021.pdf

上記 `${books}` の部分は置き換える部分の書き方の例です。
ファイルを置くフォルダーのパスやドライブが PC や OS によって異なる場合、
環境変数を使って置き換える部分を吸収することができますが、
OS によって環境変数を展開する部分の書き方が異なります。
また、\（円記号またはバックスラッシュ）でフォルダーを区切ったパスは Windows でしか使えません。

Linux や mac のパスのサンプル:

    ${books}/manual/red_book.pdf  または
    $books/manual/red_book.pdf

Windows のパスのサンプル:

    %books%\manual\red_book.pdf  または
    %books%/manual/red_book.pdf  または
    ${env:books}/manual/red_book.pdf  ← PowerShell の場合

typrm の `#ref:` タグの機能を使うことで、
マニュアルにパスを書くときの環境変数を展開する部分を `${____}` 形式で、
フォルダーの区切りの部分を `/` 形式で書くように統一することができます。

    参考: 赤本 2021年度版  #ref: ${books}/manual/red_book_2021.pdf

typrm の search コマンドのパラメーターや、検索キーワード入力モードのプロンプトに、
`#ref:` と環境変数を含むパスを入力すると、コピー＆ペーストできるパスが表示されます。
なお、コマンドラインに指定する `#` と `$` は `\` でエスケープする必要があります。

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder

    $ typrm s
    keyword: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    keyword or number:

環境変数の値は typrm を起動するときに設定します。
ただし、環境変数を設定するときの環境変数名に接頭辞 `TYPRM_` を追加する必要があります。
追加しないとコマンドラインに `\` でエスケープしない `$` で参照することはできますが、
検索キーワード入力モードでは参照できなくなります。
環境変数の定義は、たとえば typrm を起動する スクリプト ファイル の中に書きます。

`0.Folder` は、ファイルに関連するコマンドを実行する機能のメニューです（後記）。

Windows の PS1 スクリプト ファイル の場合:
${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\typrm.ps1:

    ${env:TYPRM_books} = "C:\Users\____\Documents\books"
    node --experimental-modules --es-module-specifier-resolution=node  ____\build\typrm.js $PsBoundParameters.Values $args

Linux の bash や mac の zsh の スクリプト ファイル の場合:
${HOME}/bin/typrm:

    export TYPRM_books="/home/____/Documents/books"
    node --experimental-modules --es-module-specifier-resolution=node  ____/build/typrm.js "$@"

typrm の search コマンドに `#ref:` タグと環境変数のないパスを指定すると、
マニュアルに書くべき `#ref:` タグのパラメーターも一緒に表示されます。

    $ typrm s "#ref:" /home/user1/Documents/books/manual/red_book_2021.pdf
    Recommend: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf

    > typrm s
    keyword: #ref: C:\Users\user1\Documents\books\manual\red_book_2021.pdf
    Recommend: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf


### ファイルに関連するコマンドを実行します

search (s) コマンドに `#ref:` タグを付けてファイルのパスを表示すると、
ファイルのパスをパラメーターに指定するコマンドの一覧が表示されます。

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder

`0.Folder` は表示されたパスのファイルがあるフォルダーを開くコマンドです。
search コマンドのパラメーターにコマンドの数字を追加指定するとコマンドを実行します。

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'　0  #// Folder コマンド

検索キーワード入力モードに入って `#ref:` タグでファイルのパスを表示したら、
プロンプトが keyword or number: に変わります。
この状態で数字だけを入力するとコマンドを実行します。
数字以外を入力するとプロンプトが keyword: のときと同じことができます。

    $ typrm s
    keyword: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    keyword or number: 0

検索結果の中の第1候補の行（最も下の行）に `#ref:` タグが含まれたときも、
ファイルに関連するコマンドを選ぶことができます。

    $ typrm s
    keyword: red book
    .../books.yaml:32: #keyword: red book  #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    keyword or number: 0

コマンドの一覧に独自のコマンドを追加することができます。

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        1.View, 7.Echo, 0.Folder

`0.Folder` 以外のコマンド、たとえば `1.View` コマンドと `7.Echo` コマンド
を選べるようにするには、
`TYPRM_VERB` 環境変数に以下のように YAML 形式で設定します。

Windows の PowerShell の場合:

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
    node --experimental-modules --es-module-specifier-resolution=node  C:\Users\____\Downloads\typrm-master\build\typrm.js $PsBoundParameters.Values $args

mac の zsh の場合:

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
    node --experimental-modules --es-module-specifier-resolution=node  ____/build/typrm.js "$@"

`command` には command 固有の変数参照を含めることができます。

| 変数 | 値 |
| ---- | ---- |
| ${ref} | #ref: のパラメーター |
| ${windowsRef} | スラッシュをバックスラッシュに置き換えた #ref: のパラメーター |
| ${file} | #ref: のパラメーターの # より左 |
| ${windowsFile} | バックスラッシュを使ったパス |
| ${fragment} | #ref: のパラメーターの # より右 |
| ${lineNum} | 行番号。`TYPRM_LINE_NUM_GETTER` 環境変数の設定が必要です |

typrm に --verbose オプションを付けると、設定値を確認できます。


### ファイルの行番号に置き換えて表示します

search (s) コマンドに `#ref:` タグを付けてファイルのパスとパラメーターを指定すると、
ファイルのパスと行番号に置き換えて表示します。

    $ typrm s \#ref: '${projects}/project1/src/app.ts#main'
    C:/Users/user1/Projects/project1/src/app.ts:25
        0.Folder

`#` より右側は検索キーワードとしてファイルの内容を検索して行番号に置き換えて表示します。
上記の場合、`app.ts` ファイルの内容を `main` というキーワードで検索して、
見つかった行番号 `25` を表示します。

行番号に置き換えて表示するには、
`TYPRM_LINE_NUM_GETTER` 環境変数に以下のような YAML を設定します。
ただし、`regularExpression` の設定は環境に応じて編集してください。

Windows の PowerShell の場合:

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

bash, zsh の場合:

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

`type` には、`text` を指定します。

`filePathRegularExpressionIndex` には、`regularExpression`（正規表現）で
評価した結果のうち、ファイル パス の部分に該当するカッコの番号を指定します。
括弧の番号は、JavaScript の
[RegExp.exec (MDN)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#description) の仕様と同じです。

`keywordRegularExpressionIndex` には、
キーワードの部分に相当するカッコの番号を指定します。

`csvOptionRegularExpressionIndex` には、
CSV オプション `:csv` を指定する部分のカッコの番号を指定します。
CSV オプションが指定されると、`#` より右側を CSV 形式のキーワードのリストとし、
最初のキーワードを検索して見つかった行の次の行から 2つ目のキーワードで検索します。
キーワードは 3つ以上指定することもできます。

    $ typrm s \#ref: '${projects}/project1/src/app.ts:csv#first, second'

`targetMatchIdRegularExpressionIndex` は、非推奨になる予定です。
`targetMatchIdRegularExpressionIndex` には、
検索が何番目にマッチしたかを指定する部分のカッコの番号を指定します。
`:id=2` なら 2番目にマッチした行の行番号になります。

    $ typrm s \#ref: '${projects}/project1/src/app.ts:id=2#function'

`address` には address 固有の変数参照を含めることができます。

| 変数 | 値 |
| ---- | ---- |
| ${file} | #ref: のパラメーターの # より左 |
| ${windowsFile} | バックスラッシュを使ったパス |
| ${lineNum} | 行番号 |

typrm の search コマンドに --verbose オプションを付けると、
TYPRM_LINE_NUM_GETTER 環境変数の設定値、
および `#ref:` タグの値を正規表現で解析した結果を確認できます。


## （開発者用） 開発環境の構築手順

### Windows の場合

Node.js をインストールします:

    - https://nodejs.org/ja/download/ >> Windows Installer (.msi) >> 64-bit
    - ダウンロードしたファイル（例：node-v14.16.0-x64.exe）を開きます
    - インストール オプションはデフォルトを使用

Git for Windows をインストールします:

    - https://git-scm.com/ >> Downloads >> Windows
    - ダウンロードしたファイル（例：Git-2.31.1-64-bit.exe）を開く
    - Next を8回押す
    - Configuring the line ending conversions: Checkout as-is, commit as-is
    - 他のインストール オプションはデフォルトを使用

Visual Studio Code をインストールします:

    - https://code.visualstudio.com/
    - ダウンロードしたファイル（例：VSCodeUserSetup-x64-1.54.3.exe）を開きます
    - インストール オプションはデフォルトを使用
    - VSCode >> Terminal >> New Terminal
    - 開いたシェルの右上に 1:powershell が表示されていたら、そこをクリックして Select Default Shell >> Git bash
    - （推奨）Visual Studio Code をタスクバーにピン止めします:
    - （推奨）Ctrl + S キーを押したときに全てのファイルを保存するように設定します: |
        File >> Preferences >> Keyboard Shortcuts >> save all （と入力） >>
            File: Save All （をダブルクリック） >> Ctrl + S キー >> Enter キー
    - Visual Studio Code を閉じます

`cmd menu.bat` をダブルクリックして、`1. open_VisualStudioCode` を選びます:

F5 キーを押すと、最初のテストが動きます:


### mac の場合

Node.js をインストールします:

    - https://nodejs.org/ja/download/ >> macOS Installer (.pkg)
    - ダウンロードしたファイル（例：node-v14.16.0.pkg）を開きます
    - インストール オプションはデフォルトを使用

Visual Studio Code をインストールします:

    - https://code.visualstudio.com/
    - ダウンロードしたファイル（例：Visual Studio Code.app）をダブルクリックします
    - （推奨）Visual Studio Code を Dock に移動します:
    - （推奨）Ctrl + S キーを押したときに全てのファイルを保存するように設定します: |
        Code >> Preferences >> Keyboard Shortcuts >> save all （と入力） >>
            File: Save All （をダブルクリック） >> Command + S キー >> Enter キー
    - Visual Studio Code を閉じます

`cmd menu.command` ファイルに実行権限を追加します:

    - `bin/chmod+x.command.zip` ファイルをダブルクリックします
    - 解凍してできた `chmod+x.command` ファイルを右クリック >> 開く >> 開く
    - `cmd menu.command` ファイルを開いたウィンドウにドラッグ＆ドロップして、Enter キーを押し、ウィンドウを閉じます
    - `cmd menu.command` ファイルを右クリック >> 開く >> 開く
    - 開いたウィンドウを閉じます

`cmd menu.command` ファイルをダブルクリックして、`1. open_VisualStudioCode` を選びます:

fn + F5 キーを押すと、最初のテストが動きます:


### ホストOSが Windows、ゲストOSが CentOS 7 の場合

typrm をゲスト OS にインストールします:

    上記を参照

Visual Studio Code をホスト OS にインストールします:

    - https://code.visualstudio.com/
    - ダウンロードしたファイル（例：VSCodeUserSetup-x64-1.54.3.exe）を開きます
    - インストール オプションはデフォルトを使用
    - VSCode >> Terminal >> New Terminal
    - 開いたシェルの右上に 1:powershell が表示されていたら、そこをクリックして Select Default Shell >> Git bash
    - （推奨）Visual Studio Code をタスクバーにピン止めします:
    - （推奨）Ctrl + S キーを押したときに全てのファイルを保存するように設定します: |
        File >> Preferences >> Keyboard Shortcuts >> save all （と入力） >>
            File: Save All （をダブルクリック） >> Ctrl + S キー >> Enter キー

仮想的にローカル接続する ネットワーク アダプター を VM に追加します:

    VM の電源をオフにします:
    メニュー: VirtualBox >> （対象のVM）>> 設定（上）>> ネットワーク >>
        アダプター 2 >> ネットワークアダプターを有効化 >> 割り当て＝ホストオンリーアダプター
    VM を起動します:
    ゲストOSのIPアドレスをメモします:
        CentOS >> shell:
            ip a
            #// enp0s8 （の IP アドレス、inet の行）

VM のポートを解放するようにファイアーウォールを設定します:

    - sudo firewall-cmd --list-all  #// 現在のゾーンと設定を表示します
    - sudo firewall-cmd --set-default-zone=trusted  #// デフォルトゾーンを変更します。trusted は全てオープン
    - sudo firewall-cmd --reload  #// 設定を適用するために再起動します

Remote Development 拡張機能をインストールします:

    VSCode >> 拡張機能 ボタン（左） >> Remote Development

Remote Explorer アイコン（左）:

    REMOTE EXPLORER: SSH Targets
    SSH TARGETS: + ボタン
    Enter SSH Connection Command: ssh user1@192.168.0.100
    Select SSH configuration file to update:
        C:\Users\____\.ssh\config
    （もし）ログインするユーザー名を変えるときや、古いターゲットを消すとき:
        C:\Users\____\.ssh\config を開いて編集します
    192.168.0.100 （の右のフォルダー）ボタン を押します:

新しい Visual Studio Code ウィンドウが開きます:

    （初回のみ）ゲストOS の種類を選びます: Linux
    （初回のみ）fingerprint に対して continue を選びます:
    ゲストOSのユーザーのパスワードを入力します(2回):
        #// ログインに成功すると左下に緑色でサーバー名が表示されます
    ゲストOSのフォルダーを開きます:
        開いた VSCode ウィンドウ >> File >> Open Folder >> /home/user1/Downloads/typrm-master/
    ゲストOSのユーザーのパスワードを入力します:

node_modules フォルダーを復帰します:

    VSCode >> Terminal >> New Terminal >> npm ci

F5 キーを押すと、最初のテストが動きます:


## （開発者用） テスト

Jest を使うテストと Jest を使わないテストがあります。
ソース ファイルの行番号の左をクリックして、ブレークポイントを設定できます。

### Jest を使うテスト

- Visual Studio Code >> Terminal >> New Terminal >>（＋の左の 1:__shell__）>> Create JavaScript Debug Terminal
- npm test
    - 特定のファイルをデバッグするときは、ファイル名の一部を指定します。例：npm test main  #// src/main.test.ts をデバッグします
- テストを再起動します:
    - Continue ボタン:  #// 最後まで実行します
    - npm test が動いている Terminal で f キーを押します
- （終了するときは）Terminal タブ（下）>> ゴミ箱アイコン（右）

### Jest を使わないテスト

- Visual Studio Code >> F5 キー


## タグ一覧

- `#disable-tag-tool:` 同じ行にあるタグを無効にします
- `#expect:` 条件チェック
- `#file-template:` ファイルの内容をチェックするときのテンプレート
- `#file-template-any-lines:` ファイルの内容をチェックしない行
- `#glossary:` 子要素にあるキーを検索対象のキーワードにします
- `#if:` タグを有効にする条件
- `#keyword:` 検索対象のキーワード
- `#original:` 置き換える前の値
- `#ref:` リンク先のファイルのパス
- `#search:` リンク先を検索するときのキーワード
- `#(search)if:` 検索を有効にする条件
- `#template:` 本文を置き換えるときのテンプレート
- `#template-at():` 2行以上上の本文を置き換えるときのテンプレート
- `#template-if:` 本文に入れる内容を決める条件

タグの前は空白文字、または行頭である必要があります。

タグの詳細については、このページを検索してください。
