// import Blank from "./Blank";
import { useParams } from "react-router-dom";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useGetMessagesQuery } from "../../../features/messages/messagesApi";
import Error from "../../ui/Error";

export default function ChatBody() {
  const { id } = useParams();
  const { data: messages, isError, isLoading, error } = useGetMessagesQuery(id);


  let content = null;
  if (isLoading) {
    content = <li className="mt-2 text-center">Loading...</li>;
  } else if (!isLoading && isError) {
    content = (
      <li className="mt-2 text-center">
        <Error message={error?.data} />
      </li>
    );
  } else if (!isLoading && !isError && messages?.length === 0) {
    content = <li className="mt-2 text-center">No messages found</li>;
  } else if (!isLoading && !isError && messages?.length > 0) {
    content = (
      <>
        <ChatHead messages={messages[0]} />
        <Messages messages={messages} />
        <Options info={messages[0]} />
      </>
    );
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        {content}
        {/* <Blank /> */}
      </div>
    </div>
  );
}
