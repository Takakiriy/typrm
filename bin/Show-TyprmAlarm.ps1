function Main {
    Watch-CommandOutput -Command "typrm check-alarm --x-seconds-before 60" `
        -WatchPattern "#alarm:" -NotificationTitle "typrm アラーム" `
        -NotificationMessage "#alarm タグに設定した日時になりました" `
        -ContinuousWatch -IntervalSeconds 60
}

function Watch-CommandOutput {
    param (
        [Parameter(Mandatory = $true)]
        [string]${Command},                    # 実行するコマンド
        [Parameter(Mandatory = $true)]
        [string]${WatchPattern},              # 監視するパターン
        [string]${NotificationTitle} = "検知通知",
        [string]${NotificationMessage} = "指定したパターンが検出されました",
        [switch]${ContinuousWatch} = $false,
        [int]${IntervalSeconds} = 60
    )

    function Watch-CommandOutputMain {
        if (${ContinuousWatch}) {
            Write-Host "継続的な監視を開始します。間隔: ${IntervalSeconds}秒" -ForegroundColor Cyan
            while ($true) {

                Invoke-SingleWatch
                Start-Sleep -Seconds ${IntervalSeconds}
            }
        }
        else {
            Invoke-SingleWatch
        }
    }

    function Invoke-SingleWatch {
        try {

            ${output} = Invoke-Expression ${Command} | Out-String
            if (${output} -match ${WatchPattern}) {
                ${matchedMessage} = (${output} -replace "^.*:[0-9]+: +([^ ]*) *#alarm:.*`$", "`$1")
                ${matchedLines} = [regex]::Matches(${output}, ${WatchPattern})

                Show-Notification -Title ${NotificationTitle} -Message "${NotificationMessage}`n${matchedMessage}" -Type "Info"
                
                Write-Host "パターンマッチ:" -ForegroundColor Green
                foreach (${match} in $matchedLines) {
                    Write-Host ${match}.Value -ForegroundColor Yellow
                }
            }
        }
        catch {
            Show-Notification -Title "エラー" -Message "コマンド実行中にエラーが発生しました: $_" -Type "Error"
            Write-Error $_
        }
    }

    Watch-CommandOutputMain
}

function Show-Notification {
    param (
        [string]${Title} = "通知",
        [string]${Message} = "これは通知メッセージです",
        [ValidateSet('Info', 'Warning', 'Error')]
        [string]${Type} = "Info"
    )

    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
    ${AppId} = "{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe"
    ${ToastXml} = @"
    <toast>
        <visual>
            <binding template="ToastGeneric">
                <text>${Title}</text>
                <text>${Message}</text>
            </binding>
        </visual>
    </toast>
"@
    ${XmlDoc} = New-Object Windows.Data.Xml.Dom.XmlDocument
    ${XmlDoc}.LoadXml(${ToastXml})
    ${Toast} = [Windows.UI.Notifications.ToastNotification]::new(${XmlDoc})

    #// Show toast notification
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier(${AppId}).Show(${Toast})
}

function Initialize-Global {
    if (${PSVersionTable}.PSVersion.Major -le 5) {
        ${OutputEncoding} = [System.Text.Encoding]::UTF8  #// Input encodeing of native command (non-PowerShell program)
        [System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8  #// Output encoding of native command and console (terminal).
    }
}

Initialize-Global
Main
