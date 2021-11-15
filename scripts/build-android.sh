npx ionic build
npx cap copy android
npx cap sync

# temporary fix for push notifications on android
cat push-notifications/android/build.gradle > node_modules/@capacitor/push-notifications/android/build.gradle
