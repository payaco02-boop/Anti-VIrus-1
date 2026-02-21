; ShieldAI Antivirus - NSIS Installer Script
; Requires NSIS 3.x - https://nsis.sourceforge.io/

!define APP_NAME "ShieldAI Antivirus"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "ShieldAI Corp"
!define APP_URL "https://shieldai.app"
!define APP_EXE "ShieldAI Antivirus.exe"
!define INSTALL_DIR "$PROGRAMFILES64\ShieldAI Antivirus"
!define UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\ShieldAI"
!define REGISTRY_KEY "Software\ShieldAI"

; Compression
SetCompressor /SOLID lzma
SetCompressorDictSize 32

; Modern UI
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "WinMessages.nsh"

; General settings
Name "${APP_NAME} ${APP_VERSION}"
OutFile "ShieldAI-Antivirus-Setup-v${APP_VERSION}.exe"
InstallDir "${INSTALL_DIR}"
InstallDirRegKey HKLM "${REGISTRY_KEY}" "InstallPath"
RequestExecutionLevel admin
BrandingText "${APP_NAME} v${APP_VERSION} Installer"

; Version info
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "${APP_NAME}"
VIAddVersionKey "CompanyName" "${APP_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "© 2025 ${APP_PUBLISHER}"
VIAddVersionKey "FileDescription" "${APP_NAME} Installer"
VIAddVersionKey "FileVersion" "${APP_VERSION}"
VIAddVersionKey "ProductVersion" "${APP_VERSION}"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "..\electron\assets\icon.ico"
!define MUI_UNICON "..\electron\assets\icon.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "welcome.bmp"
!define MUI_WELCOMEPAGE_TITLE "Bienvenido a ${APP_NAME}"
!define MUI_WELCOMEPAGE_TEXT "Este asistente te guiará durante la instalación de ${APP_NAME} v${APP_VERSION}.$\r$\n$\r$\nShieldAI es un antivirus con inteligencia artificial que protege tu sistema en tiempo real.$\r$\n$\r$\nSe recomienda cerrar todas las aplicaciones antes de continuar."
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXE}"
!define MUI_FINISHPAGE_RUN_TEXT "Iniciar ${APP_NAME}"
!define MUI_FINISHPAGE_SHOWREADME ""
!define MUI_FINISHPAGE_LINK "Visitar sitio web"
!define MUI_FINISHPAGE_LINK_LOCATION "${APP_URL}"

; Pages - Installer
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "license.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Pages - Uninstaller
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_LANGUAGE "English"

; ============================================================
; INSTALLER SECTIONS
; ============================================================

Section "ShieldAI Antivirus (requerido)" SecMain
  SectionIn RO  ; Required - cannot be deselected

  SetOutPath "$INSTDIR"

  ; Copy all application files
  File /r "..\dist\win-unpacked\*.*"

  ; Write registry keys
  WriteRegStr HKLM "${REGISTRY_KEY}" "InstallPath" "$INSTDIR"
  WriteRegStr HKLM "${REGISTRY_KEY}" "Version" "${APP_VERSION}"

  ; Write uninstall information
  WriteRegStr HKLM "${UNINSTALL_KEY}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "Publisher" "${APP_PUBLISHER}"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "URLInfoAbout" "${APP_URL}"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "${UNINSTALL_KEY}" "QuietUninstallString" '"$INSTDIR\Uninstall.exe" /S'
  WriteRegDWORD HKLM "${UNINSTALL_KEY}" "NoModify" 1
  WriteRegDWORD HKLM "${UNINSTALL_KEY}" "NoRepair" 1
  WriteRegStr HKLM "${UNINSTALL_KEY}" "DisplayIcon" "$INSTDIR\${APP_EXE}"

  ; Estimate install size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKLM "${UNINSTALL_KEY}" "EstimatedSize" "$0"

  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

SectionEnd

Section "Acceso directo en Escritorio" SecDesktop
  CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0
SectionEnd

Section "Acceso directo en Menú Inicio" SecStartMenu
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\Desinstalar ${APP_NAME}.lnk" "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Iniciar con Windows" SecAutoStart
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}" '"$INSTDIR\${APP_EXE}" --minimized'
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} "Archivos principales de ShieldAI Antivirus (requerido)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} "Crea un acceso directo en el escritorio"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} "Crea accesos directos en el menú inicio"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecAutoStart} "Inicia ShieldAI automáticamente con Windows"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; ============================================================
; UNINSTALLER SECTION
; ============================================================

Section "Uninstall"

  ; Stop the application if running
  ExecWait 'taskkill /F /IM "${APP_EXE}"' $0

  ; Remove files
  RMDir /r "$INSTDIR"

  ; Remove shortcuts
  Delete "$DESKTOP\${APP_NAME}.lnk"
  RMDir /r "$SMPROGRAMS\${APP_NAME}"

  ; Remove autostart
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}"

  ; Remove registry keys
  DeleteRegKey HKLM "${UNINSTALL_KEY}"
  DeleteRegKey HKLM "${REGISTRY_KEY}"

  ; Remove app data (optional - ask user)
  MessageBox MB_YESNO "¿Deseas eliminar también los datos de configuración de ShieldAI?" IDNO SkipAppData
    RMDir /r "$APPDATA\ShieldAI Antivirus"
  SkipAppData:

SectionEnd

; ============================================================
; FUNCTIONS
; ============================================================

Function .onInit
  ; Check if already installed
  ReadRegStr $R0 HKLM "${UNINSTALL_KEY}" "UninstallString"
  ${If} $R0 != ""
    MessageBox MB_YESNO|MB_ICONQUESTION \
      "${APP_NAME} ya está instalado. ¿Deseas reinstalarlo?" \
      IDYES DoInstall
    Abort
    DoInstall:
  ${EndIf}

  ; Check Windows version (require Windows 10+)
  ${If} ${AtLeastWin10}
    ; OK
  ${Else}
    MessageBox MB_OK|MB_ICONSTOP "ShieldAI Antivirus requiere Windows 10 o superior."
    Abort
  ${EndIf}
FunctionEnd

Function .onInstSuccess
  ; Show success notification
  MessageBox MB_OK|MB_ICONINFORMATION \
    "${APP_NAME} se ha instalado correctamente.$\r$\n$\r$\nTu sistema ahora está protegido por IA."
FunctionEnd
