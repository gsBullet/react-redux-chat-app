import { useEffect, useState } from "react";
import isValidateEmail from "../../utils/isValidEmail";
import { useGetUserQuery } from "../../features/users/userApi";
import Error from "../ui/Error";
import { useDispatch, useSelector } from "react-redux";
// import { messagesApi } from "../../features/messages/messagesApi";
import {
  converstionsApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/converstions/converstionsApi";

export default function Modal({ open, control }) {
  const dispatch = useDispatch();
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");

  const [checkUser, setCheckUser] = useState(false);
  const [conversation, setConversation] = useState(undefined);
  const [responseError, setResponseError] = useState("");
  const { data: participant } = useGetUserQuery(to, {
    skip: !checkUser,
  });
  const [addConversation, { isSuccess: isAddSuccess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: isEditSuccess }] =
    useEditConversationMutation();
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};

  const debounceHandler = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  const toSearch = (value) => {
    if (isValidateEmail(value)) {
      setTo(value);
      setCheckUser(true);
    }
  };

  const handleSearch = debounceHandler(toSearch, 500);

  useEffect(() => {
    if (participant?.length > 0 && participant[0].email !== myEmail) {
      dispatch(
        converstionsApi.endpoints.getConverstion.initiate({
          userEmail: myEmail,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch((error) => {
          console.log("Error fetching messages:", error);
          setResponseError("Error fetching messages:");
        });
    }
  }, [dispatch, myEmail, to, participant]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      editConversation({
        id: conversation[0]?.id,
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (conversation?.length === 0) {
      addConversation({
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  };

  useEffect(() => {
    if (isAddSuccess || isEditSuccess) {
      control();
      setTo("");
      setMessage("");
    }
  }, [isAddSuccess, isEditSuccess]);
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={submitHandler}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={
                  conversation === undefined ||
                  (participant?.length > 0 && participant[0].email === myEmail)
                }
              >
                Send Message
              </button>
            </div>
            {participant?.length === 0 && (
              <Error message="Email does not found" />
            )}{" "}
            {participant?.length > 0 && participant[0].email === myEmail && (
              <Error message="You can not message to yourself" />
            )}
            {responseError && <Error message={responseError} />}
          </form>
        </div>
      </>
    )
  );
}
