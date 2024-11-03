import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = (followId) => {

    const queryClient = useQueryClient();

    const {mutate:follow ,data, isPending, error} = useMutation({
        mutationFn : async(followId) => {
            try{
                const res = await fetch(`/api/user/follow/${followId}`,{
                    method : "POST"
                });
                const data = res.json();
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } 
            catch(error){
                throw new Error(error.message);
            }
        },

        onSuccess : () => {
            Promise.all([
                queryClient.invalidateQueries({
                    queryKey : ["authUser"]
                }),

                queryClient.invalidateQueries({
                    queryKey : ["suggestedUsers"]
                })
            ]).catch((error) => {
                toast.error(error.message);
              });
        },

        onError : () => {
            toast.error(error.message);
        }
    });
    return {isPending, follow};
}



export default useFollow;