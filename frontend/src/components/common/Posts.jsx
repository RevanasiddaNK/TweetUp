import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType,username,userId}) => {

	const getPostEndPoint = () => {
		//console.log(feedType);
		switch(feedType){
			case "forYou" :
				return "/api/post/all";
			case "following" :
				return "/api/post/feedPosts";
			case "posts" :
				return `/api/post/user/${username}`;
			case "likes" :
				return `/api/post/likes/${userId}`;
			default : 
				return "/api/post/all";
		}
	};

	const POST_ENDPOINT = getPostEndPoint();
	//const POST_ENDPOINT = "/api/post/feedPosts";
	const { data: POSTS, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["POSTS"],
		queryFn: async () => {
		  try{

			const res = await fetch(POST_ENDPOINT);
			const {data} = await res.json();
			//console.log("data", data);
	  
			if (data.error) {
			//console.log("Data Error", data.error);
			  throw new Error(data.error);
			}
	  
			if (!res.ok) {
			  throw new Error("Something went wrong in fetching posts");
			}
	  
			//console.log("All the posts", data);
			return data;
		  } 
		  catch (error) {
			throw new Error(error.message);
		  }
		},
		
	  });

	  useEffect( ()=> {
		refetch();
	  }, [feedType,refetch]);
	  
	  //console.log(POSTS);

	return (
		<>
			{ (isLoading || isRefetching ) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!  (isLoading )  && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!  (isLoading || isRefetching ) && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;