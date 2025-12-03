// @ts-nocheck
export default function Button({ text, callback }) {
  return (
    <div>
      <button
        onClick={callback}
        className="hover:shadow-md hover:bg-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 bg-blue-500 p-1 m-3  rounded-xl w-20"
      >
        {text}
      </button>
    </div>
  );
}
