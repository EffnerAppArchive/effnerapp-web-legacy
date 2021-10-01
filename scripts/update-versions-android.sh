versionFile='../release/android.json'
androidFile='../android/app/build.gradle'
settingsFile='../src/views/fragments/Settings.vue'

versionName=$(jq '.versionName' $versionFile | sed 's/\"//g')
versionCodeAndroid=$(jq '.versionCode' $versionFile)

echo "$versionName", "$versionCodeAndroid"

# Replace values in Android build.gradle
sed -i'.backup' -e "s/##VERSIONNAME##/$versionName/g" $androidFile
sed -i'.backup' -e "s/696969/$versionCodeAndroid/g" $androidFile

# Replace version code in app
sed -i'.backup' -e "s/##VERSIONNAME##/$versionName/g" $settingsFile
