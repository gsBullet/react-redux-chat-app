import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import Error from "../ui/Error";
import moment from "moment";
import gravaterUrl from "gravatar-url";
import { Link } from "react-router-dom";
import {
  conversationsApi,
  useGetConversationsQuery,
} from "../../features/converstions/conversationsApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

export default function ChatItems() {
  const { user } = useSelector((state) => state?.auth) || {};
  const { email } = user || {};
  const { data, isError, isLoading, error } =
    useGetConversationsQuery(email) || {};
  const { data: conversations, totalCount } = data || {};
  console.log(`conversations chat item`, conversations);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const fetchMore = () => {
    setPage((preV) => preV + 1);
  };


  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationsApi.endpoints.getMoreConversations.initiate({
          email,
          page,
        })
      );
    }
  }, [page, dispatch, email]);

  useEffect(() => {
    if (totalCount > 0) {
      const more = Math.ceil(
        totalCount / Number(process.env.REACT_APP_CONVERSATION_LIMIT) > page
      );
      setHasMore(more);
    }
  }, [totalCount, page]);

  let content = null;
  if (isLoading) {
    content = <li className="mt-2 text-center">Loading...</li>;
  } else if (!isLoading && isError) {
    content = (
      <li className="mt-2 text-center">
        <Error message={error?.data} />
      </li>
    );
  } else if (!isLoading && !isError && conversations?.length === 0) {
    content = <li className="mt-2 text-center">No converstions found</li>;
  } else if (!isLoading && !isError && conversations?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={conversations.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}
      >
        {conversations.map((conversation) => {
          const { _id, message, timestamp } = conversation || {};
          const partner = conversation?.users?.find((u) => u?.email !== email);
          console.log(`partner`, partner);

          const {
            name,
            email: partnerEmail,
            authImage: partnerImage,
          } = partner || {};


          return (
            <li key={_id}>
              <Link to={`/inbox/${_id}`}>
                <ChatItem
                  avatar={
                    partnerImage
                      ? partnerImage
                      : gravaterUrl(partnerEmail, { size: 80 })
                  }
                  name={name}
                  lastMessage={message}
                  lastTime={moment(timestamp).fromNow()}
                />
              </Link>
            </li>
          );
        })}
      </InfiniteScroll>
    );
  }

  return <ul>{content}</ul>;
}
