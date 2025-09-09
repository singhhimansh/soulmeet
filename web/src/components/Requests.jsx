import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, requestId) => {
    try {
      const res = await axios.patch(
        BASE_URL + "/request/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {}
  };

  console.log('requests',requests);

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return <h1 className="flex justify-center my-10"> No Requests Found</h1>;

  return (
    <div className="text-center my-10 mx-3">
      <h1 className="text-bold text-white text-3xl">Connection Requests</h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about, requestId } =
          request;

        return (
          <div
            key={_id}
            className="flex m-4 hover:scale-[1.02] transition-all p-4 rounded-lg bg-base-300 md:w-2/3 lg:w-1/2 mx-auto"
          >
            <div className="flex-shrink-0">
              <img
                alt="photo"
                className="w-12 sm:w-16 md:w-20 aspect-square rounded-full"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-4 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
            <div className="flex flex-col gap-1">
            <button
                className="btn btn-secondary "
                onClick={() => reviewRequest("accepted", requestId)}
              >
                Accept
              </button>
              <button
                className="btn btn-primary"
                onClick={() => reviewRequest("rejected", requestId)}
              >
                Reject
              </button>
       
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Requests;
