versionFile='../release/ios.json'
iOSFile='../ios/App/App.xcodeproj/project.pbxproj'

versionName=$(jq '.versionName' $versionFile | sed 's/\"//g')
versionCodeIos=$(jq '.versionCode' $versionFile)

echo "$versionName", "$versionCodeIos"

# Replace values in iOS project file
sed -i'.backup' -e "s/##VERSIONNAME##/$versionName/g" $iOSFile
sed -i'.backup' -e "s/696969/$versionCodeIos/g" $iOSFile
cat $iOSFile
