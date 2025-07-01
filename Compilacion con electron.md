# Guía de Compilación para Escritorio (Electron)

Este proyecto Next.js ha sido configurado para compilarse como una aplicación de escritorio multiplataforma utilizando Electron. Sigue los pasos a continuación para generar los ejecutables e instaladores.

## Requisitos Previos

Asegúrate de tener Node.js y npm (o Yarn) instalados en tu sistema. Puedes descargarlos desde [nodejs.org](https://nodejs.org/).

## Pasos para la Compilación

1.  **Clonar el Repositorio (si aún no lo has hecho):**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO_DEL_PROYECTO>
    ```

2.  **Instalar Dependencias:**
    Abre una terminal en la raíz del proyecto y ejecuta:
    ```bash
    npm install
    ```
    o si usas Yarn:
    ```bash
    yarn install
    ```

3.  **Ejecutar en Modo Desarrollo (Opcional):**
    Si deseas ejecutar la aplicación en un entorno de desarrollo con Electron (con recarga en caliente para la parte web y acceso a las herramientas de desarrollo de Chromium), utiliza el siguiente comando:
    ```bash
    npm run electron:dev
    ```
    Esto iniciará el servidor de desarrollo de Next.js y luego abrirá la aplicación en una ventana de Electron.

4.  **Compilar la Aplicación para Producción:**
    Para generar los archivos estáticos de Next.js y luego empaquetarlos con Electron para tu plataforma actual, ejecuta:
    ```bash
    npm run electron:build
    ```
    Este comando realizará las siguientes acciones:
    *   `next build`: Compila la aplicación Next.js para producción y la exporta a archivos HTML/CSS/JS estáticos en el directorio `out/` (gracias a la configuración `output: 'export'` en `next.config.mjs`).
    *   `electron-builder`: Empaqueta los archivos de `out/` junto con el código de Electron (`main.js`, `preload.js`) en un ejecutable e instalador.

    Los artefactos de compilación (ejecutables, instaladores) se encontrarán en el directorio `dist/`.

## Configuración de `electron-builder`

La configuración para `electron-builder` se encuentra en el archivo `package.json` bajo la clave `build`. Puedes modificarla para personalizar aspectos como:

*   `appId`: Identificador único de la aplicación.
*   `productName`: Nombre del producto que se mostrará.
*   `directories`: Ubicaciones de salida y recursos.
*   `files`: Patrones para incluir archivos en el paquete.
*   `win`, `mac`, `linux`: Configuraciones específicas por plataforma (por ejemplo, tipo de instalador, iconos).

Por defecto, está configurado para generar:
*   Windows: Instalador NSIS (`.exe`)
*   Linux: AppImage (`.AppImage`)
*   macOS: Imagen de disco (`.dmg`)

Si deseas compilar para una plataforma específica diferente a la que estás usando, `electron-builder` ofrece opciones para la compilación cruzada, aunque esto puede requerir configuración adicional o dependencias específicas del sistema operativo. Consulta la [documentación de electron-builder](https://www.electron.build/) para más detalles.

## Notas Adicionales

*   **LocalStorage:** La aplicación utiliza `localStorage` para guardar información. Dado que Electron se basa en Chromium, `localStorage` funciona de la misma manera que en un navegador web, por lo que los datos persistirán entre sesiones de la aplicación de escritorio.
*   **Rutas de Archivos:** En `main.js`, cuando la aplicación no está en desarrollo (`isDev` es `false`), carga `out/index.html`. Asegúrate de que la configuración de exportación de Next.js y la estructura de archivos sean consistentes.
*   **Actualizaciones:** Para implementar actualizaciones automáticas, deberás configurar un servidor de actualizaciones y añadir la lógica correspondiente utilizando módulos como `electron-updater`. Esto está fuera del alcance de esta guía básica.

Con estos pasos, deberías poder compilar y distribuir tu aplicación Next.js como una aplicación de escritorio.
