export default function LevelUpPopup({ level, message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">

      <div className="bg-gray-800 border border-yellow-400 p-6 rounded-2xl shadow-2xl animate-pop">
        <h1 className="text-4xl font-bold text-yellow-300 text-center">
          LEVEL UP!
        </h1>

        <p className="text-white text-xl mt-2 text-center">{message}</p>

        <p className="text-yellow-400 text-center text-2xl mt-4">
          ⭐ Level {level} ⭐
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-xl"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
