# typrm
<!-- Character Encoding: "WHITE SQUARE" U+25A1 is □. -->

typrm は テキスト ファイル に書いたキーボードから手動で入力する内容のパラメーターを置き換えます。
同じ内容にすべきテキストを同じように置き換えるため、入力ミスが少なくなります。

<!-- TOC depthFrom:1 -->

- [typrm](#typrm)
  - [最初のサンプル](#最初のサンプル)
  - [インストール](#インストール)
    - [Windows の場合](#windows-の場合)
    - [mac の場合](#mac-の場合)
    - [CentOS 7 の場合](#centos-7-の場合)
  - [設定タグと #template タグについて](#設定タグと-template-タグについて)
  - [開発環境の構築手順](#開発環境の構築手順)
    - [Windows の場合](#windows-の場合-1)
    - [mac の場合](#mac-の場合-1)
    - [ホストOSが Windows、ゲストOSが CentOS 7 の場合](#ホストosが-windowsゲストosが-centos-7-の場合)

<!-- /TOC -->


## 最初のサンプル

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

typrm コマンドはこのように複数の箇所を一度に書き換えて、
コピー＆ペーストできるようにします。

typrm が使えるようにするには、ファイルを以下のようにします。

new_folder.yaml

    設定:
        __Name__: work1
    shell:
        mkdir work1  #template: __Name__
        cd    work1  #template: __Name__

`設定:` に変更する部分に関する 変数名: 値 を書きます。
変更する部分と同じ行の末尾に #template: タグを書きます。
（後で説明しますが、別の行に書くこともできます）

Windows の場合、typrm.bat をダブルクリックして、下記のように入力します。

    YAML UTF-8 ファイル パス> new_folder.yaml
    変更する変数値がある行番号 > 4
    変数名: 新しい変数値> __Name__: work2

ファイル パス は、キーボードから入力しなくても、
ファイルをドラッグ＆ドロップして入力できます。

行番号は `設定:` が書いてある部分より下、
次の `設定:` が書いてある行より上であれば、
どの行番号を入力しても構いません。

new_folder.yaml ファイルは次のような内容に変わります。

    設定:
        __Name__: work2
    shell:
        mkdir work2  #template: __Name__
        cd    work2  #template: __Name__

コメントの付いたテキストはそのまま貼り付けることができます。 # は
多くのシェルでコメントとして扱われます。

「変数名: 新しい変数値」を複数入力するときは、
複数行をコピー＆ペーストして連続入力することができます。


## インストール

typrm を使うには Node.js のインストールが必要です。

### Windows の場合

    typrm をダウンロードして展開します:
        - https://github.com/Takakiriy/typrm >> Code >> Download.ZIP

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> Windows Installer (.msi) >> 64-bit
        - ダウンロードしたファイル（例：node-v14.16.0-x64.exe）を開きます
        - インストール オプションはデフォルトを使用

    社内など、プロキシがある LAN に Windows がある場合:
        - Windows スタート >> PowerShell
        - npm config -g set proxy "http://___.___.___.___:____"
        - npm config -g set https-proxy "http://___.___.___.___:____"

    typrm が使う commander パッケージをインストールします:
        - Windows スタート >> PowerShell
        - npm install -g  commander

    bin フォルダーの中の typrm.bat ファイルをダブルクリックすると typrm が起動します:

### mac の場合

    typrm をダウンロードして展開します:
        - https://github.com/Takakiriy/typrm >> Code >> Download.ZIP

    Node.js をインストールします:
        - https://nodejs.org/ja/download/ >> macOS Installer (.pkg) >> 64-bit
        - ダウンロードしたファイル（例：node-v14.16.0.pkg）を開きます
        - インストール オプションはデフォルトを使用

    typrm が使う commander パッケージをインストールします:
        - Launchpad >> Terminal
        - sudo npm install -g  commander

    `typrm.command` ファイルに実行属性を追加します:
        - (ターミナルの続き)
        - cd bin  #// bin の部分は typrm の bin フォルダーをターミナルにドラッグ＆ドロップします
        - chmod +x typrm.command

    bin フォルダーの中の typrm.command ファイルをダブルクリックすると typrm が起動します:


### CentOS 7 の場合

    typrm をダウンロードして展開します:
        - cd  ~/Downloads
        - wget -O typrm.zip  https://github.com/Takakiriy/typrm/archive/refs/heads/master.zip
        - unzip -o typrm.zip

    Node.js をインストールします:
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

    typrm が使う commander パッケージをインストールします:
        - npm install -g commander

    `typrm.sh` ファイルに実行属性を追加して、PATH が通ったディレクトリにコピーします:
        - cd  typrm-master/bin
        - nano  typrm.sh : |  #// インストール先を変える場合
            node  ~/Downloads/typrm-master/build/typrm.js
        - chmod +x  typrm.sh
        - mkdir -p ~/bin
        - cp  typrm.sh  ~/bin/typrm

    typrm を実行します:
        - typrm

    （使わなくなったら）typrm を削除します:
        - rm ~/bin/typrm
        - rm ~/Downloads/typrm.zip
        - rm -rf ~/Downloads/typrm-master/


## 設定タグと #template タグについて

置き換えるテキストは、`設定:` が書かれた行の下に 変数名: 値 を書きます。

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


## 開発環境の構築手順

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

`typrm_test_1.ts` ファイルのテストを実行します:

    - ソース ファイルの行番号の左をクリックして、ブレーク ポイントを設定します
    - F5 キーを押します
    - （終了するときは）Terminal タブ（下）>> ゴミ箱アイコン（右）

`typrm.test.ts` ファイルのテスト(Jest)を実行します:

    - ソース ファイルの行番号の左をクリックして、ブレークポイントを設定します:
    - Jest のウォッチモードを起動します:
        メニュー: Visual Studio Code >> Terminal >> New Terminal >> 1: (shell) >> Create JavaScript Debug Terminal
        npm test --watch
            #// デバッガーを終了させてしまったら、Ctrl + C と npm test --watch で再起動してください
    - テストを再起動します:
        - Continue ボタン:  #// 最後まで実行します
        - npm test --watch が動いている Terminal で f キーを押します
    - （終了するときは）Terminal タブ（下）>> ゴミ箱アイコン（右）


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

fn + F5 キーを押すと、テストが動きます:


### ホストOSが Windows、ゲストOSが CentOS 7 の場合

typrm をインストールします:

    上記を参照

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

F5 キーを押すと、テストが動きます:
