import { Heart, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Shows one recipe: image, title, cooking time, favorite button
export default function RecipeCard({ recipe, isFavorite, onToggleFavorite, onSelect }) {
  return (
    <Card
      onClick={() => onSelect(recipe)}
      className="cursor-pointer overflow-hidden pt-0 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-48 w-full object-cover"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")}
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-2 rounded-full"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(recipe.id)
          }}
        >
          <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
        </Button>
      </div>
      <CardContent className="space-y-2">
        <h3 className="line-clamp-1 font-semibold">{recipe.title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-4" /> {recipe.cookingTime}
          </span>
          {recipe.category && <Badge variant="secondary">{recipe.category}</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}
