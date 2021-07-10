npx ionic capacitor sync android
npx ionic capacitor copy android

# copy pre-generated MainActivity.java to android source for dark-mode functionality
yes | cp -rf scripts/.src/MainActivity.java android/app/src/main/java/app/effner/web/
