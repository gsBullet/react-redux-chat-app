import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import isValidEmail from "../../utils/isValidEmail";
import Error from "../ui/Error";
import { useGetUserQuery } from "../../features/users/userApi";
import {
  conversationsApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/converstions/conversationsApi";

export default function Modal({ open, control }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [userCheck, setUserCheck] = useState(false);
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const dispatch = useDispatch();
  const [responseError, setResponseError] = useState("");
  const [conversation, setConversation] = useState(undefined);

  const {
    data: participant,
    isError,
    error,
  } = useGetUserQuery(to, {
    skip: !userCheck,
  });

  const [addConversation, { isSuccess: isAddConversationSuccess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConversationSuccess }] =
    useEditConversationMutation();

  const debounceHandler = (fn, delay) => {
    let timeout_id;
    return (...args) => {
      clearTimeout(timeout_id);
      timeout_id = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doSearch = (value) => {
    if (isValidEmail(value)) {
      // check user API
      setUserCheck(true);
      setTo(value);
    }
  };

  const handleSearch = debounceHandler(doSearch, 500);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (conversation) {
      // edit conversation
      editConversation({
        _id: conversation._id,
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant?.email}`,
          users: [loggedInUser, participant],
          message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (!conversation) {
      // add conversation
      addConversation({
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant?.email}`,
          users: [loggedInUser, participant],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  };

  useEffect(() => {
    if (participant && participant?.email !== myEmail) {
      // check conversation existance
      dispatch(
        conversationsApi.endpoints.getConversation.initiate({
          userEmail: myEmail,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch((err) => {
          setResponseError("There was a problem!");
        });
    }
  }, [participant, dispatch, myEmail, to]);
  // listen conversation add/edit success
  useEffect(() => {
    if (isAddConversationSuccess || isEditConversationSuccess) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddConversationSuccess, isEditConversationSuccess]);

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
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  _id="to"
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
                  _id="message"
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
                  (participant && participant?.email === myEmail)
                }
              >
                Send Message
              </button>
            </div>

            {isError && <Error message={error?.data?.message} />}
            {!isError && participant && participant?.email === myEmail && (
              <Error message="You can not send message to yourself!" />
            )}

            {!isError && responseError && <Error message={responseError} />}
          </form>
        </div>
      </>
    )
  );
}
