// "use server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "../../lib/auth";
// import prisma from "@repo/db/client";

// export async function p2pTransfer(to:string,amount:number) {
//     const session = await getServerSession(authOptions);
//     const from = session?.user?.id;
//     if(!from) {
//         throw new Error("Invalid parameters for P2P transfer");
//     }
//     const toUser = await prisma.user.findFirst({
//         where:{
//             number:to
//         }
//     });
//     if(!toUser){
//         return {
//             message:"User not found"
//         }
//     }

//     await prisma.$transaction(async (tx) => {
//         const fromBalance = await tx.balance.findUnique({
//             where:{userId:Number(from)}
//         });
//         if(!fromBalance || fromBalance.amount < amount) {
//             throw new Error("Insufficient balance");
//         }
//         await tx.balance.update({
//             where:{userId:Number(from)},
//             data:{amount:{decrement:amount}}
//         })

//         await tx.balance.update({
//             where:{userId:Number(to)},
//             data:{amount:{increment:amount}}
//         })
//     })
// }


"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }

    //property of transaction either none happen or all happen Atomically
    //if any error occurs in the transaction, it will rollback all changes


//If multiple P2P transfers are called at the same time, without proper locking or sequencing, the sender’s balance can go negative due to race conditions.

//his happens because:

//Two transactions read the same balance simultaneously.

//Both think the sender has enough funds.

//Both decrement, resulting in overdraft.

//Solution:
//1️⃣ Database-Level Row Locking (Recommended)
//Use SELECT … FOR UPDATE to lock the balance row during the transaction

//2️⃣ Optimistic Concurrency Check
//Instead of locking, use where conditions to ensure balance is still sufficient before updating:

//3 Queue P2P Transfers


    await prisma.$transaction(async (tx) => {

//solution 1: Locking the row and queryRaw is used to write the raw SQL query as prisma does not support FOR UPDATE directly
await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; ///this locks the row for the duration of the transaction

        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
          });
          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
          }

          await tx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
          });

          await tx.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
          });

          //log of p2p into db 

          await tx.p2pTransfer.create({
            data: {
              fromUserId: Number(from),
              toUserId: toUser.id,
              amount: amount,
              timestamp: new Date(),
            },
          });
    });
}