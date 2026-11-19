param([string]$InputFile)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$items = Get-Content -LiteralPath $InputFile -Raw | ConvertFrom-Json
$results = @()
foreach($item in $items){
  $text=''; $status='filename-only'; $zip=$null
  try {
    $ext=[IO.Path]::GetExtension($item.path).ToLowerInvariant()
    if($ext -in @('.docx','.pptx','.xlsx')) {
      $zip=[IO.Compression.ZipFile]::OpenRead($item.path)
      $parts=@($zip.Entries | Where-Object { $_.FullName -match '^(word/document.xml|ppt/slides/slide[0-9]+.xml|xl/sharedStrings.xml|xl/worksheets/sheet[0-9]+.xml)$' })
      $chunks=@(); $size=0
      foreach($part in $parts){
        if($part.Length -gt 10000000){continue}
        $reader=[IO.StreamReader]::new($part.Open())
        try {$xml=[xml]$reader.ReadToEnd()} finally {$reader.Dispose()}
        $chunks += (($xml.SelectNodes('//*[local-name()="t" or local-name()="v"]') | ForEach-Object {$_.InnerText}) -join ' ')
        $size += $chunks[-1].Length
        if($size -gt 200000){break}
      }
      $text=($chunks -join ' '); $status='extracted'
    } elseif($ext -in @('.txt','.md','.csv')) {
      if((Get-Item -LiteralPath $item.path).Length -le 2000000){$text=[IO.File]::ReadAllText($item.path); $status='extracted'}
    }
    if($text.Length -gt 200000){$text=$text.Substring(0,200000)}
  } catch {$status='unreadable'} finally {if($zip){$zip.Dispose()}}
  $results += [pscustomobject]@{path=$item.path;text=$text;status=$status}
}
$json=ConvertTo-Json -InputObject $results -Depth 4 -Compress
[IO.File]::WriteAllText(($InputFile+'.result.json'),$json,[Text.UTF8Encoding]::new($false))
