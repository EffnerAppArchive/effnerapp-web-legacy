versionFile='../release/ios.json'
iOSFile='../ios/App/App.xcodeproj/project.pbxproj'
settingsFile='../src/views/fragments/Settings.vue'

versionName=$(jq '.versionName' $versionFile | sed 's/\"//g')
versionCodeIos=$(jq '.versionCode' $versionFile)

echo "$versionName", "$versionCodeIos"

# Replace values in iOS project file
sed -i'.backup' -e "s/##VERSIONNAME##/$versionName/g" $iOSFile
sed -i'.backup' -e "s/696969/$versionCodeIos/g" $iOSFile

# Replace version code in app
sed -i'.backup' -e "s/##VERSIONNAME##/$versionName/g" $settingsFile

