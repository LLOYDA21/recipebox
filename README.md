# RecipeBox

A simple Recipe Manager built with React, Vite and shadcn/ui. Browse recipes, search by name or ingredient, save favorites, and add or delete your own recipes.

## Features

- Recipe grid with image, title and cooking time
- Recipe details (ingredients, instructions, servings)
- Real-time search by name or ingredient
- Favorites tab (add and remove)
- Add custom recipes and delete them (the 15 provided recipes cannot be deleted)
- Category filter and dark mode
- Data saved in localStorage

## Setup

```bash
git clone https://github.com/YOUR-USERNAME/recipebox.git
cd recipebox
npm install
npm run dev
```

Open http://localhost:5173

### shadcn/ui installation steps

```bash
npm install tailwindcss @tailwindcss/vite
npx shadcn@latest init
npx shadcn@latest add button card input dialog tabs badge label textarea sonner
```

(Also added the `@tailwindcss/vite` plugin and the `@` path alias in `vite.config.js` and `jsconfig.json`.)

## shadcn/ui components used

Button, Card, Input, Dialog, Tabs, Badge, Label, Textarea, Sonner

## Data source

Recipes are loaded from `src/data/recipes.json` (15 recipes with `id`, `title`, `image`, `ingredients`, `instructions`, `cookingTime`, `servings`, `category`). Favorites and custom recipes are saved in the browser's localStorage using a custom `useLocalStorage` hook.

## Screenshots

![Home](screenshots/home.png)
![Details](screenshots/details.png)