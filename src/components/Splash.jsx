// Full-screen landing screen: shows only the logo, click anywhere to enter
export default function Splash({ onEnter }) {
  return (
    <button
      type="button"
      onClick={onEnter}
      aria-label="Open RecipeBox"
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[#f5f0e6]"
    >
      <img
        src="/splash.png"
        alt="RecipeBox - click to enter"
        className="max-h-full max-w-full object-contain transition duration-300 hover:scale-105"
      />
    </button>
  )
}