import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";

import { Suspense } from "react";
import { AgentsListHeaders } from "@/modules/agents/ui/components/agent-list-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const Page = async () => {

  const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if(!session){
      redirect('/sign-in');
    }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions()); 
  return (
    <> 
    <AgentsListHeaders />
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
             <AgentsView />
          </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
    
  
);
};
export default Page;