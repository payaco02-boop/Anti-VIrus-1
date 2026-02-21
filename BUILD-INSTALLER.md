# 🛡️ ShieldAI Antivirus — Guía para Crear el Instalador .exe

## Requisitos

- **Node.js** 20+ o **Bun** (ya instalado)
- **Windows** (para compilar el .exe nativo) o **Wine** en Linux/Mac
- **NSIS** 3.x (opcional, para el script .nsi personalizado)

---

## Método 1: Electron Builder (Recomendado — Automático)

Este método genera automáticamente el `.exe` instalador con todo incluido.

### Paso 1: Instalar dependencias

```bash
bun install
```

### Paso 2: Compilar la app Next.js

```bash
bun run build
```

### Paso 3: Generar el instalador .exe

```bash
bun run electron:build
```

Esto genera en la carpeta `dist/`:
- `ShieldAI Antivirus Setup 1.0.0.exe` — **Instalador con asistente**
- `ShieldAI-Antivirus-Portable-1.0.0.exe` — **Versión portable (sin instalar)**

---

## Método 2: NSIS Manual (Personalizado)

Para usar el script NSIS personalizado en `installer/ShieldAI-Installer.nsi`:

### Paso 1: Instalar NSIS

Descarga desde: https://nsis.sourceforge.io/Download

### Paso 2: Compilar la app primero

```bash
bun run build
bun run electron:build:nsis
```

### Paso 3: Compilar el script NSIS

```bash
# En Windows con NSIS instalado:
makensis installer/ShieldAI-Installer.nsi

# O con la GUI de NSIS: clic derecho en el .nsi → "Compile NSIS Script"
```

Genera: `installer/ShieldAI-Antivirus-Setup-v1.0.0.exe`

---

## Estructura del Instalador

El instalador NSIS incluye:

| Componente | Descripción | Obligatorio |
|------------|-------------|-------------|
| Archivos principales | Motor IA + interfaz | ✅ Sí |
| Acceso directo Escritorio | Icono en el escritorio | Opcional |
| Acceso directo Menú Inicio | En el menú de Windows | Opcional |
| Inicio con Windows | Arranque automático | Opcional |

## El Desinstalador

El instalador crea automáticamente un desinstalador en:
- `C:\Program Files\ShieldAI Antivirus\Uninstall.exe`
- También aparece en **Panel de Control → Programas → Desinstalar**

El desinstalador:
1. Cierra ShieldAI si está ejecutándose
2. Elimina todos los archivos de la carpeta de instalación
3. Elimina accesos directos del escritorio y menú inicio
4. Elimina la entrada de inicio automático
5. Elimina las claves del registro
6. Pregunta si eliminar también los datos de configuración

---

## Personalización del Instalador

Edita `installer/ShieldAI-Installer.nsi` para cambiar:

```nsi
!define APP_NAME "ShieldAI Antivirus"    ; Nombre de la app
!define APP_VERSION "1.0.0"              ; Versión
!define APP_PUBLISHER "ShieldAI Corp"    ; Empresa
!define INSTALL_DIR "$PROGRAMFILES64\ShieldAI Antivirus"  ; Directorio
```

---

## Iconos y Recursos

Coloca estos archivos en `electron/assets/`:
- `icon.ico` — Icono principal (256x256 recomendado)
- `tray-icon.png` — Icono de la bandeja del sistema (16x16 o 32x32)

---

## Firma Digital (Opcional)

Para firmar el `.exe` y evitar alertas de Windows Defender:

```bash
# Con certificado .pfx:
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com "dist/ShieldAI Antivirus Setup 1.0.0.exe"
```

---

## Notas Importantes

- El instalador requiere **permisos de administrador** (UAC)
- Compatible con **Windows 10/11** (64-bit)
- El desinstalador aparece en **Agregar o quitar programas**
- La versión portable NO requiere instalación
