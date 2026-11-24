import { Heart, Trash2 } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


export default function RecipeDetail({ recipe, onClose, isFavorite, onToggleFavorite, onDelete }) {
  if (!recipe) return null

  return (
    <Dialog open={!!recipe} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{recipe.title}</DialogTitle>
          <DialogDescription>
            {recipe.cookingTime} • Serves {recipe.servings}
          </DialogDescription>
        </DialogHeader>

        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-56 w-full rounded-md object-cover"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")}
        />

        <section>
          <h4 className="mb-2 font-semibold">Ingredients</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        <section>
          <h4 className="mb-2 font-semibold">Instructions</h4>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </section>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onToggleFavorite(recipe.id)}>
            <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
            {isFavorite ? "Remove favorite" : "Add to favorites"}
          </Button>
          {recipe.isCustom && (
            <Button variant="destructive" onClick={() => onDelete(recipe.id)}>
              <Trash2 /> Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}