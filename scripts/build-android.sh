npx ionic build
npx cap add android
npx cap copy android
npx cap sync

# copy pre-generated MainActivity.java to android source for dark-mode functionality
yes | cp -rf scripts/.src/MainActivity.java android/app/src/main/java/de/effnerapp/effner/
