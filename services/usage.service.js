import Usage from "../../models/Usage.js";

export async function registerUsage({
  client,
  tokens = 0,
  cost = 0,
  source = "api",
  provider = "local",
}) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const usage = await Usage.findOneAndUpdate(
    {
      clientId: client._id,
      "period.month": month,
      "period.year": year,
    },
    {
      $inc: {
        "usage.messages": 1,
        "usage.tokens": tokens,
        "usage.cost": cost,
        [`byProvider.${provider}.messages`]: 1,
        [`byProvider.${provider}.tokens`]: tokens,
        ...(provider === "openai" && {
          [`byProvider.openai.cost`]: cost,
        }),
        [`bySource.${source}`]: 1,
      },
      $setOnInsert: {
        planSnapshot: {
          name: client.plan,
          limits: client.limits,
        },
        startedAt: now,
      },
    },
    { upsert: true, new: true }
  );

  return usage;
}