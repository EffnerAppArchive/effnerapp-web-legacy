versionFile='../release/versions.json'
iOSFile='../ios/App/App.xcodeproj/project.pbxproj'
androidFile='../android/app/build.gradle'

versionName=$(jq '.versionName' $versionFile | sed 's/\"//g')
versionCodeIos=$(jq '.versionCodes.iOS' $versionFile)
versionCodeAndroid=$(jq '.versionCodes.android' $versionFile)

echo "$versionName", "$versionCodeIos", "$versionCodeAndroid"

# Replace values in Android build.gradle
sed -i'.backup' -e "s/##VERSIONNAME##/$versionName/g" $androidFile
sed -i'.backup' -e "s/696969/$versionCodeAndroid/g" $androidFile
cat $androidFile

# Replace values in iOS project file
sed -i'.backup' -e "s/##VERSIONNAME##/$versionName/g" $iOSFile
sed -i'.backup' -e "s/696969/$versionCodeIos/g" $iOSFile
cat $iOSFile
