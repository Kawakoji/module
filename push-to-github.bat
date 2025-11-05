@echo off
echo ========================================
echo Push vers GitHub pour Vercel
echo ========================================
echo.

echo Verification du commit...
git log --oneline -1
echo.

echo Pushing vers GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Les changements ont ete pousses.
    echo Vercel va automatiquement redployer.
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERREUR: Impossible de pousser vers GitHub
    echo.
    echo Solutions:
    echo 1. Verifier votre connexion internet
    echo 2. Verifier que GitHub est accessible
    echo 3. Essayer plus tard
    echo.
    echo Commande alternative: git push origin main
    echo ========================================
)

pause

