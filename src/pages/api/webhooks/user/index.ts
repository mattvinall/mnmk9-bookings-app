// import { Prisma, PrismaClient } from "@prisma/client";
// import { NextApiRequest, NextApiResponse } from "next";
// import { Webhook, WebhookRequiredHeaders } from "svix";
// import type { WebhookEvent } from "@clerk/clerk-sdk-node"
// import { IncomingHttpHeaders } from "http";

// const prisma = new PrismaClient();

// // webhook secret
// const webhookSecret = process.env.WEBHOOK_SECRET || "";

// export default async function handler(req: NextApiRequestWithSvixRequiredHeaders, res: NextApiResponse) {
//   const payload = JSON.stringify(req.body)
//   console.log("payload", payload);

//   const headers = req.headers;

//   const wh = new Webhook(webhookSecret);

//   let evt: Event | null = null;
//   try {
//     evt = wh.verify(payload, headers) as Event;
//     console.log("event webhook", evt);
//   } catch (err) {
//     console.error((err as Error).message);
//     res.status(400).json({});
//     return;
//   }

//   const eventType = evt.type as EventType;
//   console.log("event type", eventType);
  
  
//   if (eventType === "user.created") {
//     const { id, image_url, first_name, last_name, email_addresses } = evt.data;
//     const email = email_addresses?.length > 0 && email_addresses?.map((email: any) => email.email_address)[0];
//     console.log("email", email);
//     await prisma.user.create({
//       data: {
//         id: id as string,
//         image: image_url as string,
//         name: `${first_name} ${last_name}`,
//         email: email as string,
//       }
//     });
//     console.log(`User ${id} was ${eventType}`);
//     res.status(201).json({ message: "user was created successfully" });
//   } else if (eventType === "user.updated") {
//     const { id, image_url, first_name, last_name, email_addresses } = evt.data;
//     const email = email_addresses?.length > 0 && email_addresses?.map((email: any) => email.email_address)[0];
//     await prisma.user.update({
//       where: {
//         id: id as string,
//       },
//       data: {
//         image: image_url as string,
//         name: `${first_name} ${last_name}`,
//         email: email as string,
//       }
//     });
//     console.log(`User ${id} was ${eventType}`);
//     res.status(201).json({ message: "user was updated successfully" });
//   } else { 
//     console.log("event type not created or updated", eventType);
//   }
// }






import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Webhook, WebhookRequiredHeaders } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node"
import { IncomingHttpHeaders } from "http";

const prisma = new PrismaClient();

// webhook secret
const webhookSecret = process.env.WEBHOOK_SECRET as string || "";

export default async function handler(req: NextApiRequestWithSvixRequiredHeaders, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const payload = JSON.stringify(req.body);
  console.log("payload", payload);

  const headers = req.headers;

  // const headersList = req.headers;
  // const heads = {
  //   "svix-id": headersList["svix-id"],
  //   "svix-timestamp": headersList["svix-timestamp"],
  //   "svix-signature": headersList["svix-signature"],
  // };

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