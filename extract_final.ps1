$jsonPath = 'C:\Users\lusha\Desktop\博客\yuque_appdata.json'
$appData = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
$doc = $appData.doc

# Check ALL properties for content
Write-Output "=== Checking ALL doc properties for non-empty content ==="
foreach ($prop in $doc.PSObject.Properties) {
    $val = $prop.Value
    $type = if ($null -eq $val) { "NULL" } else { $val.GetType().FullName }
    if ($val -is [string]) {
        $len = $val.Length
        if ($len -gt 0) {
            Write-Output "$($prop.Name): string, length=$len, first 100: $($val.Substring(0, [Math]::Min(100, $len)))"
        }
    } elseif ($val -is [array]) {
        Write-Output "$($prop.Name): array, count=$($val.Count)"
    } elseif ($val -is [System.Management.Automation.PSCustomObject]) {
        $subProps = $val.PSObject.Properties | ForEach-Object { $_.Name }
        Write-Output "$($prop.Name): object with properties: $($subProps -join ', ')"
    } elseif ($null -eq $val) {
        Write-Output "$($prop.Name): NULL"
    } else {
        Write-Output "$($prop.Name): $type"
    }
}

# Also check the book property
Write-Output ""
Write-Output "=== Book info ==="
$book = $appData.book
if ($book) {
    Write-Output "Book name: $($book.name)"
    Write-Output "Book description: $($book.description)"
}

# Check the overall document description
Write-Output ""
Write-Output "=== Doc title ==="
Write-Output $doc.title
Write-Output "Description: $($doc.description)"
Write-Output "Custom description: $($doc.custom_description)"
Write-Output "Format: $($doc.format)"
Write-Output "Word count: $($doc.word_count)"
Write-Output "Published at: $($doc.published_at)"
Write-Output "First published at: $($doc.first_published_at)"
Write-Output "Premium days: $($doc.premium_days_count)"

# Check if this is truly premium/encrypted
if ($doc.PSObject.Properties['encrypted_premium_body']) {
    $enc = $doc.encrypted_premium_body
    Write-Output "encrypted_premium_body present, length: $(if ($enc -is [string]) { $enc.Length } else { 'not string' })"
}
if ($doc.PSObject.Properties['encrypted_premium_body_asl']) {
    $enc2 = $doc.encrypted_premium_body_asl
    Write-Output "encrypted_premium_body_asl present, length: $(if ($enc2 -is [string]) { $enc2.Length } else { 'not string' })"
}
