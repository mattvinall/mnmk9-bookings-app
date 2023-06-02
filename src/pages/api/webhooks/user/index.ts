import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Webhook, WebhookRequiredHeaders } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node" 
import { IncomingHttpHeaders } from "http";

const prisma = new PrismaClient();
const webhookSecret = process.env.WEBHOOK_SECRET || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const payload = req.body
  console.log("payload", payload);

  const headersList = req.headers;
  const heads = {
    "svix-id": headersList["svix-id"],
    "svix-timestamp": headersList["svix-timestamp"],
    "svix-signature": headersList["svix-signature"],
  };

  const wh = new Webhook(webhookSecret);

  let evt: Event | null = null;

  try {
    evt = wh.verify(JSON.stringify(payload), heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event;
  } catch (err) {
    console.error((err as Error).message);
    res.status(400).json({});
    return;
  }

  const eventType = evt.type as EventType;
  if (
    eventType === "user.created" ||
    eventType === "user.updated"
  ) {
    console.log("event data", evt.data );
    const { id, image_url, first_name, last_name, email_addresses } = evt.data;
    const email = email_addresses?.length > 0 && email_addresses[0].email_address || null;
    console.log("TEST EMAIL Webhook", email)
    const user = await prisma.user.upsert({
      where: { id: id as string },
      create: {
        id: id as string,
        image: image_url as string,
        name: `${first_name} ${last_name}`,
        email: "matt.vinall7@gmail.com",
      },
      update: {
        id: id as string,
        image: image_url as string,
        name: `${first_name} ${last_name}`,
        email: "matt.vinall7@gmail.com",
      }
    });

    console.log("user upserted into user talbe", user);
    return user;
  }

  res.status(200).json({ message: "Webhook processed successfully" });
}

type EventType = "user.created" | "user.updated" | "user.deleted";

type Event = {
  data: any;
  object: "event";
  type: EventType;
};