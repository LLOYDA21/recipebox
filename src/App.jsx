import { useState, useMemo, useEffect, useCallback } from "react"
import { Search, Moon, Sun } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import RecipeCard from "@/components/RecipeCard"
import RecipeDetail from "@/components/RecipeDetail"
import AddRecipeDialog from "@/components/AddRecipeDialog"
import useLocalStorage from "@/hooks/useLocalStorage"
import initialRecipes from "@/data/recipes.json"

export default function App() {
  // ---- State ----
  const [customRecipes, setCustomRecipes] = useLocalStorage("customRecipes", [])
  const [favorites, setFavorites] = useLocalStorage("favorites", []) // array of recipe ids
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [tab, setTab] = useState("all") // "all" | "favorites"
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  // Apply dark mode by toggling the "dark" class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  // Custom recipes first, then the initial recipes
  const allRecipes = useMemo(() => [...customRecipes, ...initialRecipes], [customRecipes])

  // Unique categories for the filter badges
  const categories = useMemo(
    () => ["All", ...new Set(allRecipes.map((r) => r.category).filter(Boolean))],
    [allRecipes]
  )

  // Real-time filtering: tab + category + search (title or ingredient)
  const visibleRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allRecipes.filter((r) => {
      if (tab === "favorites" && !favorites.includes(r.id)) return false
      if (category !== "All" && r.category !== category) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q))
      )
    })
  }, [allRecipes, tab, category, searchQuery, favorites])

  // ---- Handlers ----
  const toggleFavorite = useCallback(
    (id) =>
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      ),
    [setFavorites]
  )

  const addRecipe = (recipe) => setCustomRecipes((prev) => [recipe, ...prev])

  const deleteRecipe = (id) => {
    if (!window.confirm("Delete this recipe?")) return
    setCustomRecipes((prev) => prev.filter((r) => r.id !== id))
    setFavorites((prev) => prev.filter((f) => f !== id)) // clean up favorites too
    setSelectedRecipe(null)
    toast.success("Recipe deleted")
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">RecipeBox 🍳</h1>
        <div className="flex gap-2">
          <AddRecipeDialog onAdd={addRecipe} />
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name or ingredient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs: All / Favorites */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge
            key={c}
            variant={category === c ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCategory(c)}
          >
            {c}
          </Badge>
        ))}
      </div>

      {/* Recipe grid */}
      {visibleRecipes.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {tab === "favorites" ? "No favorites yet. Tap the heart on a recipe!" : "No recipes found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={toggleFavorite}
              onSelect={setSelectedRecipe}
            />
          ))}
        </div>
      )}

      {/* Details popup */}
      <RecipeDetail
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isFavorite={selectedRecipe ? favorites.includes(selectedRecipe.id) : false}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteRecipe}
      />

      <Toaster />
    </div>
  )
}