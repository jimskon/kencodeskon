import React from "react";
import SingleFileEditorClient from "./singleFileEditorClient";
import { getSession } from "@/lib";   // or your org’s session helper

export default async function Page() {
  // await the session on the server
  const session = await getSession();
  
  // pass the plain object down to the client
  return <SingleFileEditorClient session={session} />;
};
