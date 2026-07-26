$jsonPath = 'C:\Users\lusha\Desktop\博客\yuque_appdata.json'
$appData = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
$doc = $appData.doc

# Check all string properties for content
$contentProps = @()
foreach ($prop in $doc.PSObject.Properties) {
    if ($prop.Value -is [string] -and $prop.Value.Length -gt 0) {
        $contentProps += [PSCustomObject]@{Name=$prop.Name; Length=$prop.Value.Length}
    }
}

Write-Output "=== String properties with content ==="
$contentProps | Sort-Object -Property Length -Descending | Format-Table -AutoSize

# Try body_html
if ($doc.PSObject.Properties['body_html']) {
    $bodyHtml = $doc.body_html
    Write-Output ""
    Write-Output "body_html length: $($bodyHtml.Length)"
    if ($bodyHtml.Length -gt 0) {
        # Clean HTML
        $text = $bodyHtml -replace '<[^>]+>', ' ' -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'" -replace '&nbsp;', ' '
        $text = $text -replace '\s+', ' '
        $text.Trim() | Set-Content -Path 'C:\Users\lusha\Desktop\博客\yuque_body_html.txt' -Encoding UTF8
        Write-Output "body_html first 2000 chars:"
        Write-Output $text.Trim().Substring(0, [Math]::Min(2000, $text.Trim().Length))
    }
}

# Also try body_asl and premium_body
if ($doc.PSObject.Properties['body_asl']) {
    $bodyAsl = $doc.body_asl
    Write-Output ""
    Write-Output "body_asl length: $($bodyAsl.Length)"
}
if ($doc.PSObject.Properties['premium_body']) {
    Write-Output ""
    Write-Output "premium_body length: $($doc.premium_body.Length)"
}
