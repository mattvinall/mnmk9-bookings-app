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

   if (eventType === "user.deleted") {
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