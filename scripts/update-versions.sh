versionFile='../versions.json'
iOSFile='../ios/App/App.xcodeproj/project.pbxproj'
androidFile='../android/app/build.gradle'

versionName=$(jq '.versionName' $versionFile)
message=$(jq '.message' $versionFile)
versionCodeIos=$(jq '.versionCodes.iOS' $versionFile)
versionCodeAndroid=$(jq '.versionCodes.android' $versionFile)

echo $versionName, $message, $versionCodeIos, $versionCodeAndroid

# Replace values in Android build.gradle
sed -i "s/##VERSIONNAME##/$versionName/gI" $androidFile
sed -i "s/696969/$versionCodeAndroid/gI" $androidFile
cat $androidFile

# Replace values in iOS project file
sed -i "s/##VERSIONNAME##/$versionName/gI" $iOSFile
sed -i "s/696969/$versionCodeIos/gI" $iOSFile
cat $iOSFile
