import { useNavigate } from "react-router-dom";


const NoMatch = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full mt-32  gap-5">
      <h1 className="text-3xl">404 Not Found</h1>
      <button className="btn btn-primary" onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};
export default NoMatch;
