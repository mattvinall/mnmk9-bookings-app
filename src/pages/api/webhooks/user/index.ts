import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Webhook, WebhookRequiredHeaders } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node"
import { IncomingHttpHeaders } from "http";

const prisma = new PrismaClient();

const webhookSecret = process.env.WEBHOOK_SECRET as string || "";

export default async function handler(req: NextApiRequestWithSvixRequiredHeaders, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const payload = JSON.stringify(req.body);

  console.log("payload: ", JSON.parse(payload));

  const headers = req.headers;

  const wh = new Webhook(webhookSecret);

  let evt: Event | null = null;

  try {
    evt = wh.verify(payload,headers) as Event; 
  } catch (err) {
    console.error((err as Error).message);
    res.status(400).json({});
    return;
  }

  const eventType = evt.type as EventType;
  console.log("evt data", evt.data);
  const { id, image_url, first_name, last_name, email_addresses } = evt.data as User;
  const email = email_addresses?.length > 0 && email_addresses?.map((email: Email) => email.email_address)[0] || "";

  if (eventType === "user.created") {
    console.log("event type is user created")
    const user = await prisma.user.create({
      data: {
        id: id as string,
        image: image_url as string,
        name: `${first_name} ${last_name}`,
        email: email as string,
      }
    });

    console.log("user created!", user);

    return user;
  }

  if (eventType === "user.updated") {
    console.log("event type is user updated");
    const updatedUser = await prisma.user.update({
      where: {
        id: id as string,
      },
      data: {
        image: image_url as string,
        name: `${first_name} ${last_name}`,
        email: email as string,
      }
    });

    console.log("user updated", updatedUser);

    return updatedUser;
  }

  if (eventType === "user.deleted") {
    console.log("user deleted")
    await prisma.user.delete({ where: { id: id as string } });
  }
  
  res.status(200).json({ message: "Webhook processed successfully" });
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

type EventType = "user.created" | "user.updated" | "user.deleted";

type Event = {
  data: any;
  object: "event";
  type: EventType;
} | WebhookEvent;

interface User {
  id: string;
  image_url: string;
  first_name: string;
  last_name: string;
  email_addresses: Email[]
}

interface Email {
  email_address: string;
}