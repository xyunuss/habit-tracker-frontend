# Habit Tracker - Frontend

**Thema:** Habit Tracker  
**Team:** Yunus Schultze (598122) - Einzelarbeit  
**Modul:** Webtechnologien, HTW Berlin

## 📋 Projektbeschreibung

Der Habit Tracker ist eine Web-Anwendung zum Verfolgen von täglichen Gewohnheiten. Die App bietet eine übersichtliche Darstellung des Fortschritts mit Heatmaps, Streaks und Statistiken.

## ✨ Features

- **Gewohnheiten verwalten:** Erstellen, Bearbeiten und Löschen von Habits
- **Tägliches Abhaken:** Ein-Klick Check-in für jede Gewohnheit
- **Fortschrittsübersicht:** Heatmap-Darstellung der letzten Wochen
- **Streak-Tracking:** Anzeige der aktuellen und längsten Serie
- **Statistiken:** Prozentuale Erfolgsquote und Monatsübersicht
- **Responsives Design:** Optimiert für Desktop und Tablet

## 🛠️ Tech Stack

- **Framework:** Vue.js 3 (Composition API)
- **Build Tool:** Vite
- **Testing:** Vitest + Vue Test Utils
- **Styling:** Custom CSS mit CSS Variables
- **Deployment:** Render.com

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 20+
- npm

### Installation & Start

```bash
# Repository klonen
git clone https://github.com/xyunuss/habit-tracker-frontend.git
cd habit-tracker-frontend

# Dependencies installieren
npm install

# Environment Variable setzen (optional, für lokale Entwicklung)
# Kopiere .env.example zu .env und passe die URL an
cp .env.example .env

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

**Hinweis:** Die API URL kann über die Environment Variable `VITE_API_URL` konfiguriert werden. Standardmäßig wird die Production-URL verwendet.

## 📦 Verfügbare Scripts

```bash
# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build

# Build-Vorschau anzeigen
npm run preview

# Unit Tests ausführen
npm run test:unit

# Linter ausführen
npm run lint
```

## 📁 Projektstruktur

```
src/
├── App.vue                     # Hauptkomponente
├── main.js                     # Entry Point
├── assets/
│   ├── base.css                # CSS Reset & Variables
│   └── main.css                # Globale Styles
├── components/
│   ├── ConfirmDialog.vue       # Bestätigungsdialog
│   ├── HabitCard.vue           # Habit-Karte mit Heatmap
│   ├── HabitDetail.vue         # Detailansicht eines Habits
│   ├── HabitListItem.vue       # Habit in der Sidebar
│   ├── HabitModal.vue          # Erstellen/Bearbeiten Dialog
│   ├── WeekNavigation.vue      # Wochennavigation
│   └── __tests__/              # Komponenten-Tests
└── services/
    └── api.js                  # API Client & Utilities
```

## 🎨 Komponenten

### App.vue
Die Hauptkomponente mit zwei-spaltigem Layout:
- **Sidebar:** Liste aller Habits mit Quick-Actions
- **Content:** Übersicht oder Detailansicht

### HabitCard
Zeigt einen Habit mit:
- Name und Icon
- Heatmap der letzten 12 Wochen
- Aktueller Streak und Erfolgsquote

### HabitDetail
Detailansicht mit:
- Statistik-Karten (Streak, Erfolgsquote, etc.)
- Monatskalender
- Wöchentlicher Fortschritts-Chart

### HabitModal
Dialog zum Erstellen/Bearbeiten:
- Name und Beschreibung
- Typ (Täglich / X-mal pro Woche)
- Icon und Farbe auswählen

## 🎯 Benutzung

### Habit erstellen
1. Klicke auf "Neu" in der Sidebar
2. Gib einen Namen ein
3. Wähle optional Typ, Icon und Farbe
4. Klicke auf "Erstellen"

### Habit abhaken
- Klicke auf die Checkbox links neben dem Habit-Namen
- Oder klicke in der Heatmap auf ein vergangenes Datum

### Fortschritt ansehen
- Klicke auf einen Habit, um die Detailansicht zu öffnen
- Oder sieh dir die Heatmaps in der Übersicht an

### Habit bearbeiten/löschen
- Hover über einen Habit in der Sidebar
- Klicke auf das Stift-Icon zum Bearbeiten
- Klicke auf das Papierkorb-Icon zum Löschen

## 🧪 Tests

Das Projekt enthält Unit-Tests für alle Hauptkomponenten:

```bash
# Tests ausführen
npm run test:unit

# Tests im Watch-Modus
npm run test:unit -- --watch
```

**Getestete Komponenten:**
- HabitListItem
- HabitCard
- HabitModal
- ConfirmDialog
- WeekNavigation

## 🌐 Deployment

Das Frontend ist auf Render.com deployed:
- **URL:** https://habit-tracker-frontend-4y37.onrender.com
- **Auto-Deploy:** Bei Push auf main Branch

**Environment Variable auf Render.com:**
- `VITE_API_URL` = `https://habit-tracker-backend-v21g.onrender.com/api`

## 🔗 Backend

Das Frontend kommuniziert mit dem Spring Boot Backend:
- **Repository:** https://github.com/xyunuss/habit-tracker-backend
- **API:** https://habit-tracker-backend-v21g.onrender.com/api

## 📸 Screenshots

### Übersicht
Die Hauptansicht zeigt alle Habits mit Heatmaps:
- Links: Habit-Liste mit Quick-Check
- Rechts: Übersicht aller Habit-Karten

### Detailansicht
Klick auf einen Habit öffnet die Detailansicht:
- Statistiken (Streak, Erfolgsquote)
- Monatskalender
- Wöchentlicher Fortschritt

### Habit erstellen
Das Modal zum Erstellen bietet:
- Namenseingabe
- Typ-Auswahl (Täglich/Wöchentlich)
- Icon-Auswahl (Emojis)
- Farbauswahl

## 📝 Lizenz

Dieses Projekt wurde im Rahmen des Moduls Webtechnologien an der HTW Berlin erstellt.
