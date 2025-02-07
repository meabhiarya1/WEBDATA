import BeatLoader from "react-spinners/BeatLoader";

function Loader() {
  return (
    <div className="sweet-loading flex justify-center items-center w-full h-[100vh] bg-gradient-to-r from-blue-400 to-blue-600">
      <BeatLoader
        color="white"
        loading={true}
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loader;
