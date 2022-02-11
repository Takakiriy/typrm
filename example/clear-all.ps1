#// PowerShell: ${env:USERPROFILE}\AppData\Local\Microsoft\WindowsApps\clear-all.ps1
    #// Clear the screen and the screen buffer.
        clear
    #// Clear command history except for this script.
        [Microsoft.PowerShell.PSConsoleReadLine]::ClearHistory()
        #// The history in typrm shell is not cleared. But it is not necessary to input secrets.
    #// Clear clipboard.
        $null | Set-Clipboard
    #// Show the finished message.
        echo Clear!
