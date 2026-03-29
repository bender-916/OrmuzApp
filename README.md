# OrmuzApp — Guia del Desarrollador

App Android que muestra en un mapa interactivo los precios de gasolina en Espana, con marcadores color-coded (verde = barato, rojo = caro).

**Stack**: React Native 0.84.1 + TypeScript + MapLibre (OpenStreetMap) + API del Ministerio de Industria de Espana.

---

## Requisitos previos

| Herramienta | Version | Notas |
|-------------|---------|-------|
| **Node.js** | >= 22.11.0 | [nodejs.org](https://nodejs.org/) |
| **JDK** | 17+ | Recomendado: [Adoptium Temurin 17](https://adoptium.net/) |
| **Android Studio** | Ultima version | Para SDK, emulador y herramientas de build |
| **Android SDK** | 36 | Instalar desde Android Studio > SDK Manager |
| **Build Tools** | 36.0.0 | Instalar desde SDK Manager > SDK Tools |
| **NDK** | 27.1.12297006 | Instalar desde SDK Manager > SDK Tools |

### Variables de entorno (Windows)

Agregar a las variables de entorno del sistema:

```
ANDROID_HOME = C:\Users\<tu-usuario>\AppData\Local\Android\Sdk
JAVA_HOME    = C:\Program Files\Eclipse Adoptium\jdk-17.x.x
```

Agregar al `PATH`:

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

Verificar:

```bash
node --version    # >= 22.11.0
java -version     # >= 17
adb --version     # debe responder
```

---

## Instalacion del proyecto

```bash
cd E:\Ormuz-app
npm install
```

Verificar que el entorno esta completo:

```bash
npx react-native doctor
```

---

## Previsualizar la app

### Opcion A: Dispositivo fisico por USB (recomendado)

La opcion mas rapida y fiel a la experiencia real. **Ideal para OrmuzApp** porque permite probar GPS real y rendimiento real del mapa MapLibre.

1. En el telefono Android, ve a **Ajustes > Acerca del telefono** y toca 7 veces **Numero de compilacion** para activar Opciones de desarrollador.
2. En **Opciones de desarrollador**, activa **Depuracion USB**.
3. Conecta el telefono por USB al PC.
4. Verifica la conexion:

```bash
adb devices
# Debe mostrar tu dispositivo en la lista
```

5. Inicia Metro y la app:

```bash
# Terminal 1: servidor Metro
npm start

# Terminal 2: build e instalar en dispositivo
npm run android
```

6. La app se instala automaticamente y se abre. Los cambios en codigo se reflejan al instante gracias a **Fast Refresh**.

> **Tip**: Si tienes problemas de conexion, prueba `adb reverse tcp:8081 tcp:8081` para el tunel Metro.

---

### Opcion B: Emulador Android (Android Studio AVD)

Buena alternativa cuando no tienes un dispositivo fisico a mano.

1. Abre Android Studio > **Tools > Device Manager** (antes AVD Manager).
2. Crea un nuevo dispositivo virtual:
   - Hardware: **Pixel 7** (o similar)
   - System Image: **API 34+** (con Google APIs si quieres Google Play)
   - RAM: al menos 2 GB asignados al emulador
3. Lanza el emulador desde Device Manager.
4. Ejecuta:

```bash
npm start
npm run android
```

> **Nota**: El emulador consume ~4-8 GB de RAM. El GPS es simulado (puedes configurar coordenadas ficticias desde los controles extendidos del emulador con `...` > Location).

---

### Opcion C: Build APK debug e instalar manualmente

Util para compartir el APK o instalar en un dispositivo sin conexion USB directa.

```bash
cd android && ./gradlew assembleDebug
```

El APK se genera en:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Instalar en dispositivo conectado:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

O transferir el archivo `.apk` al telefono e instalarlo manualmente (requiere activar "Origenes desconocidos" en ajustes de seguridad).

---

### Opcion D: Build con Docker (produccion)

Para generar el APK release sin necesidad de instalar Android SDK localmente.

```bash
docker-compose up --build
```

El APK resultante queda en:

```
./output/app-release-unsigned.apk
```

---

## Comandos utiles

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Inicia el servidor Metro (bundler JS) |
| `npm run android` | Compila e instala en dispositivo/emulador Android |
| `npm run lint` | Ejecuta ESLint sobre el codigo |
| `npm test` | Ejecuta tests con Jest |
| `cd android && ./gradlew assembleDebug` | Genera APK debug |
| `cd android && ./gradlew assembleRelease` | Genera APK release |
| `adb devices` | Lista dispositivos Android conectados |
| `adb logcat *:E` | Muestra logs de errores del dispositivo |
| `adb reverse tcp:8081 tcp:8081` | Tunel para Metro cuando el dispositivo no lo detecta |
| `npx react-native doctor` | Diagnostica problemas del entorno |

### Atajos en la app (modo desarrollo)

- **Ctrl + M** (en dispositivo/emulador): Abre el Dev Menu de React Native
- **R R** (doble R): Recarga completa de la app
- Fast Refresh se activa automaticamente al guardar archivos

---

## Estructura del proyecto

```
E:/Ormuz-app/
├── App.tsx                         # Componente raiz
├── index.js                        # Entry point React Native
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Config TypeScript
├── babel.config.js                 # Config Babel (incluye reanimated plugin)
├── metro.config.js                 # Config Metro bundler
├── Dockerfile                      # Build APK en Docker
├── docker-compose.yml              # Orquestacion Docker
├── android/                        # Codigo nativo Android
│   ├── build.gradle                # Config Gradle raiz (SDK 36, Kotlin 2.1.20)
│   ├── app/build.gradle            # Config app (minSdk 24, targetSdk 36)
│   └── app/src/main/
│       └── AndroidManifest.xml     # Permisos: INTERNET, GPS
└── src/
    ├── components/
    │   ├── Map/                    # MapView, StationMarker, MarkerCallout
    │   ├── UI/                     # FuelTypeSelector, SearchRadius, Loading, Error
    │   └── StationDetail/          # StationDetailSheet, PriceRow
    ├── hooks/                      # useLocation, useStations, usePriceColors
    ├── services/                   # api, parser, geo, cache
    ├── context/                    # StationContext (React Context + useReducer)
    ├── utils/                      # colors, constants, formatPrice
    └── types/                      # station.ts, api.ts
```

---

## Troubleshooting (Windows)

### `ANDROID_HOME` no definido

```
error Android SDK root is not set. Set it via ANDROID_HOME environment variable.
```

**Solucion**: Crear la variable de entorno `ANDROID_HOME` apuntando a la carpeta del SDK. Ruta tipica: `C:\Users\<usuario>\AppData\Local\Android\Sdk`.

### Licencias de SDK no aceptadas

```
Failed to install the following Android SDK packages: ...
```

**Solucion**:

```bash
sdkmanager --licenses
# Aceptar todas con 'y'
```

### Metro no conecta con el dispositivo

```
Could not connect to development server.
```

**Solucion**:

```bash
adb reverse tcp:8081 tcp:8081
```

Si usas WiFi en vez de USB, asegurate de que el PC y el telefono estan en la misma red. Configura la IP del PC en el Dev Menu > Settings > Debug server host & port.

### Gradle falla por memoria

```
GC overhead limit exceeded
```

**Solucion**: Ya configurado en `gradle.properties` con `-Xmx4096m`. Si persiste, cierra otras aplicaciones para liberar RAM.

### El emulador no arranca (HAXM/Hyper-V)

**Solucion**: Asegurate de tener habilitado **Hyper-V** o **HAXM** en las caracteristicas de Windows. Android Studio usa WHPX en Windows 11 por defecto.

```
Panel de control > Programas > Activar o desactivar caracteristicas de Windows > Hyper-V
```

### `adb devices` no muestra el telefono

1. Verifica que la depuracion USB esta activa.
2. Cambia el modo USB a **Transferencia de archivos (MTP)**.
3. Acepta el dialogo de autorizacion en el telefono.
4. Prueba con otro cable USB (algunos cables solo cargan).

---

## Dependencias principales

| Paquete | Version | Proposito |
|---------|---------|-----------|
| `react-native` | 0.84.1 | Framework movil |
| `@maplibre/maplibre-react-native` | ^10.4.2 | Mapa con tiles vectoriales |
| `react-native-geolocation-service` | ^5.3.1 | GPS del dispositivo |
| `react-native-permissions` | ^5.5.1 | Gestion de permisos Android |
| `@gorhom/bottom-sheet` | ^5.2.8 | Sheet de detalle de estacion |
| `react-native-reanimated` | ^4.2.3 | Animaciones |
| `react-native-gesture-handler` | ^2.30.0 | Gestos tactiles |
| `@react-native-async-storage/async-storage` | ^3.0.1 | Cache local |
| `react-native-safe-area-context` | ^5.5.2 | Safe area (notch) |

**Mapa base**: [OpenFreeMap](https://openfreemap.org/) — sin API key, tiles gratuitos.
