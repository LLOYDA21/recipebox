import { useState, useRef } from "react"
import { Plus, ImagePlus, X } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Categories to choose from (add or remove as you like)
const CATEGORIES = [
  "Main Dish", "Pasta", "Noodles", "Pizza", "Soup", "Salad",
  "Breakfast", "Snack", "Dessert", "Drinks", "Other",
]

const emptyForm = {
  title: "",
  category: "Main Dish",
  cookingTime: "",
  servings: "",
  ingredients: "",
  instructions: "",
}

// Form for adding a custom recipe
export default function AddRecipeDialog({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState("") // uploaded image saved as a data URL
  const fileRef = useRef(null)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  // Turn a multi-line textarea into a clean array
  const toList = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean)

  // Read the chosen image file and keep it as text so localStorage can save it
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }
    // localStorage is small (about 5 MB total), so limit each image
    if (file.size > 500 * 1024) {
      toast.error("Image is too big. Please choose one under 500 KB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  const resetAll = () => {
    setForm(emptyForm)
    setImage("")
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const ingredients = toList(form.ingredients)
    const instructions = toList(form.instructions)

    // Basic validation
    if (!form.title.trim() || ingredients.length === 0 || instructions.length === 0) {
      toast.error("Please fill in the title, ingredients and instructions.")
      return
    }

    onAdd({
      id: `custom-${Date.now()}`,
      title: form.title.trim(),
      image: image || "https://placehold.co/600x450?text=No+Image",
      ingredients,
      instructions,
      cookingTime: form.cookingTime.trim() || "N/A",
      servings: Number(form.servings) || 1,
      category: form.category,
      isCustom: true, // only custom recipes can be deleted
    })
    toast.success("Recipe added!")
    resetAll()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus /> Add Recipe</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add your own recipe</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={update("title")} />
          </div>

          {/* Category dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={form.category}
              onChange={update("category")}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="text-black">{c}</option>
              ))}
            </select>
          </div>

          {/* Cooking time and servings side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cookingTime">Cooking time</Label>
              <Input
                id="cookingTime"
                placeholder="e.g. 30 mins"
                value={form.cookingTime}
                onChange={update("cookingTime")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                placeholder="e.g. 4"
                value={form.servings}
                onChange={update("servings")}
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label>Image</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            {image ? (
              <div className="relative">
                <img src={image} alt="Preview" className="h-40 w-full rounded-md object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-2 rounded-full"
                  aria-label="Remove image"
                  onClick={() => {
                    setImage("")
                    if (fileRef.current) fileRef.current.value = ""
                  }}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="h-24 w-full border-dashed"
                onClick={() => fileRef.current.click()}
              >
                <ImagePlus /> Upload image from your computer
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients (one per line)</Label>
            <Textarea id="ingredients" rows={4} value={form.ingredients} onChange={update("ingredients")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (one step per line)</Label>
            <Textarea id="instructions" rows={4} value={form.instructions} onChange={update("instructions")} />
          </div>

          <Button type="submit" className="w-full">Save Recipe</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}