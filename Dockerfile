FROM reactnativecommunity/react-native-android:latest

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install JS dependencies
RUN npm ci

# Copy entire project
COPY . .

# Accept Android licenses
RUN yes | sdkmanager --licenses > /dev/null 2>&1 || true

# Build the release APK
RUN cd android && chmod +x gradlew && ./gradlew assembleRelease --no-daemon -x lint

# Default command: copy APK to output volume
CMD ["sh", "-c", "cp /app/android/app/build/outputs/apk/release/app-release.apk /output/ 2>/dev/null || cp /app/android/app/build/outputs/apk/release/*.apk /output/ && echo 'APK copied to /output/'"]
