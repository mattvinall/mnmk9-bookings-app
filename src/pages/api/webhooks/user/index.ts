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
  const { id, image_url, first_name, last_name, email_addresses } = evt.data;
  const email = email_addresses?.length > 0 && email_addresses?.map((email: any) => email.email_address)[0];
  
  if (eventType === "user.created") {
    await prisma.user.create({
      data: {
        id: id as string,
        image: image_url as string,
        name: `${first_name} ${last_name}`,
        email: email as string,
      }
    });
  }
  
  if (eventType === "user.updated") {
    await prisma.user.update({
      where: {
        id: id as string,
      },
      data: {
        image: image_url as string,
        name: `${first_name} ${last_name}`,
        email: email as string,
      }
    });
  } 

  res.status(200).json({ message: "Webhook processed successfully" });
}

type EventType = "user.created" | "user.updated";

type Event = {
  data: any;
  object: "event";
  type: EventType;
} | WebhookEvent;