export default function Input({ tipo, value, func, pl }) {
  return (
    <>
      <input
        className="bg-amber-300 hover:bg-amber-500 text-black hover:text-amber-50 mt-3 px-2 w-25 md:w-40 rounded-md"
        type={tipo}
        placeholder={pl}
        onChange={func}
        value={value}
        required
      ></input>
    </>
  );
}
