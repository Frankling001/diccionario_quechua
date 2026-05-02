# Diccionario digital Quechua - Español

Aplicación web MVP para buscar palabras en quechua y español, y permitir sugerencias de nuevas palabras cuando no se encuentren resultados.

## Objetivo
Facilitar el aprendizaje y consulta de vocabulario entre quechua y español mediante una herramienta web simple, rápida y escalable.

## Funcionalidades del MVP
- Búsqueda de palabras en español → quechua
- Búsqueda de palabras en quechua → español
- Visualización de traducción
- Mensaje cuando no se encuentra una palabra
- Formulario para sugerir nuevas palabras
- Guardado de sugerencias en base de datos

## Tecnologías
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Base de datos: PostgreSQL
- ORM: Prisma

## Estructura general
- `frontend/`: interfaz de usuario
- `backend/`: API y lógica del servidor

## Instalación
### Frontend
```bash
cd frontend
npm install
npm run dev

### Backend 
cd backend
npm install
npm run dev

### Autor
Frankling
Fiorella

### Cambios a GitHub

git status
git add .
git commit -m "Avance del MVP: backend, frontend y sugerencias"
git push

Cuando git push sale error es porque no tiene rama remota configurada, usamos lo siguiente solo una vez:

git branch -M main
git push -u origin main


### PARA CAMBIOS LIMPIOS EN LA BD
cd backend
npm run prisma:seed
npm run dev