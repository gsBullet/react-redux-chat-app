import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import Error from "../ui/Error";
import moment from "moment";
import gravaterUrl from "gravatar-url";
import { Link } from "react-router-dom";
import { useGetConversationsQuery } from "../../features/converstions/conversationsApi";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  const {
    data: conversations,
    isError,
    isLoading,
    error,
  } = useGetConversationsQuery(email) || {};

  let content = null;
  if (isLoading) {
    content = <li className="mt-2 text-center">Loading...</li>;
  } else if (!isLoading && isLoading) {
    content = (
      <li className="mt-2 text-center">
        <Error message={error?.data} />
      </li>
    );
  } else if (!isLoading && !isError && conversations.length === 0) {
    content = <li className="mt-2 text-center">No converstions found</li>;
  } else if (!isLoading && !isError && conversations.length > 0) {
    content = conversations?.map((conversation) => {
      const { id, message, timestamp } = conversation || {};
      const { name, email: partnerEmail } = conversation?.users?.find(
        (u) => u.email !== email
      );

      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravaterUrl(partnerEmail, { size: 80 })}
              name={name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }

  return <ul>{content}</ul>;
}
