# typrm
<!-- Character Encoding: "WHITE SQUARE" U+25A1 is □. -->

typrm は自分がよく参照するドキュメントや自分が使いやすいスニペットが書かれた
テキスト形式のファイルを検索して表示します。
また、コマンドのパラメーターを現在の状況に合わせて置き換えることができ、
コピー＆ペーストするだけでコマンドを実行できるようになります。

    $ typrm ssh
    /path/MyServers.yaml:100: ログインします: #keyword: ssh
        ssh webserver-0011-stg.example.com  -i ~/.ssh/stg/id_rsa
            #template: ssh __Server__  -i __Identity__

(GitHub for iPhone では下記リンク先にジャンプできません。ブラウザーで開いてください。)

<!-- TOC depthFrom:1 -->

- [typrm](#typrm)
  - [スニペット検索機能 (#keyword タグ, #glossary タグ) - 精度よくスニペットを検索します](#スニペット検索機能-keyword-タグ-glossary-タグ---精度よくスニペットを検索します)
    - [検索対象フォルダーの設定](#検索対象フォルダーの設定)
    - [検索の優先順位とスニペットの設定方法](#検索の優先順位とスニペットの設定方法)
    - [search コマンドの詳細](#search-コマンドの詳細)
    - [#glossary タグと シソーラス ファイル](#glossary-タグと-シソーラス-ファイル)
    - [秘密データを安全な場所に書く - .env ファイル](#秘密データを安全な場所に書く---env-ファイル)
  - [リプレース機能 (replace コマンド, reset コマンド) - コピペでコマンドを入力できるようにします](#リプレース機能-replace-コマンド-reset-コマンド---コピペでコマンドを入力できるようにします)
    - [#to タグを使って置き換えます](#to-タグを使って置き換えます)
    - [任意のコマンドを実行します](#任意のコマンドを実行します)
  - [インストール](#インストール)
    - [Windows の場合](#windows-の場合)
    - [mac の場合](#mac-の場合)
    - [CentOS 7 の場合](#centos-7-の場合)
  - [設定タグと #template タグを使って設定値を置き換えます](#設定タグと-template-タグを使って設定値を置き換えます)
    - [変数名の一部を別の変数から参照します - #same-as タグ](#変数名の一部を別の変数から参照します---same-as-タグ)
    - [設定の詳細](#設定の詳細)
    - [#template-if タグ - 条件を満たしているかどうかの記号を置き換えます](#template-if-タグ---条件を満たしているかどうかの記号を置き換えます)
  - [check コマンド - 置き換えることができることをテストします](#check-コマンド---置き換えることができることをテストします)
  - [mutual-search コマンド - リンク元も含めて検索して、リンク関係を維持します](#mutual-search-コマンド---リンク元も含めて検索してリンク関係を維持します)
  - [#file-template タグを使ってファイルの内容をチェックします](#file-template-タグを使ってファイルの内容をチェックします)
  - [#copy タグを使って文章が同じことをチェックします](#copy-タグを使って文章が同じことをチェックします)
  - [#if タグを使って条件を設定します](#if-タグを使って条件を設定します)
  - [#expect タグを使って設定値をチェックします](#expect-タグを使って設定値をチェックします)
  - [#ref タグ - 環境変数を含むファイルのパスを展開して表示します](#ref-タグ---環境変数を含むファイルのパスを展開して表示します)
    - [ファイルに関連するコマンドを実行します](#ファイルに関連するコマンドを実行します)
    - [ファイルの中を検索して行番号に置き換えて表示します](#ファイルの中を検索して行番号に置き換えて表示します)
    - [画像の中の注目すべき場所にポインターを付けて表示します](#画像の中の注目すべき場所にポインターを付けて表示します)
  - [（開発者用） 開発環境の構築手順](#開発者用-開発環境の構築手順)
    - [Windows の場合](#windows-の場合-1)
    - [mac の場合](#mac-の場合-1)
    - [ホストOSが Windows、ゲストOSが CentOS 7 の場合](#ホストosが-windowsゲストosが-centos-7-の場合)
  - [（開発者用） テスト](#開発者用-テスト)
    - [Jest を使うテスト](#jest-を使うテスト)
    - [Jest を使わないテスト](#jest-を使わないテスト)
  - [タグ一覧](#タグ一覧)
  - [環境変数一覧](#環境変数一覧)

<!-- /TOC -->


## スニペット検索機能 (#keyword タグ, #glossary タグ) - 精度よくスニペットを検索します

typrm の検索機能は、自分がよく参照するドキュメントの場所や自分がよく使うスニペットを表示します。
Linux の `man grep` のように `typrm grep` を使えます。
検索キーワード入力モード(typrm shell)に入ることもできます。

検索する typrm コマンド:

    $ typrm grep
    /path/MyLinux.yaml:100: grep: #keyword:

Visual Studio Code のターミナルで typrm コマンドを実行した場合、
検索されたパスと行番号を Ctrl キーを押しながらクリックすることで
ドキュメントの内容にジャンプできます。
ドキュメントを見ながらコマンドを入力することもできます。

また、ドキュメントの先頭の数行はスニペットとして検索と同時に表示されます。

    $ typrm grep
    /path/MyLinux.yaml:100: grep: #keyword:
        サンプル: grep -rn __Keyword__ __FilePath__
        キーワードを含まないファイル: grep -L __Keyword__ __Path__

typrm の検索は grep の検索よりドキュメントを検索することに向いています。
たとえば grep はワードの順番が違うとマッチしませんが typrm はマッチします。
正規表現は指定できませんが逆に正規表現の特殊記号に注意を払うことなく検索することができます。

    $ typrm valid? ruby
    /path/Ruby.yaml:100: valid?: #keyword: Ruby valid?

検索対象となる テキスト ファイル の中のキーワードに `#keyword:` タグを付ると
優先的に（検索結果の一覧の最も下に）表示されます。

スニペットに表示させる内容は見つかった行より深い空白文字のインデントにします。

`MyLinux.yaml` テキスト ファイル の内容のサンプル:

        ....
    grep: #keyword:
        サンプル: grep -r __Keyword__ __FilePath__
        キーワードを含まないファイル: grep -L __Keyword__ __Path__
    sed: #keyword:
        ....

### 検索対象フォルダーの設定

`TYPRM_FOLDER` 環境変数、または `--folder` オプションに
検索対象のファイルが入っているフォルダーのパスを指定します。

環境変数は typrm をインストールするときに作るスクリプトに書きます。

bash や zsh で環境変数を設定する場合:

    export TYPRM_FOLDER="${HOME}/Documents/typrm"
    typrm ls

bash や zsh で `--folder` オプションを指定する場合:

    typrm --folder "${HOME}/Documents/typrm"  ls

PowerShell で環境変数を設定する場合:

    ${env:TYPRM_FOLDER} = "${env:USERPROFILE}\Documents\typrm"
    typrm ls

PowerShell で `--folder` オプションを指定する場合:

    typrm --folder "${env:USERPROFILE}\Documents\typrm"  ls

`TYPRM_FOLDER` 環境変数の値は CSV 形式です。
複数のフォルダーのパスを指定することができます。
ファイル名のワイルドカードを指定することもできます。
ファイルを指定することもできます。

    ${env:TYPRM_FOLDER} = "${env:USERPROFILE}\Documents\typrm, ${env:USERPROFILE}\Files\*.yaml"

特定のフォルダーやファイルを除外する場合は、`{*, !__Exclude__}` のように指定します。
サブフォルダーにある `__Exclude__` も除外されます。
ただし、`*,` のコンマが CSV 形式の区切りにならないように全体を `" "` で囲んでください。

bash:

    TYPRM_FOLDER="\"${HOME}/Documents/typrm/{*, !node_modules}\", ${HOME}/Files/*.yaml"

PowerShell:

    ${env:TYPRM_FOLDER} = "`"${env:USERPROFILE}\Documents\typrm\{*, !node_modules}`", ${env:USERPROFILE}\Files\*.yaml"

### 検索の優先順位とスニペットの設定方法

検索結果に優先的に表示させるキーワードに対して `#keyword:` タグを付けます。

テキスト ファイル の内容のサンプル:

    Shows all files:  #keyword: ls
    Example: ls -a sub_folder

typrm コマンド:

    $ typrm ls
    .../text.txt:2: Example: ls -a sub_folder
    .../text.txt:1: Shows all files:  #keyword: ls

上記の場合、`#keyword:` タグがある行の `ls` が優先的に見つかります（下に表示されます）。

- `#keyword: git clone` と `#keyword: git status` があるときに
  `git` を検索したときは、`git clone` が最も優先的に表示されます。
  `git status` は、文字数の差が大きいため、2番目に表示されます。
- `git status` のスニペットを表示したいときは、`git status` で検索します。
- スニペットが表示されるのは、最も優先的にヒットした検索結果のスニペットだけです。
- `#glossary:` タグによってヒットしたキーワードに関するスニペットも表示されます。

10件以上検索にヒットした場合、優先する10件だけ表示します。
この件数は `TYPRM_FOUND_COUNT_MAX` 環境変数または --found-count-max オプションで変更できます。

`#keyword:` タグがある行と同じ行に `#snippet-depth:` タグがある場合、
タグに指定した値よりもインデントのレベルが浅くなった行の上の行までがスニペットとして表示されます。
`#snippet-depth:` タグに指定する値は、空白文字の数ではありません。

typrm コマンド:

    sed: #keyword:  #snippet-depth: 2
        サンプル:
            _c="$(sed "s/aa/AA/g"  target.txt)";  echo "$_c" > target.txt

`MyLinux.yaml` テキスト ファイル の内容のサンプル:

        ....
    sed: #keyword:  #snippet-depth: 2
        サンプル:
            _c="$(sed "s/aa/AA/g"  target.txt)";  echo "$_c" > target.txt
        書式:
        ....

`#keyword:` タグがある行に `#snippet-depth:` タグがない場合、
表示される最大の行数は 5行です。
この行数は `TYPRM_SNIPPET_LINE_COUNT` 環境変数または
`--snippet-line-count` オプションで変更できます。

コロンまでをキーワードにするときは、`#keyword:` タグのパラメーターを省略できます。
下記の場合、検索できるキーワードは ls です。

    ls:  #keyword:

行頭にハイフンがあるときは、キーワードにハイフンを含みません。
下記の場合、検索できるキーワードは ls です。

    - ls:  #keyword:

検索キーワードに `#keyword:` または `#search:` を入力しても無視されます。


### search コマンドの詳細

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

search コマンドにキーワードを指定しないと、検索キーワード入力モード(typrm shell)になります。
このモードを終了するには、Ctrl+C キーを押します。

    $ typrm
    typrm keyword: csv
    .../text.txt:1: #keyword: CSV, comma separated values
    typrm keyword:

Windows で Git bash を開いている場合でも、
下記のコマンドで typrm.ps1 の PowerShell
スクリプトを起動することができます。

    $ powershell typrm

Visual Studio Code のターミナルで実行した場合、見つかった場所（パス）を
Ctrl キーを押しながらクリックすると開くことができます。

検索した後で # と数字（例：#1）を入力すると、
`TYPRM_OPEN_DOCUMENT` 環境変数に設定したコマンドを実行します。
入力する数字は検索結果の下から数えた番号です。
環境変数の値の `${ref}` の部分はフルパスに置き換わります。

bash

    $ export TYPRM_OPEN_DOCUMENT="code -g \"\${ref}\""
    $ typrm
    typrm keyword: csv
    /home/user1/text.txt:1: #keyword: CSV, comma separated values
    typrm keyword: #1

実行されるコマンド

    code -g "/home/user1/text.txt:1"

- 複数の単語からなる検索キーワードを指定するときでも、" " で囲む必要はありません。
  ただし 2つ以上の空白は 1つになります。
- 複数の単語を指定すると AND 検索になります。
- AND 検索で 1つもヒットしなかったときは、
  なるべ多い単語数で AND 検索にマッチしたものが表示されます（OR 検索に相当します） 
- 大文字小文字が違っていてもヒットしますが、
  大文字小文字が同じテキストが上位に表示されます。
  typrm では上位にヒットしたテキストが下側に表示されます。

    $ typrm Comma Separated Value
    .../text.txt:1: #keyword: CSV, comma separated values

- 同じ行内なら単語の順番が逆でも間に別の単語があっても見つかります。

    `git status`
    `status git`
    `status --option git`

- 単語数を増やすと絞り込めます。単語数を減らすと関連する内容もヒットします。
- 入力したキーフレーズに `#search:` を含む場合、`#search:` を `#keyword:`
  に置き換えた行全体にもヒットします。

下記のうち、上に書かれた違いほど検索スコアを大きく落とします。
- 語数の違い
- 文字数の違い
- 大文字小文字の違い

`#score:` タグを付けると、それより深いインデントにある
`#keyword:` タグに指定したキーワードの検索結果の優先度を変更します。
`#score:` タグにプラスの値を設定すると優先的になります。

    main: #score: +1
        application: #keyword:  #// 優先。検索結果の下側に表示されます
    notice: #score: -1
        application: #keyword:

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


### #glossary タグと シソーラス ファイル

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


### 秘密データを安全な場所に書く - .env ファイル

パスワードや API キーなど秘密のデータ（シークレット）をスニペットに表示したいときや、
チェックするファイルの内容にシークレットが含まれているときは、
typrm を起動したときの カレント フォルダー にある .env ファイルに
シークレットを書きます。

.env ファイルに書かれた環境変数や typrm の親プロセスから継承した環境変数を参照するときは、
`#template:` タグに `$env.{環境変数名}` または
`$env.環境変数名` を書きます。

また、`#settings:` タグに `$env.{環境変数名}: ファイル内での値` を定義します。

.env ファイル:

    DB_USER = root
    DB_PASS = 5I#OfEilq#)

シークレットを含むスニペットを表示する（通常の typrm search コマンドと同じ）:

    $ typrm DB log in
    /path/MyDB.yaml:100: DB log in: #keyword:
        コマンド: db  --user root  --pass 5I#OfEilq#)

`MyDB.yaml` テキスト ファイル の内容のサンプル:

        ....
    DB log in: #keyword:
        コマンド: db  --user __DB_UserName__  --pass __DB_Password__
            #template: db  --user $env.DB_USER  --pass $env.{DB_PASS}
    setting: #settings:
        $env.DB_USER: __DB_UserName__
        $env.{DB_PASS}: __DB_Password__
        ....

シークレットは、過去に表示した画面やシェルのヒストリーやクリップボードから
削除してください。
削除するコマンドのサンプルは `__Project__/example/clear-all` にあります。

.env ファイルのロードに
[ npm の dotenv モジュール ](https://www.npmjs.com/package/dotenv)
を使っており上記の環境変数のようにアクセスできますが、プロセスに環境変数は設定されません。
環境変数は設定されませんが、スニペットと ファイル チェック から参照することができます。
typrm shell から起動する子プロセスに .env ファイルで定義した
環境変数は継承されません。
`--inherit-dotenv` オプションを指定して typrm を起動したときは
環境変数が typrm のプロセスに設定および子プロセスに継承されます。

typrm を起動するスクリプトの中で カレント フォルダー
を設定しておくと、どのフォルダーから typrm のスクリプトを起動しても
同じ .env ファイルを参照できます。

ファイルの内容をチェックする typrm コマンド:

    $ typrm check root.yaml

`__Project__/root.yaml` ファイル:

        ....
    ./my.json の一部:  #file-template: ./my.json
        "username": "__DB_UserName__",  #template: "$env.{DB_USER}"
        "password": "__DB_Password__"   #template: "$env.{DB_PASS}"
    setting: #settings:
        $env.{DB_USER}: __DB_UserName__
        $env.{DB_PASS}: __DB_Password__
        ....

`__Project__`/my.json ファイル:

    {
        "username": "root",
        "password": "5I#OfEilq#)",
    }

PowerShell のスクリプト(.ps1 ファイル)の中で
カレント フォルダー を .env ファイルがあるフォルダーに移動した場合、
Ctrl + C で終了したときに カレント フォルダー を元のフォルダーに戻すには、
下記のように Try 〜 Finally で囲んだ PowerShell のスクリプトを書きます。

    $StartingFolder = (Convert-Path .)
    cd  "${HOME}"
    Try {
        node ... typrm.js ...
    } Finally {  #// Ctrl+C を押したときも実行されます
        cd  $StartingFolder
    }

`#if:` タグから .env ファイルで定義した変数は参照できません。

## リプレース機能 (replace コマンド, reset コマンド) - コピペでコマンドを入力できるようにします

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

    設定: #settings:
        __Name__: work1
    shell:
        - mkdir work1  #template: __Name__
        - cd    work1  #template: __Name__

`#settings:` に変更する部分に関する 変数名: 値 を書きます。
変数名は大文字小文字を区別します。
変更する部分と同じ行の末尾に `#template:` タグを書きます。
（後で説明しますが、別の行に書くこともできます）

設定の中の変数の値の右に `#to:` タグと置き換えた後の値を書きます。

    設定: #settings:
        __Name__: work1  #to: work2

（`#to:` タグは設定以外にも書くことができます。）

typrm をインストールして、
bash や PowerShell から以下のように `replace` コマンドを入力します。短いコマンド名は `r` です。

    typrm replace  new_folder.yaml  #// または typrm r  new_folder.yaml

new_folder.yaml ファイルは次のような内容に変わり、コピー＆ペーストできるようになります。
コメントの付いたテキストはそのまま貼り付けることができます。# は
多くのシェルでコメントとして扱われるからです。

    設定: #settings:
        __Name__: work2  #original: work1
    shell:
        - mkdir work2  #template: __Name__
        - cd    work2  #template: __Name__

設定の `work1` と本文の `work1` が、`work2` に置き換わります。

置き換える前の値が書かれた `#original:` タグが同じ行に追加されます。
`#original:` タグがすでにあるときは追加されません。
`#original:` タグの値と同じ値に `#to:` タグの値を設定した場合、
`#original:` タグは削除されます。

`#original:` タグに書かれた値に戻すときは、reset コマンドを使います。
また、reset コマンドを使うと `#original:` タグは削除されます。

    typrm reset  new_folder.yaml

### #to タグを使って置き換えます

設定に `#to:` タグを書く場合、変数の名前と値が書かれた行の値より右に
`#to:` と置き換えた後の値を書きます。

`#to:` タグを追加する前のサンプル:

    設定: #settings:
        __NameA__: workA1
        __NameB__: workB1
        __NameC__: workC1
    本文:
        workB1  #template: __NameB__
        workB1  #template: __NameB__

`__NameB__` に `#to:` タグを追加した後のサンプル:

    設定: #settings:
        __NameA__: workA1
        __NameB__: workB1  #to: workB2
        __NameC__: workC1
    本文:
        workB1  #template: __NameB__
        workB1  #template: __NameB__

タグを追加したらファイルを保存してください。

スクリプトから `#to:` タグを設定するときは、
Linux `sed` コマンドなどで編集します。 

パラメーターなしの replace コマンドを入力すると、カレント フォルダー および
`TYPRM_FOLDER` 環境変数に設定したフォルダーの中にあるすべてのファイルの
`#to:` タグを置き換えます。
同時に `#template:` タグなどが添えられたドキュメントの内容も置き換えます。
置き換える前の設定値は `#original:` タグに残ります。

入力するコマンド:

    typrm replace    #// または typrm r

コマンド実行後の内容:

    設定: #settings:
        __NameA__: workA1
        __NameB__: workB2  #original: workB1
        __NameC__: workC1
    本文:
        workB2  #template: __NameB__
        workB2  #template: __NameB__

`#to:` タグを追加した後のバリエーション:

    設定: #settings:
        __Name__: workA1  #to: workA2
        __Name__: workB1  #to: workB2  #// comment
        __Name__: workC1  #// comment  #to: workC2

コマンド実行後の内容:

    設定: #settings:
        __Name__: workA2  #original: workA1
        __Name__: workB2  #original: workB1  #// comment
        __Name__: workC2  #original: workC1  #// comment

本文に `#to:` タグを書く場合、
`#template:` タグの右に `#to:` タグと置き換えた後の値を書きます。
または、対象の `#template:` タグの行から、次の `#template:` タグの行の間に、
`#to:` タグだけの行を追加します。

    設定: #settings:
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

    (workA1 : workB1)  #template: (__NameA__ : __NameB__)  #to: workA2, workB2

または

    (workA1 : workB1)  #template: (__NameA__ : __NameB__)  #to: (workA2 : workB2)

`#template:` タグが参照する変数が何かを調べるには、
一時的にテンプレートにマッチしないように書き換えて check コマンドを実行します。

書き換える前:

    (workA1 : workB1)  #template: (__NameA__ : __NameB__)

一時的に書き換えた後の例:

    (workA1 : @@@ workB1)  #template: (__NameA__ : __NameB__)

入力するコマンド:

    typrm check    #// または typrm c

コマンド実行後の内容:

    example.yaml:64:     設定: #settings:
    example.yaml:65:         __NameA__: workA1
    example.yaml:66:         __NameB__: workB1
    example.yaml:68:         (workA1 : @@@ workB1)  #template: (__NameA__ : __NameB__)
        警告: テンプレートと一致しません。
        期待: (workA1 : workB1)

警告の内容から、`#template:` タグが参照する変数が
`__NameA__` と `__NameB__` であることが分かります。
また、それぞれの変数の定義位置も分かります。

typrm replace コマンドを実行すると、すべてのファイルにある `#to:` タグに従って
ファイルの内容を置き換えます。 すべてのファイルとは、
`TYPRM_FOLDER` 環境変数、または `--folder` オプションに指定した
フォルダーに入っているファイルです。
ファイル名を指定すると、指定したファイルにある `#to:` タグを処理します。

    typrm r
    typrm replace
    typrm replace  --folder my_folder
    typrm r  __FileName__


### 任意のコマンドを実行します

検索キーワード入力モード (typrm shell) で
`#r`, `#replace:`, `#reset:`, `#c`, `#check:`, `#mutual:` から入力すると、
typrm の replace, reset, check, mutual-search コマンドが使えます。

    typrm keyword: #r                // 全ファイル replace
    typrm keyword: #r example.yaml
    typrm keyword: #replace: example.yaml  // 短縮形ではないときは、末尾にコロンが必要です

typrm shell から bash などのシェルで使えるコマンドを実行するには、
コマンド記号とスペースを入力してからコマンドを入力します。
ちなみに私は、YAML の中に見つかったコードのインデントを除く
[indenter](https://github.com/Takakiriy/indenter) コマンドをよく使います。

echo コマンドを実行するサンプル:

    $ typrm
    typrm keyword$: $ echo abc
    abc
    typrm keyword$:

任意のコマンドを実行できるようにするには、コマンド記号を環境変数 `TYPRM_COMMAND_SYMBOL`
または typrm 起動時の --command-symbol オプションに設定し、
作業用フォルダー（カレント フォルダー）を環境変数 `TYPRM_COMMAND_FOLDER`
または typrm 起動時の --command-folder オプションに設定する必要があります。

bash

    export  TYPRM_COMMAND_SYMBOL='$'
    export  TYPRM_COMMAND_FOLDER=/Users/user1/bin/typrm_work

PowerShell

    ${env:TYPRM_COMMAND_SYMBOL} = '$'
    ${env:TYPRM_COMMAND_FOLDER} = /Home/user1/bin/typrm_work

コマンド記号は typrm shell のコロンの前に表示されます。

    typrm keyword$:

typrm shell のコロンの前にコマンド記号が表示されていない状態であれば、
任意のコマンドを実行されることはありません。

    typrm keyword:

Windows では **cmd.exe** のコマンドを入力できます。
バッチファイルを実行することもできます。

    example.bat parameter

PowerShell のコマンドを実行する場合は、
powershell.exe に -Command オプションを付けて起動してください。

    powershell -Command "Write-Output 'code A' > _out.txt"


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
            cd  "${env:USERPROFILE}\Downloads"
            Invoke-WebRequest  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip -OutFile "typrm.zip"
                #// develop ブランチの場合は、master.zip を develop.zip に変更して実行してください
            rm -r -fo  "typrm-master"  #// 初めてインストールするときは実行不要です
                #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください
            Expand-Archive  -Path "typrm.zip"  -DestinationPath "."
            cd  "typrm-master"
                #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください

            npm install --only=production

    PowerShell を使う場合:
        PowerShell の PATH が通ったフォルダーに typrm を起動する PS1 スクリプト ファイル を作ります:
            Windows スタート >> PowerShell（と入力） :
                ${script} = "${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\typrm.ps1"
                cd  ${env:USERPROFILE}\Downloads\typrm-master
                    #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください
                ${current_folder} = Convert-Path "."
                ${typrm_folder} = "${env:USERPROFILE}\Documents\typrm"

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
                script="${HOME}/bin/typrm"
                cd  ${HOME}/Downloads/typrm-master
                    #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください
                current_folder="$(pwd)"
                typrm_folder="${HOME}/Documents/typrm"
                mkdir -p "${HOME}/bin"

                echo  "export  NODE_PATH=\"${HOME}/AppData/Roaming/npm/node_modules\"" > ${script}
                echo  "export  TYPRM_FOLDER=\"${typrm_folder}\"" >> "${script}"
                echo  "export  TYPRM_OPEN_DOCUMENT=\"code -g \\\"\\${ref}\\\"" >> "${script}"
                echo  "" >> "${script}"

                echo  "node --experimental-modules --es-module-specifier-resolution=node  ${current_folder}/build/typrm.js \"\$@\"" >> ${script}

    typrm が使えることを確認します:
        PowerShell または Git bash を新しく開いて:
            typrm --version

    必要に応じて環境変数 TYPRM_COMMAND_SYMBOL, TYPRM_COMMAND_FOLDER, TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER を設定します

    アンインストールする場合、下記のファイルやフォルダーを削除し、不要なら Node.js をアンインストールします。
        - ${HOME}/bin/typrm （固有の設定はバックアップしてください）
        - ${HOME}/Downloads/typrm.zip
        - ${HOME}/Downloads/typrm-master
        - ${HOME}/Downloads/typrm-develop（存在する場合のみ）

### mac の場合

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - ダウンロードしたファイル（例：node-v14.16.0.pkg）を開きます
        - インストール オプションはデフォルトを使用

    typrm をダウンロードして展開し、typrm が使う Node.js パッケージをインストールします:
        #// Launchpad >> Terminal
        cd  "${HOME}/Downloads"
        setopt interactivecomments
            #// enables comment symbol (#)
        curl -o "typrm.zip"  -kL https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip 
            #// develop ブランチの場合は、master.zip を develop.zip に変更して実行してください
        rm -rf  "typrm-master"  #// 初めてインストールするときは実行不要です
            #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください
        unzip -o  "typrm.zip"
        cd  "typrm-master"
            #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください

        npm install --only=production

    PATH が通ったフォルダーに typrm を起動する スクリプト ファイル を作ります:
        script="${HOME}/bin/typrm"
        cd  "${HOME}/Downloads/typrm-master"  #// Zip ファイルを展開したフォルダー
            #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください
        typrm_folder="${HOME}/Documents/typrm"
        mkdir -p "${HOME}/bin"
        rm -f  "${script}"  #// 初めてインストールするときは実行不要です

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

    必要に応じて環境変数 TYPRM_COMMAND_SYMBOL, TYPRM_COMMAND_FOLDER, TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER を設定します

    アンインストールする場合、下記のファイルやフォルダーを削除し、不要なら Node.js をアンインストールします。
        - rm  "${HOME}/bin/typrm" （固有の設定はバックアップしてください）
        - rm  "${HOME}/Downloads/typrm.zip"
        - rm -rf  "${HOME}/Downloads/typrm-master"
        - rm -rf  "${HOME}/Downloads/typrm-develop"（存在する場合のみ）

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
        - sudo ln -s  node-v14.17.6-linux-x64  node  #// 新旧バージョンと共存し、主に使わないときは不要
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
            #// develop ブランチの場合は、master.zip を develop.zip に変更して実行してください
        rm -f  "typrm.zip"  #// 初めてインストールするときは実行不要です
        mv  "master.zip"  "typrm.zip"
        rm -rf  "typrm-master"  #// 初めてインストールするときは実行不要です
            #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください
        unzip -o  "typrm.zip"
        cd  "typrm-master"
            #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください

        npm install --only=production

    PATH が通ったフォルダーに typrm を起動する bash スクリプト ファイル を作ります:
        script="${HOME}/bin/typrm"
        cd  "${HOME}/Downloads/typrm-master"  #// Zip ファイルを展開したフォルダー
            #// develop ブランチの場合は、typrm-master を typrm-develop に変更して実行してください
        typrm_folder="${HOME}/Documents/typrm"
        mkdir -p "${HOME}/bin"
        rm -f  "${script}"  #// 初めてインストールするときは実行不要です

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

    必要に応じて環境変数 TYPRM_COMMAND_SYMBOL, TYPRM_COMMAND_FOLDER, TYPRM_THESAURUS, TYPRM_VERB, TYPRM_LINE_NUM_GETTER を設定します

    （使わなくなったら）typrm を削除します:
        - rm  "${HOME}/bin/typrm"   （固有の設定はバックアップしてください）
        - rm  "${HOME}/Downloads/typrm.zip"
        - rm -rf  "${HOME}/Downloads/typrm-master"
        - rm -rf  "${HOME}/Downloads/typrm-develop"  （存在する場合のみ）


## 設定タグと #template タグを使って設定値を置き換えます

置き換えるテキストは、`#settings:` が書かれた行の下に、
インデントを深くして `変数名: 値` を書きます。

    設定: #settings:
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

    設定: #settings:
        __ProjectName__: react1
    cd  "react1"  #template: "__ProjectName__"

`__ProjectName__` を react2 に置き換えるときに、置き換えた後にマッチするサンプル:

    設定: #settings:
        __ProjectName__: react1
    cd  "react2"  #template: "__ProjectName__"

`"react1"` にマッチしないために、エラーになるサンプル:

    設定: #settings:
        __ProjectName__: react1
    cd  "react11"  #template: "__ProjectName__"

なお、上記の場合、`#template:` タグの値を " " で囲まないとエラーになりませんが、目視で正しいと判断できれば囲む必要はありません。

    設定: #settings:
        __ProjectName__: react1
    cd  "react1"  #template: __ProjectName__

` #`（空白と#）は次のタグまたはコメントとして解釈されます。
テンプレートに ` #`（空白と#）を含めるときは、`%` でエスケープします。
`"%20"#` と書いてください。
`#keyword:` タグのパラメーターに `"%20"#` と書くと `#` から始まる次の単語になります。
`"%` を含むテンプレートを指定するときは、`""%25"` と書いてください。

    cd  "react1 #"  <!-- #template: __ProjectName__"%20"# #-->


### 変数名の一部を別の変数から参照します - #same-as タグ

参照する変数の名前の一部を別の変数の値から参照することで、デフォルトの変数を定義します。
`#same-as:` タグに参照先の変数名を指定しますが、
参照先の変数名の一部を他の変数の値にするときは、
一部の部分に `{$settings.（変数名）}` を指定します。

下記の場合、`__C_S__` 変数の値によって、デフォルトの変数 `__Operation__` の値が
`__OperationClient__` 変数の値と同じか `__OperationServer__` 変数の値と同じになります。
`#to:` タグで `__C_S__` 変数の値を変えたら、`__Operation__` 変数の値も変わります。

    settings: #settings:
        __Operation__: OC  #same-as: __Operation{$settings.__C_S__}__
        __C_S__: Client  #// Client or Server
        __OperationClient__: OC
        __OperationServer__: OS


### 設定の詳細

- 一部の行のインデントを別の行よりも深くすることもできますが、オブジェクトにはなりません
- 値の指定がない変数は定義できません。`変数名:` だけの行は変数を定義しません
- 変数名や値に # を含めることはできません
    空白文字によるインデントのツリー構造において、
    変数を定義した `#settings:` の親ノードの子孫…ノードから参照できます。
    親方向にある `#settings:` で定義した変数と同じ名前の変数が
    子方向にある `#settings:` でも定義されていたら、子方向で定義した値が参照されます。

サンプル

    設定: #settings:
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

### #template-if タグ - 条件を満たしているかどうかの記号を置き換えます

多くのマニュアルは、条件によって読み飛ばす部分があります。
たとえば、Windows で操作するときの説明文と mac で操作するときの説明文が
書いてあるマニュアルです。
そういったマニュアルの場合、読むべき説明文は、どちらか一方だけです。

`#template-if:` タグを使えば、読むべき文節か読まなくてもよい文節かを
記号を見るだけで判断できるようになります。
その記号などは `template-if(yes)` 変数の値と `template-if(no)` 変数の値に設定します。

    設定: #settings:
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

    設定: #settings:
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
また、`check` コマンドは `#to:` タグと `#original:` タグを一覧します。

    typrm check
<!-- -->
    typrm check __FileName__

typrm は、設定値を置き換える範囲を正しく判定するために、
置き換える前に、置き換える前の設定値を適用したテキストが存在することをチェックします。

- `#template:` タグによるテンプレートの適用先の内容のチェックを行います
- `--verbose` オプションを指定すると、typrm が行う内部処理の詳細も表示します
- `#file-template:` タグによるファイルの内容のチェックも行います
- `#copy:` タグの対象の文章が同じであることのチェックも行います
- replace コマンドを実行したときの対象となる `#to:` タグを一覧します
- reset コマンドを実行したときの対象となる `#original:` タグを一覧します


## mutual-search コマンド - リンク元も含めて検索して、リンク関係を維持します

`mutual-search` コマンドは、下記に示すリンク関係を維持するために使います。
短いコマンド名は `m` です。
typrm shell の中では `#mutual:` とキーワードを入力します。

    typrm mutual-search example detail
<!-- -->
    typrm m example detail
<!-- -->
    typrm keyword: #mutual: example detail

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


## #file-template タグを使ってファイルの内容をチェックします

別のファイルの内容が設定値に合っていることをチェックすることができます。

チェックするときは、
`check` コマンドを使います。短いコマンド名は `c` です。

    typrm check __FileName__

たとえば、下記にように書くと、`my.json` ファイルの中の設定値が、
`#settings:` タグに書かれた設定値と同じことをチェックするようになります。
同じでなければ check コマンドを実行したときにエラーが表示されます。

`__Project__/root.yaml` ファイル:

    ./my.json の一部:  #file-template: ./my.json
        "stage": "develop"  #template: "__Stage__"
    設定: #settings:
        __Stage__: develop

`__Project__`/my.json ファイル:

    {
        "stage": "develop"
    }

もし、設定を下記のように変更したら、エラーになります。

`__Project__/root.yaml` ファイル:

    設定: #settings:
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

複数のファイルでチェックする内容が同じ場合、
`#file-template:` タグを含む行を複数書いて、
最後にチェックする内容を書きます。
下記の場合、./my.json ファイルと ./your.json ファイルの両方について
チェック内容を比較します。

    ./my.json の一部:  #file-template: ./my.json
    ./your.json の一部:  #file-template: ./your.json
        チェック内容
        チェック内容
        チェック内容
    チェックしない内容

上記は下記と同じ処理を行います。

    ./my.json の一部:  #file-template: ./my.json
        チェック内容
        チェック内容
        チェック内容
    ./your.json の一部:  #file-template: ./your.json
        チェック内容
        チェック内容
        チェック内容
    チェックしない内容

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

タブ幅（空白文字の数）の違いがあってもエラーにはなりません。
YAML のマップのシーケンスを表すハイフンの右の空白文字の数も
違いがあってもエラーにはなりません。

`__Project__/root.yaml` ファイル:

    ./target.yaml の一部:  #file-template: ./target.yaml
        name space:
            interfaces:
            objects:
                -   fieldA:
                    fieldB:
                -   fieldA:
                    fieldB:

`__Project__/target.yaml` ファイル:

    name space:
      interfaces:
      objects:
        - fieldA:
          fieldB:
        - fieldA:
          fieldB:

`#enable-file-template-if-exist:` タグとパスを浅いインデントの行に書くと、
指定したパスにファイルまたはフォルダーが存在しないときに、
`#file-template:` タグによるファイルの内容のチェックをしないようになります。

    check:  #enable-file-template-if-exist: ./build/
        ./build/my.json の一部:  #file-template: ./build/my.json
            "stage": "develop"


## #copy タグを使って文章が同じことをチェックします

2箇所以上に `#copy:` タグを書くと、
対象となる文章が同じ文章であることをチェックすることができます。

チェックするときは、
`check` コマンドを使います。短いコマンド名は `c` です。

    typrm check __FileName__

たとえば、下記にように `#copy:` タグを書くと、
`#copy:` タグがある行より下の深いインデントの行が
同じ文章であることをチェックするようになります。
同じでなければ check コマンドを実行したときにエラーが表示されます。

    1: | #copy: first command
        mkdir -p  projectA
        cd        projectA
    2: | #copy: first command
        mkdir -p  projectA
        cd        projectA

上記はエラーになりません。
下記はエラーになります。

    1: | #copy: first command
        mkdir -p  projectA
        cd        projectA
    2: | #copy: first command
        mkdir -p  projectA
        cd        projectB  #// エラー！

同じ内容を1箇所に集めることで修正が1箇所で済むようになりますが、
読む人にとってはその1箇所へのリンクをたどらなければならないデメリットがあります。
`#copy:` タグを使うことによって修正漏れを無くすことができます。

一部を置き換えた内容が正しいとする場合、

- テンプレートとする内容に `#copy-template:` タグを書きます
- パラメーターを YAML のマッピング形式でコンマの右に指定します
  （下記 `{__Project__: projectA}`）
- 置き換える部分に `#template:` タグを書きます。
  `#copy:` タグのブロックの中には `#template:` タグを書きません
<!-- -->

    1: | #copy-template: command, {__Project__: projectA}
        mkdir -p  projectA  #template: __Project__
        cd        projectA  #template: __Project__
    2: | #copy: first command, {__Project__: projectB}
        mkdir -p  projectB
        cd        projectB

`#copy-template:` タグのブロックの中の
`#template:` タグから `#settings:` タグで定義された変数を参照することもできます。
`#copy:` タグの対象となる `#copy-template:` タグがない場合、
すべての `#copy:` タグの両方のブロックの中に `#template:` タグと参照する変数を書きます。

    original:
        settings: #settings:
            __Variable__: projectA

        body1: | #copy-template: There is a copy template
            mkdir -p  projectA  #template: __Variable__
            cd        projectA  #template: __Variable__

        body2: | #copy: without template
            mkdir -p  projectA  #template: __Variable__
            cd        projectA  #template: __Variable__
    copy:
        settings: #settings:
            __Variable__: projectB

        body1: | #copy: There is a copy template
            mkdir -p  projectB
            cd        projectB

        body2: | #copy: without template
            mkdir -p  projectB  #template: __Variable__
            cd        projectB  #template: __Variable__

すべての `#copy-template:` タグや `#copy:` タグのブロックの中から
常に変数を参照するわけではない場合は、パラメーターに変数を指定します。
指定するときは、`$settings.` に続けて変数名を書きます。

    settings: #settings:
        __VariableA__: projectB
    1: | #copy: first command, {__Project__: $settings.__VariableA__}
        mkdir -p  projectB
        cd        projectB
    2: | #copy-template: command, {__Project__: projectA}
        mkdir -p  projectA  #template: __Project__
        cd        projectA  #template: __Project__

`#keyword:` タグの有無の違いや `#keyword:` タグの内容に違いがあっても
同じ文章であると判定します。
理由は、`#keyword:` タグを 1つの
`#copy-template:` タグのブロックの中だけに付けるができることで、
複数の場所が検索されてしまうことを避けられるようにするためです。

## #if タグを使って条件を設定します

ある設定値と別の設定値の間に関連があるときは、
`#settings:` の中に `#if:` タグを書いて、
条件に応じた値を設定することができます。

    設定: #settings:
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

`__SettingsName__` は、`#settings:` に書かれている変数名です。
`__EnvName__` は、環境変数名です。
環境変数が定義されていないときは "" になります。
たとえば、Windows であるという条件は、Windows でデフォルトで定義されていて
Windows 以外では定義しない環境変数 `windir` を使って下記のように書きます。

    #if: $env.windir != ""

設定の外に `#if:` タグを書くと、条件を満たしたときだけ、
`#template:` タグや `#file-template:` タグによる内容が
合っているかどうかのチェックをするようになります。

    設定: #settings:
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

    設定: #settings:
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

typrm の search コマンドのパラメーターや、typrm shell のプロンプトに、
`#ref:` と環境変数を含むパスを入力すると、コピー＆ペーストできるパスが表示されます。
なお、コマンドラインに指定する `#` と `$` は `\` でエスケープする必要があります。

    $ typrm s \#ref: '${books}/manual/red_book_2021.pdf'
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder

    $ typrm s
    typrm keyword: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    typrm keyword or number:

環境変数の値は typrm を起動するときに設定します。
ただし、環境変数を設定するときの環境変数名にコマンド記号 `TYPRM_` を追加する必要があります。
追加しないとコマンドラインに `\` でエスケープしない `$` で参照することはできますが、
typrm shell では参照できなくなります。
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
    typrm keyword: #ref: C:\Users\user1\Documents\books\manual\red_book_2021.pdf
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

ただし、コマンドを実行するには、作業フォルダー（カレント フォルダー）を環境変数 `TYPRM_COMMAND_FOLDER`
に設定する必要があります。

typrm shell に入って `#ref:` タグでファイルのパスを表示したら、
プロンプトが keyword or number: に変わります。
この状態で数字だけを入力するとコマンドを実行します。
数字以外を入力するとプロンプトが keyword: のときと同じことができます。

    $ typrm s
    typrm keyword: #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    typrm keyword or number: 0

検索結果の中の第1候補の行（最も下の行）に `#ref:` タグが含まれたときも、
ファイルに関連するコマンドを選ぶことができます。

    $ typrm s
    typrm keyword: red book
    .../books.yaml:32: #keyword: red book  #ref: ${books}/manual/red_book_2021.pdf
    C:/Users/user1/Documents/books/manual/red_book_2021.pdf
        0.Folder
    typrm keyword or number: 0

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
| ${existingAddress} | #ref: のパラメーター、または、存在する親フォルダー |
| ${windowsExistingAddress} | スラッシュをバックスラッシュに置き換えた #ref: のパラメーター、または、存在する親フォルダー |
| ${fragment} | #ref: のパラメーターの # より右 |
| ${lineNum} | 行番号。`TYPRM_LINE_NUM_GETTER` 環境変数の設定が必要です |

typrm に --verbose オプションを付けると、設定値を確認できます。


### ファイルの中を検索して行番号に置き換えて表示します

search (s) コマンドに `#ref:` タグを付けてファイルのパスとパラメーターを指定すると、
ファイルのパスと行番号に置き換えて表示します。
検索キーワード入力モード (typrm shell) で入力しても表示できます。

    $ typrm s \#ref: '${projects}/project1/src/app.ts#main'
    C:/Users/user1/Projects/project1/src/app.ts:25
        0.Folder

`#` より右側は検索キーワードとしてファイルの内容を検索して行番号に置き換えて表示します。
上記の場合、`app.ts` ファイルの内容を `main` というキーワードで検索して、
見つかった行番号 `25` を表示します。

行番号に置き換えて表示するには、
`TYPRM_LINE_NUM_GETTER` 環境変数に以下のような YAML を設定します。
ただし、`regularExpression` の設定は環境に応じて編集してください。
`#ref:` タグの値が複数の `regularExpression` にマッチした場合、上に書かれた設定が優先されます。
`type` が `keep` に設定されている `regularExpression` にマッチした場合は、行番号に置き換えません。

Windows の PowerShell の場合:

    ${env:TYPRM_LINE_NUM_GETTER} = @"
        - #
            regularExpression: ^(.*\.(pdf|html))(:csv)?(:id=([0-9]+))?(#(.*))?`$
            type: keep
            filePathRegularExpressionIndex: 1
        - #
            regularExpression: ^(.*?)(:csv)?(:id=([0-9]+))?(#(.*))?`$
            type: text
            filePathRegularExpressionIndex: 1
            keywordRegularExpressionIndex: 6
            csvOptionRegularExpressionIndex: 2
            targetMatchIdRegularExpressionIndex: 4
            address: "`${file}:`${lineNum}"
    "@

    node --experimental-modules --es-module-specifier-resolution=node  C:\Users\____\Downloads\typrm-master\build\typrm.js $PsBoundParameters.Values $args

bash, zsh の場合:

    export  TYPRM_LINE_NUM_GETTER=$(cat <<- '__HERE_DOCUMENT__'
        - #
            regularExpression: ^(.*\.(pdf|html))(:csv)?(:id=([0-9]+))?(#(.*))?$
            type: keep
            filePathRegularExpressionIndex: 1
        - #
            regularExpression: ^(.*?)(:csv)?(:id=([0-9]+))?(#(.*))?$
            type: text
            filePathRegularExpressionIndex: 1
            keywordRegularExpressionIndex: 6
            csvOptionRegularExpressionIndex: 2
            targetMatchIdRegularExpressionIndex: 4
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


### 画像の中の注目すべき場所にポインターを付けて表示します

search (s) コマンドに `#ref:` タグを付けて画像ファイルのパスと
注目すべき位置を クエリー パラメーター で指定すると、
注目すべき位置にポインター（赤い丸）を合成した画像ファイルを作り、
その画像ファイルへのパスを表示します。
検索キーワード入力モード (typrm shell) で入力しても表示できます。

    $ typrm s \#ref: '${projects}/example/figure_1.png?name=example&x=404&y=70'
    C:/Users/user1/tmp/figpoint/figure_1_example_404_70.png

| パラメーター名 | 内容 |
| ------------ | ---- |
| name | ファイル名の一部。省略可能 |
| x | 左上を原点とした X座標 |
| y | 左上を原点とした Y座標 |

ポインターを付けて画像を表示するには、
`TYPRM_LINE_NUM_GETTER` 環境変数に以下のような YAML を設定します。
ただし、`regularExpression` の設定は環境に応じて編集してください。

Windows の PowerShell の場合:

    ${env:TYPRM_LINE_NUM_GETTER} = @"
        - #
            regularExpression: ^(.*\.(jpg|jpeg|png))\?(name=([^&]*)&)?x=([0-9]+)&y=([0-9]+)`$
            type: figure
            filePathRegularExpressionIndex: 1
            nameExpressionIndex: 4
            xExpressionIndex: 5
            yExpressionIndex: 6
            pointerImage: C:\Users\user1\GitProjects\GitHub\figpoint\test\pointer_100x100.png
            outputFolder: C:\Users\user1\tmp\figpoint
    "@

bash, zsh の場合:

    export  TYPRM_LINE_NUM_GETTER=$(cat <<- '__HERE_DOCUMENT__'
        - #
            regularExpression: ^(.*\.(jpg|jpeg|png))\?(name=([^&]*)&)?x=([0-9]+)&y=([0-9]+)$
            type: figure
            filePathRegularExpressionIndex: 1
            nameExpressionIndex: 4
            xExpressionIndex: 5
            yExpressionIndex: 6
            pointerImage: /Users/user1/GitProjects/GitHub/figpoint/test/pointer_100x100.png
            outputFolder: /Users/user1/tmp/figpoint
    __HERE_DOCUMENT__
    )

`type` には、`figure` を指定します。

`filePathRegularExpressionIndex` には、`regularExpression`（正規表現）で
評価した結果のうち、ファイル パス の部分に該当するカッコの番号を指定します。
括弧の番号は、JavaScript の
[RegExp.exec (MDN)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#description) の仕様と同じです。

`nameExpressionIndex` には、ファイル名の一部に相当するカッコの番号を指定します。

`xExpressionIndex` には、X 座標の部分に相当するカッコの番号を指定します。

`yExpressionIndex` には、Y 座標の部分に相当するカッコの番号を指定します。

`pointerImage` には、注目すべき位置を示すポインター画像のパスを指定します。

`outputFolder` には、ポインター画像を合成した画像を格納するフォルダーのパスを指定します。

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
- defaultUsesLineNumGetter = true のケースと false のケースの両方でテストを実行します
- （終了するときは）Terminal タブ（下）>> ゴミ箱アイコン（右）

### Jest を使わないテスト

- Visual Studio Code >> F5 キー


## タグ一覧

- `#copy:` 同じ文章であることをチェックします
- `#copy-template:` copy タグのブロックの中に書かれる文章のテンプレート
- `#disable-tag-tool:` 同じ行にあるタグを無効にします
- `#enable-file-template-if-exist:` フォルダーがあるときだけファイルの内容をチェックします
- `#expect:` 条件チェック
- `#file-template:` ファイルの内容をチェックするときのテンプレート
- `#file-template-any-lines:` ファイルの内容をチェックしない行
- `#glossary:` 子要素にあるキーを検索対象のキーワードにします
- `#if:` タグを有効にする条件
- `#keyword:` 検索対象のキーワード
- `#original:` 置き換える前の値
- `#ref:` リンク先のファイルのパス
- `#score:` 検索スコアを変更します
- `#search:` リンク先を検索するときのキーワード
- `#(search)if:` 検索を有効にする条件（非推奨、#score:推奨）
- `#settings:` 変数の設定
- `#snippet-depth:` スニペットのインデントの深さ
- `#template:` 本文を置き換えるときのテンプレート
- `#template-at():` 2行以上上の本文を置き換えるときのテンプレート
- `#template-if:` 本文に入れる内容を決める条件
- `#to:` 置き換えた後の値

タグの前は空白文字、または行頭である必要があります。

タグの詳細については、このページを検索してください。

## 環境変数一覧

- `TYPRM_COMMAND_FOLDER` 任意のコマンドを実行するときの カレント フォルダー
- `TYPRM_COMMAND_SYMBOL` 任意のコマンドを実行するときに入力する文字
- `TYPRM_FOLDER` 検索対象のフォルダー
- `TYPRM_FOUND_COUNT_MAX` 検索結果に表示される最大の件数
- `TYPRM_LINE_NUM_GETTER` `#ref:` タグに指定したキーワードで検索する設定
- `TYPRM_OPEN_DOCUMENT` 検索後に # と数字で開くときのコマンド
- `TYPRM_SNIPPET_LINE_COUNT` スニペットを表示する最大の行数
- `TYPRM_THESAURUS` シソーラス ファイル のパス
- `TYPRM_VERB` 検索された行に `#ref:` タグが含まれたときにメニューから実行するコマンド
- `TYPRM_WORD_SEPARATORS` 検索対象の単語の区切り文字の並び。規定は `` ~!^&*#()=+[{]}\\|;: '"`,.<>/?　、。（）「」【】``

環境変数の詳細については、このページを検索してください。
